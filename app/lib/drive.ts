export interface DriveFile {
  id: string;
  name: string;
  pages: number | null;
  thumbnail: string | null;
  excerpt: string | null;
}

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

async function getPdfInfo(
  data: Uint8Array,
): Promise<{ pages: number | null; excerpt: string | null }> {
  try {
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
  } catch (e) {
    console.error("PDF parse error:", e);
    return { pages: null, excerpt: null };
  }
}

async function getThumbnailBase64(fileId: string): Promise<string | null> {
  try {
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

export type DrivePdfResult =
  | { ok: true; files: DriveFile[] }
  | { ok: false; error: "no_api_key" | "api_error" };

export async function getDrivePdfFiles(): Promise<DrivePdfResult> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return { ok: false, error: "no_api_key" };

  const query = encodeURIComponent(
    `'${FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`,
  );
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&orderBy=name&key=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return { ok: false, error: "api_error" };

  const data = await res.json();
  const files: { id: string; name: string }[] = data.files;

  const filesWithDetails = await Promise.all(
    files.map(async (file) => {
      const [pdfData, thumbnail] = await Promise.all([
        fetchPdfBuffer(file.id),
        getThumbnailBase64(file.id),
      ]);

      const { pages, excerpt } = pdfData
        ? await getPdfInfo(pdfData)
        : { pages: null, excerpt: null };

      return { id: file.id, name: file.name, pages, thumbnail, excerpt };
    }),
  );

  return { ok: true, files: filesWithDetails };
}
