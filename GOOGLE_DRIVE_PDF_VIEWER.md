# Google Drive PDF Viewer — Next.js

A Next.js page that lists PDFs from a public Google Drive folder as article cards. Each card shows a thumbnail, title, text excerpt, and page count. Clicking opens a modal with an embedded viewer and download link.

---

## Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- `pdf-lib` — page count
- `pdfjs-dist` — text extraction

---

## 1. Install dependencies

```bash
npm install pdf-lib pdfjs-dist
```

---

## 2. Environment variable

Create `.env.local` at the project root:

```
GOOGLE_API_KEY=AIzaSyDrZiTjWPVMvNuvwAMnx8CB9hlEzpE_URk
```

> **How to get the key:**
> 1. Go to [console.cloud.google.com](https://console.cloud.google.com)
> 2. Create a project → enable **Google Drive API**
> 3. Credentials → **+ Create credentials** → **API key**
> 4. Restrict the key to the Drive API (optional but recommended)
>
> **Requirements for the Drive folder:**
> The folder must be shared as **"Anyone with the link can view"**.

---

## 3. `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // prevent Next.js from bundling pdfjs-dist (avoids worker conflicts)
  serverExternalPackages: ["pdfjs-dist"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
  },
};

export default nextConfig;
```

---

## 4. `lib/drive.ts`

Fetches file list, thumbnail (base64), page count, and text excerpt from each PDF.

```ts
import { PDFDocument } from "pdf-lib";

export interface DriveFile {
  id: string;
  name: string;
  pages: number | null;
  thumbnail: string | null;
  excerpt: string | null;
}

// ← Replace with your Google Drive folder ID
const FOLDER_ID = "1tEdwGPSe6PJuMEa56nLVp249P-4CPCQC";

