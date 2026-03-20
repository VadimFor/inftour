"use client";

import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../../lib/langStore";
import heroImage from "../pictures/chica_con_portatil.png";

function IconAI({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function IconSparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

const CARDS = [
  {
    titleKey: "svcCardAITitle" as const,
    items: ["svcCardAI1", "svcCardAI2", "svcCardAI3", "svcCardAI4"] as const,
    Icon: IconAI,
  },
  {
    titleKey: "svcCardRefTitle" as const,
    items: [
      "svcCardRef1",
      "svcCardRef2",
      "svcCardRef3",
      "svcCardRef4",
    ] as const,
    Icon: IconPhone,
  },
  {
    titleKey: "svcCardCleaningTitle" as const,
    descKey: "svcCardCleaningDesc" as const,
    Icon: IconSparkles,
  },
  {
    titleKey: "svcCardOfficeTitle" as const,
    descKey: "svcCardOfficeDesc" as const,
    Icon: IconBuilding,
  },
] as const;

export default function ServicesContent() {
  const { t } = useLangStore(useShallow((s) => ({ lang: s.lang, t: s.t })));

  return (
    <main className="relative z-20 pb-24">
      {/* Hero */}
      <section className="container mx-auto px-4 py-10 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="md:w-1/2">
            <span className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
              {t("svcHeroLabel")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 leading-tight">
              {t("svcHeroTitle1")}
              <br />
              <span className="italic text-gray-600">{t("svcHeroTitle2")}</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
              {t("svcHeroDesc")}
            </p>
          </div>
          <div className="w-full md:w-1/2 relative shrink-0">
            <div
              className="absolute -top-4 -left-4 w-32 h-32 bg-brand-gold/10 z-0 rounded-sm"
              aria-hidden
            />
            <div className="relative z-10 w-full min-h-[280px] h-[320px] sm:h-[380px] md:h-[500px] rounded-sm shadow-sm overflow-hidden">
              <Image
                src={heroImage}
                alt={t("svcHeroLabel")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 cards */}
      <section
        id="servicios"
        className="bg-white py-2 border-y border-gray-200"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CARDS.map((card) => (
              <article
                key={card.titleKey}
                className="group p-8 border border-gray-100 hover:border-brand-gold transition duration-300 shadow-sm rounded-sm bg-[#F8F9FA] hover:bg-white flex flex-col items-start"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white text-brand-gold rounded-full shadow-sm mb-6 group-hover:scale-110 transition">
                  <card.Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                  {t(card.titleKey)}
                </h2>
                {"items" in card ? (
                  <ul className="text-sm text-gray-600 font-light space-y-3 w-full">
                    {card.items.map((key) => (
                      <li key={key} className="flex items-start gap-2">
                        <span className="text-brand-gold mt-0.5 shrink-0">
                          ▪
                        </span>
                        {t(key)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    {t(card.descKey!)}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
