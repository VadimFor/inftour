"use client";

import { useLangStore } from "../lib/langStore";

type TitleKey = "experienciasTitle" | "servicesTitle" | "revistaTitle" | "lobbyTitle";

export default function PagePlaceholder({ titleKey }: { titleKey: TitleKey }) {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);
  return (
    <main className="relative z-20 pt-12 pb-24 container mx-auto px-6 flex items-center justify-center min-h-[50vh]" data-lang={lang}>
      <h1 className="text-4xl md:text-5xl font-serif text-brand-black">
        {t(titleKey)}
      </h1>
    </main>
  );
}
