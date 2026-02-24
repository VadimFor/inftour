"use client";

import { useLangStore } from "../lib/langStore";

function IconAI({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
function IconGastronomy({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
function IconNature({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M12 12.5V14a2 2 0 104 0v-1.5M12 3.935V5.5A2.5 2.5 0 0110.5 8h-.5a2 2 0 00-2 2v2.945M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconFamily({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
function IconRelax({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
function IconSport({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a3 3 0 11-6 0 3 3 0 016 0zM19 17a3 3 0 11-6 0 3 3 0 016 0zM6 14V8l4 2 4-2v6" />
    </svg>
  );
}

const SECTIONS: Array<{
  titleKey: "expAIGuide" | "expGastronomy" | "expNature" | "expFamily" | "expRelax" | "expSport";
  descKey: "expAIGuideDesc" | "expGastronomyDesc" | "expNatureDesc" | "expFamilyDesc" | "expRelaxDesc" | "expSportDesc";
  subs?: Array<{ labelKey: string }>;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    titleKey: "expAIGuide",
    descKey: "expAIGuideDesc",
    subs: undefined,
    Icon: IconAI,
  },
  {
    titleKey: "expGastronomy",
    descKey: "expGastronomyDesc",
    subs: [{ labelKey: "expRestaurants" }, { labelKey: "expMarkets" }, { labelKey: "expRecipes" }],
    Icon: IconGastronomy,
  },
  {
    titleKey: "expNature",
    descKey: "expNatureDesc",
    subs: [{ labelKey: "expIfach" }, { labelKey: "expSalinas" }, { labelKey: "expSeaside" }],
    Icon: IconNature,
  },
  {
    titleKey: "expFamily",
    descKey: "expFamilyDesc",
    subs: [{ labelKey: "expBBQ" }, { labelKey: "expFeria" }, { labelKey: "expCityGuide" }, { labelKey: "expEventsCalendar" }],
    Icon: IconFamily,
  },
  {
    titleKey: "expRelax",
    descKey: "expRelaxDesc",
    subs: undefined,
    Icon: IconRelax,
  },
  {
    titleKey: "expSport",
    descKey: "expSportDesc",
    subs: [{ labelKey: "expCycling" }, { labelKey: "expSportsFacilities" }, { labelKey: "expEquipmentRental" }, { labelKey: "expSportsEvents" }],
    Icon: IconSport,
  },
];

export default function ExperienciasContent() {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);

  return (
    <main className="relative z-20 pt-12 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-black mb-3">
            {t("expHeroTitle")}
          </h1>
          <p className="text-gray-500 font-light max-w-xl mx-auto text-lg">
            {t("expHeroDesc")}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SECTIONS.map((section) => (
            <article
              key={section.titleKey}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <section.Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-serif font-semibold text-brand-black mb-2">
                    {t(section.titleKey)}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {t(section.descKey)}
                  </p>
                  {section.subs && section.subs.length > 0 && (
                    <ul className="space-y-1.5">
                      {section.subs.map((sub) => (
                        <li key={sub.labelKey} className="text-gray-500 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                          {t(sub.labelKey as keyof typeof t)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