async function fetchPdfBuffer(fileId: string): Promise<Uint8Array | null> {
  try {
    const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function getPdfPageCount(data: Uint8Array): Promise<number | null> {
  try {
    const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
    return pdf.getPageCount();
  } catch {
    return null;
  }
}

async function getPdfExcerpt(data: Uint8Array): Promise<string | null> {
  try {
    // dynamic import avoids Next.js bundler conflicts with pdfjs-dist
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    let text = "";
    const maxPages = Math.min(pdf.numPages, 3);

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      text += pageText + " ";
      if (text.trim().length > 600) break;
    }

    const cleaned = text.replace(/\s+/g, " ").trim();
    return cleaned.length > 0 ? cleaned : null;
  } catch (e) {
    console.error("PDF excerpt error:", e);
    return null;
  }
}

async function getThumbnailBase64(fileId: string): Promise<string | null> {
  try {
    // Google Drive public thumbnail URL (works for publicly shared files)
    const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

export async function getDrivePdfFiles(): Promise<DriveFile[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY environment variable is not set.");

  const query = encodeURIComponent(
    `'${FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`
  );
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&orderBy=name&key=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Google Drive API error: ${await res.text()}`);

  const data = await res.json();
  const files: { id: string; name: string }[] = data.files;

  const filesWithDetails = await Promise.all(
    files.map(async (file) => {
      const [pdfData, thumbnail] = await Promise.all([
        fetchPdfBuffer(file.id),
        getThumbnailBase64(file.id),
      ]);

      const [pages, excerpt] = pdfData
        ? await Promise.all([getPdfPageCount(pdfData), getPdfExcerpt(pdfData)])
        : [null, null];

      return { id: file.id, name: file.name, pages, thumbnail, excerpt };
    })
  );

  return filesWithDetails;
}
```

---

## 5. `app/page.tsx`

Server component — fetches data and passes it to the client grid.

```tsx
import { getDrivePdfFiles } from "@/lib/drive";
import PdfGrid from "./components/PdfGrid";

export default async function Home() {
  const files = await getDrivePdfFiles();

  return (
    <main className="min-h-screen py-14 px-6" style={{ background: "#f5f0eb" }}>
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl italic mb-2"
          style={{ fontFamily: "Georgia, serif", color: "#5c3d2e" }}
        >
          Latest articles
        </h1>
        <hr className="mb-10" style={{ borderColor: "#d6c9bc" }} />

        {files.length === 0 ? (
          <p className="italic text-gray-400">No PDF files found.</p>
        ) : (
          <PdfGrid files={files} />
        )}
      </div>
    </main>
  );
}
```

---

## 6. `app/components/PdfGrid.tsx`

Client component — renders the article cards and manages modal state.

```tsx
"use client";

import { useState } from "react";
import type { DriveFile } from "@/lib/drive";
import PdfModal from "./PdfModal";

type PdfGridProps = {
  files: DriveFile[];
};

export default function PdfGrid({ files }: PdfGridProps) {
  const [selected, setSelected] = useState<DriveFile | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {files.map((file) => {
          const title = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
          const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

          return (
            <div
              key={file.id}
              className="bg-white overflow-hidden flex flex-col cursor-pointer group"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderRadius: "2px" }}
              onClick={() => setSelected(file)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(file); }}
              aria-label={`Abrir ${displayTitle}`}
            >
              {/* Thumbnail */}
              <div className="w-full overflow-hidden" style={{ height: "220px" }}>
                {file.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.thumbnail}
                    alt={displayTitle}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "#ede8e3" }}>
                    <svg className="w-12 h-12" style={{ color: "#c9bdb4" }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="px-5 py-5 flex flex-col gap-2">
                <h2
                  className="text-lg leading-snug"
                  style={{ fontFamily: "Georgia, serif", color: "#3b2a1e" }}
                >
                  {displayTitle}
                </h2>

                {file.excerpt && (
                  <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#b05a3a" }}>
                    {file.excerpt}
                  </p>
                )}

                {file.pages !== null && (
                  <p className="text-xs text-right mt-1" style={{ color: "#a07850" }}>
                    {file.pages} {file.pages === 1 ? "página" : "páginas"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <PdfModal file={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
```

---

## 7. `app/components/PdfModal.tsx`

Client component — modal with embedded PDF viewer, download link, and close button.

```tsx
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { DriveFile } from "@/lib/drive";

type PdfModalProps = {
  file: DriveFile;
  onClose: () => void;
};

export default function PdfModal({ file, onClose }: PdfModalProps) {
  // lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const title = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[98vh] shadow-2xl overflow-hidden flex flex-col"
        style={{ borderRadius: "2px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 pt-6 pb-5 border-b border-gray-200 pr-14" style={{ background: "#f5f0eb" }}>
          <div className="h-px w-10 mb-3" style={{ background: "#a07850" }} />
          <h2
            id="pdf-modal-title"
            className="text-xl leading-snug"
            style={{ fontFamily: "Georgia, serif", color: "#3b2a1e" }}
          >
            {displayTitle}
          </h2>
          {file.pages !== null && (
            <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: "#a07850" }}>
              {file.pages} {file.pages === 1 ? "página" : "páginas"}
            </p>
          )}
        </div>

        {/* PDF viewer */}
        <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <iframe
            src={`https://drive.google.com/file/d/${file.id}/preview`}
            className="w-full h-full border-0"
            style={{ minHeight: "75vh" }}
            allow="autoplay"
            title={displayTitle}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between" style={{ background: "#faf8f5" }}>
          <a
            href={`https://drive.usercontent.google.com/download?id=${file.id}&export=download`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded transition hover:opacity-90"
            style={{ background: "#1d4ed8" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Descargar PDF
          </a>

          <button
            type="button"
            onClick={onClose}
            className="text-white text-sm font-semibold px-5 py-2 rounded transition hover:opacity-90"
            style={{ background: "#3b2a1e" }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
```

---

## File structure

```
app/
├── page.tsx                   ← server component, fetches data
├── components/
│   ├── PdfGrid.tsx            ← client component, card grid + modal state
│   └── PdfModal.tsx           ← client component, modal with PDF viewer
lib/
└── drive.ts                   ← Google Drive API + PDF parsing
.env.local                     ← GOOGLE_API_KEY=...
next.config.ts                 ← serverExternalPackages + image domains
```

---

## How thumbnail, excerpt and pages work

| Feature | How |
|---|---|
| Thumbnail | `https://drive.google.com/thumbnail?id=FILE_ID&sz=w400` fetched server-side → returned as base64 data URL |
| Page count | `pdf-lib` loads the PDF buffer and calls `getPageCount()` |
| Excerpt | `pdfjs-dist` (dynamic import) extracts text from the first 3 pages, trimmed to ~600 chars |
| PDF viewer in modal | Google Drive embed: `https://drive.google.com/file/d/FILE_ID/preview` inside an `<iframe>` |
| Download link | `https://drive.usercontent.google.com/download?id=FILE_ID&export=download` |

---

## Notes

- The API key is only used to list files (Drive API v3). It is **not** needed to download or preview public files.
- Thumbnails, downloads, and the iframe preview all work without authentication as long as the folder/file is publicly shared.
- `pdfjs-dist` must be in `serverExternalPackages` to avoid Turbopack bundling conflicts.
- If the folder is private, the thumbnail and download will not work — you would need OAuth2.
