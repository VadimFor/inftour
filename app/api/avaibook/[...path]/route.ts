import { NextRequest, NextResponse } from "next/server";

const AVAIBOOK_API = "https://api.avaibook.com/api/owner";
const AVAIBOOK_TOKEN_LEGACY = process.env.AVAIBOOK_TOKEN;
const AVAIBOOK_TOKEN_ALL_PROPERTIES =
  process.env.AVAIBOOK_TOKEN_ALL_PROPERTIES || AVAIBOOK_TOKEN_LEGACY;
const AVAIBOOK_TOKEN_PROPERTY_INFO =
  process.env.AVAIBOOK_TOKEN_PROPERTY_INFO || AVAIBOOK_TOKEN_LEGACY;
const AVAIBOOK_TOKEN_SEARCH =
  process.env.AVAIBOOK_TOKEN_SEARCH || AVAIBOOK_TOKEN_LEGACY;
const AVAIBOOK_ROTATION_TOKENS = Array.from({ length: 30 }, (_, index) =>
  process.env[`AVAIBOOK_TOKEN_${index}`],
).filter((token): token is string => Boolean(token && token.trim().length));
const AVAIBOOK_ROTATION_FALLBACK = AVAIBOOK_ROTATION_TOKENS[0];
let rotationTokenCursor = 0;

export const dynamic = "force-dynamic";

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

function resolveTokenForPath(targetPath: string): string | undefined {
  if (targetPath === "/accommodations" || targetPath === "/accommodations/") {
    return AVAIBOOK_TOKEN_ALL_PROPERTIES || AVAIBOOK_ROTATION_FALLBACK;
  }

  if (targetPath.startsWith("/accommodations/booking-price")) {
    return AVAIBOOK_TOKEN_SEARCH || AVAIBOOK_ROTATION_FALLBACK;
  }

  if (/^\/accommodations\/\d+\/?$/.test(targetPath)) {
    return AVAIBOOK_TOKEN_PROPERTY_INFO || AVAIBOOK_ROTATION_FALLBACK;
  }

  return (
    AVAIBOOK_TOKEN_SEARCH ||
    AVAIBOOK_TOKEN_ALL_PROPERTIES ||
    AVAIBOOK_TOKEN_PROPERTY_INFO ||
    AVAIBOOK_ROTATION_FALLBACK ||
    AVAIBOOK_TOKEN_LEGACY
  );
}

async function proxyAvaibook(request: NextRequest) {
  const prefix = "/api/avaibook";
  const pathname = request.nextUrl.pathname;
  const path = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length)
    : pathname;
  const targetPath = path.startsWith("/") ? path : `/${path}`;
  const authToken = resolveTokenForPath(targetPath);
  if (!authToken) {
    return NextResponse.json(
      {
        error:
          "Missing AvaiBook token. Set AVAIBOOK_TOKEN_ALL_PROPERTIES, AVAIBOOK_TOKEN_PROPERTY_INFO, AVAIBOOK_TOKEN_SEARCH, AVAIBOOK_TOKEN_0..N (or AVAIBOOK_TOKEN as fallback).",
      },
      { status: 500 },
    );
  }

  const targetUrl = new URL(`${AVAIBOOK_API}${targetPath}`);
  targetUrl.search = request.nextUrl.search;
  let requestToken = authToken;
  let response: Response | null = null;
  const maxAttempts = Math.max(1, AVAIBOOK_ROTATION_TOKENS.length);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    response = await fetch(targetUrl.toString(), {
      headers: {
        accept: "application/json",
        "X-AUTH-TOKEN": requestToken,
      },
    });

    if (response.status !== 429) {
      break;
    }

    console.warn(
      `[avaibook-proxy] 429 received for ${targetPath}. Rotating token (attempt ${attempt + 1}/${maxAttempts}).`,
    );

    const nextToken = getNextRotationToken(requestToken);
    if (!nextToken || nextToken === requestToken) {
      console.warn(
        `[avaibook-proxy] No alternative token available after 429 for ${targetPath}.`,
      );
      break;
    }
    requestToken = nextToken;
  }

  if (!response) {
    return NextResponse.json({ error: "Failed to fetch AvaiBook API" }, { status: 500 });
  }

  const text = await response.text();

  try {
    const data = text ? JSON.parse(text) : null;
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
        ...(response.headers.get("retry-after")
          ? { "Retry-After": response.headers.get("retry-after") as string }
          : {}),
      },
    });
  } catch {
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        ...(response.headers.get("retry-after")
          ? { "Retry-After": response.headers.get("retry-after") as string }
          : {}),
      },
    });
  }
}

export async function GET(request: NextRequest) {
  return proxyAvaibook(request);
}
