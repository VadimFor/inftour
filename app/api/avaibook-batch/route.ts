import { NextRequest, NextResponse } from "next/server";

const AVAIBOOK_API = "https://api.avaibook.com/api/owner";
const AVAIBOOK_TOKEN =
  process.env.AVAIBOOK_TOKEN_PROPERTY_INFO || process.env.AVAIBOOK_TOKEN;
const AVAIBOOK_ROTATION_TOKENS = Array.from({ length: 30 }, (_, index) =>
  process.env[`AVAIBOOK_TOKEN_${index}`],
).filter((token): token is string => Boolean(token && token.trim().length));
let rotationTokenCursor = 0;

const DETAIL_CACHE_TTL_MS = 10 * 60 * 1000;
const UPSTREAM_GAP_MS = 100;
const UPSTREAM_MAX_CONCURRENT = 4;
const UPSTREAM_429_BASE_MS = 2000;
const UPSTREAM_429_MAX_MS = 15000;
const UPSTREAM_MAX_RETRIES = 4;

type CachedDetail = {
  data: unknown;
  expiresAt: number;
};

type BatchItemResult = {
  id: number;
  ok: boolean;
  status: number;
  data?: unknown;
  error?: string;
  retryAfterMs?: number;
};

const detailCache = new Map<number, CachedDetail>();
const inflightDetails = new Map<number, Promise<BatchItemResult>>();

let upstreamStartQueue: Promise<void> = Promise.resolve();
let upstreamNextAllowedAt = 0;
let upstreamActiveCount = 0;
const upstreamSlotWaiters: Array<() => void> = [];

function getNextRotationToken(currentToken?: string): string | undefined {
  if (!AVAIBOOK_ROTATION_TOKENS.length) return undefined;

  for (let attempt = 0; attempt < AVAIBOOK_ROTATION_TOKENS.length; attempt++) {
    const token =
      AVAIBOOK_ROTATION_TOKENS[rotationTokenCursor % AVAIBOOK_ROTATION_TOKENS.length];
    rotationTokenCursor += 1;
    if (token !== currentToken || AVAIBOOK_ROTATION_TOKENS.length === 1) {
      return token;
    }
  }

  return currentToken;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(retryAfterHeader: string | null): number | undefined {
  if (!retryAfterHeader) return undefined;

  const seconds = Number.parseFloat(retryAfterHeader);
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000);
  }

  const absoluteTime = Date.parse(retryAfterHeader);
  if (Number.isNaN(absoluteTime)) return undefined;

  return Math.max(0, absoluteTime - Date.now());
}

function getCachedDetail(id: number): unknown | null {
  const cached = detailCache.get(id);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    detailCache.delete(id);
    return null;
  }
  return cached.data;
}

function scheduleUpstreamStart(): Promise<void> {
  const previous = upstreamStartQueue;
  let release = () => {};
  upstreamStartQueue = new Promise<void>((resolve) => {
    release = resolve;
  });

  return previous
    .then(async () => {
      const waitMs = upstreamNextAllowedAt - Date.now();
      if (waitMs > 0) {
        await wait(waitMs);
      }
      upstreamNextAllowedAt = Date.now() + UPSTREAM_GAP_MS;
    })
    .finally(() => {
      release();
    });
}

async function acquireUpstreamSlot(): Promise<void> {
  if (upstreamActiveCount < UPSTREAM_MAX_CONCURRENT) {
    upstreamActiveCount += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    upstreamSlotWaiters.push(resolve);
  });
  upstreamActiveCount += 1;
}

function releaseUpstreamSlot(): void {
  upstreamActiveCount = Math.max(0, upstreamActiveCount - 1);
  const next = upstreamSlotWaiters.shift();
  if (next) {
    next();
  }
}

async function runInUpstreamQueue<T>(task: () => Promise<T>): Promise<T> {
  await acquireUpstreamSlot();

  return scheduleUpstreamStart()
    .then(task)
    .finally(() => {
      releaseUpstreamSlot();
    });
}

