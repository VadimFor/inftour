import type { MetadataRoute } from "next";
import { getDriveFileListWithSlugs } from "./lib/drive";
import { modalSeoPages } from "./lib/modalSeoPages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inftour.com";
const DEFAULT_LAST_MODIFIED = new Date("2026-04-13T00:00:00.000Z");
const pages = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/experiencias", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "weekly", priority: 0.8 },
  { path: "/revista", changeFrequency: "weekly", priority: 0.8 },
  { path: "/lobby", changeFrequency: "monthly", priority: 0.8 },
  ...modalSeoPages.map((modalPage) => ({
    path: modalPage.seoPath,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const driveResult = await getDriveFileListWithSlugs();
  const drivePages = driveResult.ok
    ? driveResult.files.map((file) => ({
        path: `/revista/${file.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    : [];

  return [...pages, ...drivePages].map((page) => ({
    url: new URL(page.path, SITE_URL).toString(),
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
