import { NextRequest, NextResponse } from "next/server";

const AVAIBOOK_API = "https://api.avaibook.com/api/owner";
const AVAIBOOK_TOKEN = process.env.AVAIBOOK_TOKEN;

export const dynamic = "force-dynamic";

async function proxyAvaibook(request: NextRequest) {
  if (!AVAIBOOK_TOKEN) {
    return NextResponse.json(
      { error: "Missing AVAIBOOK_TOKEN" },
      { status: 500 },
    );
  }

  const prefix = "/api/avaibook";
  const pathname = request.nextUrl.pathname;
  const path = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length)
    : pathname;
  const targetPath = path.startsWith("/") ? path : `/${path}`;
  const targetUrl = new URL(`${AVAIBOOK_API}${targetPath}`);
  targetUrl.search = request.nextUrl.search;

  const response = await fetch(targetUrl.toString(), {
    headers: {
      accept: "application/json",
      "X-AUTH-TOKEN": AVAIBOOK_TOKEN,
    },
  });

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
