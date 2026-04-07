import { unstable_cache } from "next/cache";

export interface DriveFile {
  id: string;
  name: string;
}

export interface DriveFileDetails {
  pages: number | null;
  excerpt: string | null;
}

const FOLDER_ID = "1tEdwGPSe6PJuMEa56nLVp249P-4CPCQC";

export function getThumbnailUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
}

export type DriveListResult =
  | { ok: true; files: DriveFile[] }
  | { ok: false; error: "no_api_key" | "api_error" };

async function fetchDriveFileList(): Promise<DriveListResult> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return { ok: false, error: "no_api_key" };

  const query = encodeURIComponent(
    `'${FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`,
  );
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&orderBy=name&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return { ok: false, error: "api_error" };

  const data = await res.json();
  const files: DriveFile[] = data.files;
  return { ok: true, files };
}

export const getDriveFileList = unstable_cache(
  fetchDriveFileList,
  ["drive-file-list"],
  { revalidate: 3600 },
);

export async function getPdfDetails(fileId: string): Promise<DriveFileDetails> {
  try {
    const url = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return { pages: null, excerpt: null };

    const data = new Uint8Array(await res.arrayBuffer());
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const pages = pdf.numPages;

    let text = "";
    const maxPages = Math.min(pages, 3);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      text += pageText + " ";
      if (text.trim().length > 600) break;
    }

    const excerpt = text.replace(/\s+/g, " ").trim() || null;
    return { pages, excerpt };
  } catch {
    return { pages: null, excerpt: null };
  }
}

// Keep for backwards compat if anything still imports these
export type DrivePdfResult = DriveListResult;
