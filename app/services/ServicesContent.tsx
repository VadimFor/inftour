"use client";

import Image from "next/image";
import { useLangStore } from "../lib/langStore";

const SERVICES = [
  {
    titleKey: "service1Title" as const,
    descKey: "service1Desc" as const,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    alt: "Calpe beach and sea view",
  },
  {
    titleKey: "service2Title" as const,
    descKey: "service2Desc" as const,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    alt: "Hiking and outdoor experience",
  },
  {
    titleKey: "service3Title" as const,
    descKey: "service3Desc" as const,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    alt: "Friendly support team",
  },
] as const;

const PRACTICAL_ITEMS: Array<{
  titleKey: "practicalPolice" | "practicalMedical" | "practicalTransfers" | "practicalCarRental" | "practicalSupermarket" | "practicalBikeRental";
  detailKey: "practicalPoliceDetail" | "practicalMedicalDetail" | "practicalTransfersDetail" | "practicalCarRentalDetail" | "practicalSupermarketDetail" | "practicalBikeRentalDetail";
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    titleKey: "practicalPolice",
    detailKey: "practicalPoliceDetail",
    Icon: function IconPolice({ className }) {
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    },
  },
  {
    titleKey: "practicalMedical",
    detailKey: "practicalMedicalDetail",
    Icon: function IconMedical({ className }) {
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
    },
  },
  {
    titleKey: "practicalTransfers",
    detailKey: "practicalTransfersDetail",
    Icon: function IconTransfers({ className }) {
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      );
    },
  },
  {
    titleKey: "practicalCarRental",
    detailKey: "practicalCarRentalDetail",
    Icon: function IconCar({ className }) {
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    },
  },
  {
    titleKey: "practicalSupermarket",
    detailKey: "practicalSupermarketDetail",
    Icon: function IconCart({ className }) {
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    },
  },
  {
    titleKey: "practicalBikeRental",
    detailKey: "practicalBikeRentalDetail",
    Icon: function IconBike({ className }) {
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a3 3 0 11-6 0 3 3 0 016 0zM19 17a3 3 0 11-6 0 3 3 0 016 0zM6 14V8l4 2 4-2v6" />
        </svg>
      );
    },
  },
];

const ACTIVITIES: Array<{
  titleKey: "activityHiking" | "activityBoating" | "activityDiving" | "activityCycling" | "activityWine" | "activityBeach";
  descKey: "activityHikingDesc" | "activityBoatingDesc" | "activityDivingDesc" | "activityCyclingDesc" | "activityWineDesc" | "activityBeachDesc";
}> = [
  { titleKey: "activityHiking", descKey: "activityHikingDesc" },
  { titleKey: "activityBoating", descKey: "activityBoatingDesc" },
  { titleKey: "activityDiving", descKey: "activityDivingDesc" },
  { titleKey: "activityCycling", descKey: "activityCyclingDesc" },
  { titleKey: "activityWine", descKey: "activityWineDesc" },
  { titleKey: "activityBeach", descKey: "activityBeachDesc" },
];

export default function ServicesContent() {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);

  return (
    <main className="relative z-20 pt-12 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-black mb-3">
            {t("servicesTitle")}
          </h1>
          <p className="text-gray-500 font-light max-w-xl mx-auto">
            {t("servicesIntro")}
          </p>
        </header>

        {/* Alternating image + description blocks */}
        <div className="space-y-20 md:space-y-28">
          {SERVICES.map((service, index) => {
            const imageLeft = index % 2 === 0;
            return (
              <section
                key={service.titleKey}
                className="grid grid-cols-1 gap-10 md:gap-14 md:grid-cols-2 items-center"
              >
                <div
                  className={`relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg ${
                    !imageLeft ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
                <div className={!imageLeft ? "md:order-1" : ""}>
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-brand-black mb-4">
                    {t(service.titleKey)}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {t(service.descKey)}
                  </p>
                </div>
              </section>
            );
          })}
        </div>

        {/* Practical information – cards */}
        <section className="mt-24 md:mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-brand-black mb-2">
              {t("servicesPracticalTitle")}
            </h2>
            <p className="text-gray-500 font-light max-w-lg mx-auto">
              {t("servicesPracticalIntro")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRACTICAL_ITEMS.map((item) => (
              <article
                key={item.titleKey}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                    <item.Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-brand-black mb-2">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t(item.detailKey)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Activities – cards */}
        <section className="mt-24 md:mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-brand-black mb-2">
              {t("servicesActivitiesTitle")}
            </h2>
            <p className="text-gray-500 font-light max-w-lg mx-auto">
              {t("servicesActivitiesIntro")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTIVITIES.map((activity) => (
              <article
                key={activity.titleKey}
                className="group border border-gray-200 rounded-2xl p-6 bg-linear-to-b from-gray-50/80 to-white hover:border-brand-gold/30 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-serif font-semibold text-brand-black mb-3 group-hover:text-brand-gold transition-colors">
                  {t(activity.titleKey)}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(activity.descKey)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
