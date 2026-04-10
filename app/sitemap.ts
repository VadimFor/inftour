import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import path from "node:path";
import { modalSeoPages } from "./lib/modalSeoPages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inftour.com";
const pages = [
  { path: "/", sourceFile: "app/page.tsx", changeFrequency: "daily", priority: 1.0 },
  {
    path: "/reserva-directa-v2",
    sourceFile: "app/reserva-directa-v2/page.tsx",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  { path: "/experiencias", sourceFile: "app/experiencias/page.tsx", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", sourceFile: "app/services/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { path: "/revista", sourceFile: "app/revista/page.tsx", changeFrequency: "weekly", priority: 0.8 },
  { path: "/lobby", sourceFile: "app/lobby/page.tsx", changeFrequency: "monthly", priority: 0.8 },
  { path: "/modals", sourceFile: "app/modals/page.tsx", changeFrequency: "monthly", priority: 0.7 },
  ...modalSeoPages.map((modalPage) => ({
    path: `/modals/${modalPage.slug}`,
    sourceFile: "app/lib/modalSeoPages.ts",
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
] as const;

function getLastModifiedFromFile(sourceFile: string) {
  try {
    const filePath = path.join(process.cwd(), sourceFile);
    return statSync(filePath).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: new URL(page.path, SITE_URL).toString(),
    lastModified: getLastModifiedFromFile(page.sourceFile),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
