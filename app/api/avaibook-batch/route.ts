import { NextRequest, NextResponse } from "next/server";

const AVAIBOOK_API = "https://api.avaibook.com/api/owner";
const AVAIBOOK_TOKEN = process.env.AVAIBOOK_TOKEN;

const DETAIL_CACHE_TTL_MS = 10 * 60 * 1000;
const UPSTREAM_GAP_MS = 150;
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

let upstreamQueue: Promise<void> = Promise.resolve();
let upstreamNextAllowedAt = 0;

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

function runInUpstreamQueue<T>(task: () => Promise<T>): Promise<T> {
  const previous = upstreamQueue;
  let release = () => {};
  upstreamQueue = new Promise<void>((resolve) => {
    release = resolve;
  });

  return previous.then(task).finally(() => {
    release();
  });
}

async function fetchDetailFromUpstream(id: number): Promise<BatchItemResult> {
  if (!AVAIBOOK_TOKEN) {
    return {
      id,
      ok: false,
      status: 500,
      error: "Missing AVAIBOOK_TOKEN",
    };
  }

  for (let attempt = 0; attempt <= UPSTREAM_MAX_RETRIES; attempt++) {
    const waitMs = upstreamNextAllowedAt - Date.now();
    if (waitMs > 0) {
      await wait(waitMs);
    }

    const response = await fetch(`${AVAIBOOK_API}/accommodations/${id}/`, {
      headers: {
        accept: "application/json",
        "X-AUTH-TOKEN": AVAIBOOK_TOKEN,
      },
      cache: "no-store",
    });

    const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));

    if (response.status === 429) {
      const cooldown = Math.max(
        retryAfterMs ?? 0,
        Math.min(UPSTREAM_429_MAX_MS, UPSTREAM_429_BASE_MS * 2 ** attempt),
      );
      upstreamNextAllowedAt = Date.now() + cooldown;

      if (attempt < UPSTREAM_MAX_RETRIES) {
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

    upstreamNextAllowedAt = Date.now() + UPSTREAM_GAP_MS;

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
