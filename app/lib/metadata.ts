import type { Metadata } from "next";
import { LANG_TO_HREFLANG, VALID_LANGS, localizedPath } from "./i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rent.inftour.es";
const SITE_NAME = "INFTOUR";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const imageUrl = new URL("/opengraph-image", SITE_URL).toString();
  const languageAlternates = Object.fromEntries(
    VALID_LANGS.map((lang) => [
      LANG_TO_HREFLANG[lang],
      new URL(localizedPath(path, lang), SITE_URL).toString(),
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...languageAlternates,
        "x-default": url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
