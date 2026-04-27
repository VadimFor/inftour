export type Lang = "eng" | "esp" | "ru" | "fr" | "it" | "de" | "uk" | "pl";

export const VALID_LANGS: Lang[] = ["eng", "esp", "ru", "fr", "it", "de", "uk", "pl"];

export const LANG_TO_HTML: Record<Lang, string> = {
  eng: "en",
  esp: "es",
  ru: "ru",
  fr: "fr",
  it: "it",
  de: "de",
  uk: "uk",
  pl: "pl",
};

export const LANG_TO_HREFLANG: Record<Lang, string> = {
  eng: "en",
  esp: "es-ES",
  ru: "ru",
  fr: "fr",
  it: "it",
  de: "de",
  uk: "uk",
  pl: "pl",
};

export function isLang(value: string | null | undefined): value is Lang {
  return !!value && VALID_LANGS.includes(value as Lang);
}

export function localizedPath(path: string, lang: Lang): string {
  const [pathname, hash = ""] = path.split("#");
  const [basePath, query = ""] = pathname.split("?");
  const params = new URLSearchParams(query);
  params.set("lang", lang);
  const qs = params.toString();
  const suffix = hash ? `#${hash}` : "";
  return `${basePath}${qs ? `?${qs}` : ""}${suffix}`;
}
