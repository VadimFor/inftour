import { NextResponse } from "next/server";

const WEBCAM_URL =
  "https://ibericam.com/player/modern/player.html?s=4&a=live&v=calpe-playa-del-arenal-bol&i=image-4&l=ibericam";

const BASE_URL = "https://ibericam.com/player/modern/";

export async function GET() {
  try {
    const res = await fetch(WEBCAM_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch webcam page" },
        { status: res.status }
      );
    }

    let html = await res.text();

    // Inject <base> so relative URLs (./main.js, etc.) resolve to ibericam
    const baseTag = `<base href="${BASE_URL}">`;
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${baseTag}`);
    } else if (html.includes("<html>")) {
      html = html.replace("<html>", `<html><head>${baseTag}</head>`);
    } else {
      html = baseTag + html;
    }

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (e) {
    console.error("Webcam fetch error:", e);
    return NextResponse.json(
      { error: "Failed to fetch webcam" },
      { status: 500 }
    );
  }
}