async function fetchDetailFromUpstream(id: number): Promise<BatchItemResult> {
  let authToken = AVAIBOOK_TOKEN || getNextRotationToken();
  if (!authToken) {
    return {
      id,
      ok: false,
      status: 500,
      error: "Missing AVAIBOOK_TOKEN_PROPERTY_INFO",
    };
  }

  for (let attempt = 0; attempt <= UPSTREAM_MAX_RETRIES; attempt++) {
    const response = await fetch(`${AVAIBOOK_API}/accommodations/${id}/`, {
      headers: {
        accept: "application/json",
        "X-AUTH-TOKEN": authToken,
      },
      cache: "no-store",
    });

    const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));

    if (response.status === 429) {
      const cooldown = Math.max(
        retryAfterMs ?? 0,
        Math.min(UPSTREAM_429_MAX_MS, UPSTREAM_429_BASE_MS * 2 ** attempt),
      );
      upstreamNextAllowedAt = Math.max(upstreamNextAllowedAt, Date.now() + cooldown);
      console.warn(
        `[avaibook-batch] 429 for accommodation ${id}. Rotating token (attempt ${attempt + 1}/${UPSTREAM_MAX_RETRIES + 1}).`,
      );
      const rotatedToken = getNextRotationToken(authToken);
      if (rotatedToken) {
        authToken = rotatedToken;
      } else {
        console.warn(
          `[avaibook-batch] No alternative token available after 429 for accommodation ${id}.`,
        );
      }

      if (attempt < UPSTREAM_MAX_RETRIES) {
        await scheduleUpstreamStart();
        continue;
      }

      return {
        id,
        ok: false,
        status: 429,
        error: "API 429",
        retryAfterMs: cooldown,
      };
    }

    const text = await response.text();
    let data: unknown = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      return {
        id,
        ok: false,
        status: response.status,
        error:
          typeof data === "string" && data.trim().length
            ? data
            : `API ${response.status}`,
      };
    }

    detailCache.set(id, {
      data,
      expiresAt: Date.now() + DETAIL_CACHE_TTL_MS,
    });

    return {
      id,
      ok: true,
      status: response.status,
      data,
    };
  }

  return {
    id,
    ok: false,
    status: 500,
    error: "Unexpected batch fetch failure",
  };
}

function getDetail(id: number): Promise<BatchItemResult> {
  const cached = getCachedDetail(id);
  if (cached !== null) {
    return Promise.resolve({
      id,
      ok: true,
      status: 200,
      data: cached,
    });
  }

  const inflight = inflightDetails.get(id);
  if (inflight) return inflight;

  const promise = runInUpstreamQueue(async () => {
    const cachedAgain = getCachedDetail(id);
    if (cachedAgain !== null) {
      return {
        id,
        ok: true,
        status: 200,
        data: cachedAgain,
      } satisfies BatchItemResult;
    }

    return fetchDetailFromUpstream(id);
  }).finally(() => {
    inflightDetails.delete(id);
  });

  inflightDetails.set(id, promise);
  return promise;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rawIds = request.nextUrl.searchParams.getAll("id");
  const ids = rawIds
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!ids.length) {
    return NextResponse.json(
      { error: "At least one id query parameter is required." },
      { status: 400 },
    );
  }

  const results = await Promise.all(ids.map((id) => getDetail(id)));

  const retryAfterMs = results.reduce<number | undefined>((max, item) => {
    if (item.status !== 429 || !item.retryAfterMs) return max;
    return typeof max === "number"
      ? Math.max(max, item.retryAfterMs)
      : item.retryAfterMs;
  }, undefined);

  return NextResponse.json(
    { results },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        ...(typeof retryAfterMs === "number"
          ? { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) }
          : {}),
      },
    },
  );
}
