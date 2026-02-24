"use client";

import Image from "next/image";
import { useLangStore } from "../lib/langStore";

const PLACEHOLDER_SPREADS = [
  {
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    alt: "Apartment interior",
    titleKey: "revistaSpread1Title" as const,
    textKey: "revistaSpread1Text" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    alt: "Pool and sea view",
    titleKey: "revistaSpread2Title" as const,
    textKey: "revistaSpread2Text" as const,
  },
  {
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    alt: "Villa terrace",
    titleKey: "revistaSpread3Title" as const,
    textKey: "revistaSpread3Text" as const,
  },
];

type Props = { pdfPath: string | null };

export default function RevistaContent({ pdfPath }: Props) {
  const t = useLangStore((s) => s.t);

  if (pdfPath) {
    return (
      <main className="relative z-20 pt-8 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-black">
              {t("revistaTitle")}
            </h1>
            <p className="text-gray-500 mt-2 font-light">
              {t("revistaTagline")}
            </p>
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2.5 bg-brand-gold text-white font-medium rounded-lg hover:opacity-90 transition"
            >
              {t("revistaDownload")}
            </a>
          </header>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100 min-h-[70vh]">
            <iframe
              src={`${pdfPath}#view=FitH`}
              title={t("revistaTitle")}
              className="w-full h-[75vh] min-h-[600px]"
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-20 pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Cover */}
        <header className="text-center mb-16">
          <div className="relative aspect-3/2 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl mb-8">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <h1 className="text-3xl md:text-4xl font-serif font-bold drop-shadow">
                {t("revistaTitle")}
              </h1>
              <p className="text-white/90 font-light mt-2 drop-shadow">
                {t("revistaTagline")}
              </p>
            </div>
          </div>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            {t("revistaPlaceholderIntro")}
          </p>
        </header>

        {/* Placeholder spreads */}
        <section className="space-y-20">
          {PLACEHOLDER_SPREADS.map((spread, index) => (
            <article
              key={spread.titleKey}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center"
            >
              <div
                className={`relative aspect-4/3 rounded-xl overflow-hidden shadow-md ${
                  index % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={spread.image}
                  alt={spread.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <h2 className="text-2xl font-serif font-semibold text-brand-black mb-3">
                  {t(spread.titleKey)}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t(spread.textKey)}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
