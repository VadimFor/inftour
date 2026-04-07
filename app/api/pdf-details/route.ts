import { NextRequest, NextResponse } from "next/server";
import { getPdfDetails } from "../../lib/drive";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !/^[\w-]+$/.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const details = await getPdfDetails(id);
  return NextResponse.json(details, {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" },
  });
}
