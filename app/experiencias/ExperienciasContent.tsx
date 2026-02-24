"use client";

import { useLangStore } from "../lib/langStore";

export default function ExperienciasContent() {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);
  return (
    <main className="relative z-20 pt-12 pb-24 container mx-auto px-6">
      <h1 className="text-4xl md:text-5xl font-serif text-brand-black mb-4">
        {t("experienciasTitle")}
      </h1>
      <p className="text-gray-500 max-w-md font-light">
        {t("experienciasContent")}
      </p>
    </main>
  );
}
