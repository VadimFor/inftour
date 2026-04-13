import { unstable_cache } from "next/cache";

export interface DriveFile {
  id: string;
  name: string;
}

export interface DriveFileDetails {
  pages: number | null;
  excerpt: string | null;
  content: string | null;
}

export interface DriveFileWithSlug extends DriveFile {
  slug: string;
}

const FOLDER_ID = "1tEdwGPSe6PJuMEa56nLVp249P-4CPCQC";

export function getThumbnailUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
}

export function getPdfPreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function getPdfDownloadUrl(fileId: string): string {
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
}

export function getPdfTitle(fileName: string): string {
  const title = fileName.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").trim();
  return title ? title.charAt(0).toUpperCase() + title.slice(1) : "INFTOUR article";
}

export function slugifyPdfTitle(fileName: string): string {
  const base = fileName
    .replace(/\.pdf$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "pdf";
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

export async function getDriveFileListWithSlugs(): Promise<
  | { ok: true; files: DriveFileWithSlug[] }
  | { ok: false; error: "no_api_key" | "api_error" }
> {
  const result = await getDriveFileList();
  if (!result.ok) return result;

  return { ok: true, files: withDriveFileSlugs(result.files) };
}

export function withDriveFileSlugs(files: DriveFile[]): DriveFileWithSlug[] {
  const slugCounts = new Map<string, number>();
  return files.map((file) => {
      const baseSlug = slugifyPdfTitle(file.name);
      const count = slugCounts.get(baseSlug) ?? 0;
      slugCounts.set(baseSlug, count + 1);

      return {
        ...file,
        slug: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
      };
  });
}

export async function getDriveFileBySlug(
  slug: string,
): Promise<DriveFileWithSlug | null> {
  const result = await getDriveFileListWithSlugs();
  if (!result.ok) return null;
  return result.files.find((file) => file.slug === slug) ?? null;
}

const fetchPdfDetails = unstable_cache(
  async (fileId: string): Promise<DriveFileDetails> => {
  try {
    const url = getPdfDownloadUrl(fileId);
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return { pages: null, excerpt: null, content: null };

    const data = new Uint8Array(await res.arrayBuffer());
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const pages = pdf.numPages;

    let text = "";
    for (let i = 1; i <= pages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      text += pageText + " ";
    }

    const normalizedText = text.replace(/\s+/g, " ").trim() || null;
    const excerpt = normalizedText ? normalizedText.slice(0, 420).trim() : null;
    return { pages, excerpt, content: normalizedText };
  } catch {
    return { pages: null, excerpt: null, content: null };
  }
  },
  ["pdf-details"],
  { revalidate: 86400 },
);

export async function getPdfDetails(fileId: string): Promise<DriveFileDetails> {
  return fetchPdfDetails(fileId);
}

// Keep for backwards compat if anything still imports these
export type DrivePdfResult = DriveListResult;
