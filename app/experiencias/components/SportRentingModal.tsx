"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";

type SportRentingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sectionsMeta = [
  {
    key: "expSportsEventsModalSection1",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-4 h-4"
      >
        <circle cx="6.5" cy="17" r="3" />
        <circle cx="17.5" cy="17" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 17l4-8h3l4 8M9.8 10.5h4.4M14.2 10.5l-2.2-3h-2" />
      </svg>
    ),
  },
  {
    key: "expSportsEventsModalSection2",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-4 h-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5c-2.4 3-4.8 5.5-4.8 8.2a4.8 4.8 0 009.6 0c0-2.7-2.4-5.2-4.8-8.2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0s3-1.2 4.5 0s3 1.2 4.5 0" />
      </svg>
    ),
  },
  {
    key: "expSportsEventsModalSection3",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-4 h-4"
      >
        <ellipse cx="9" cy="9" rx="2.5" ry="4.5" transform="rotate(-30 9 9)" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12.8l5.8 5.8" />
        <circle cx="18.2" cy="7.5" r="1.8" />
      </svg>
    ),
  },
  {
    key: "expSportsEventsModalSection4",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-4 h-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5.5l2.2 2h3.6l2.2-2 2 1.8-1.5 2.2v8H7.5v-8L6 7.3l2-1.8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 7.5v10M14 7.5v10" />
      </svg>
    ),
  },
] as const;

export default function SportRentingModal({
  isOpen,
  onClose,
}: SportRentingModalProps) {
  const t = useLangStore((s) => s.t);
  const sectionContentByKey: Record<
    string,
    {
      subtitle: string;
      intro: string;
      items: Array<{ title: string; description: string; address: string }>;
    }
  > = {
    expSportsEventsModalSection1: {
      subtitle: t("expSportsEventsCyclingSubtitle"),
      intro: t("expSportsEventsCyclingIntro"),
      items: [
        {
          title: t("expSportsEventsCyclingItem1Title"),
          description: t("expSportsEventsCyclingItem1Desc"),
          address: t("expSportsEventsCyclingItem1Address"),
        },
        {
          title: t("expSportsEventsCyclingItem2Title"),
          description: t("expSportsEventsCyclingItem2Desc"),
          address: t("expSportsEventsCyclingItem2Address"),
        },
        {
          title: t("expSportsEventsCyclingItem3Title"),
          description: t("expSportsEventsCyclingItem3Desc"),
          address: t("expSportsEventsCyclingItem3Address"),
        },
      ],
    },
    expSportsEventsModalSection2: {
      subtitle: t("expSportsEventsWaterSubtitle"),
      intro: t("expSportsEventsWaterIntro"),
      items: [
        {
          title: t("expSportsEventsWaterItem1Title"),
          description: t("expSportsEventsWaterItem1Desc"),
          address: t("expSportsEventsWaterItem1Address"),
        },
        {
          title: t("expSportsEventsWaterItem2Title"),
          description: t("expSportsEventsWaterItem2Desc"),
          address: t("expSportsEventsWaterItem2Address"),
        },
        {
          title: t("expSportsEventsWaterItem3Title"),
          description: t("expSportsEventsWaterItem3Desc"),
          address: t("expSportsEventsWaterItem3Address"),
        },
      ],
    },
    expSportsEventsModalSection3: {
      subtitle: t("expSportsEventsTennisSubtitle"),
      intro: t("expSportsEventsTennisIntro"),
      items: [
        {
          title: t("expSportsEventsTennisItem1Title"),
          description: t("expSportsEventsTennisItem1Desc"),
          address: t("expSportsEventsTennisItem1Address"),
        },
      ],
    },
    expSportsEventsModalSection4: {
      subtitle: t("expSportsEventsRetailSubtitle"),
      intro: t("expSportsEventsRetailIntro"),
      items: [
        {
          title: t("expSportsEventsRetailItem1Title"),
          description: t("expSportsEventsRetailItem1Desc"),
          address: t("expSportsEventsRetailItem1Address"),
        },
        {
          title: t("expSportsEventsRetailItem2Title"),
          description: t("expSportsEventsRetailItem2Desc"),
          address: t("expSportsEventsRetailItem2Address"),
        },
      ],
    },
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sports-events-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-brand-bg border-b border-gray-200 px-8 py-6">
          <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
          <h3
            id="sports-events-modal-title"
            className="text-3xl font-serif text-gray-900 leading-tight"
          >
            {t("expSportsEventsModalTitle")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-sm transition"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6">
          <p className="text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold pl-4">
            {t("expSportsEventsModalIntro")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {sectionsMeta.map(({ key, icon }) => (
              <div
                key={key}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
              >
                <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gold flex items-center gap-2">
                    <span className="shrink-0">{icon}</span>
                    <span>{sectionContentByKey[key]?.subtitle}</span>
                  </h5>
                  <p>{sectionContentByKey[key]?.intro}</p>
                  <ul className="list-disc pl-5 space-y-3">
                    {sectionContentByKey[key]?.items.map((item) => (
                      <li key={item.title}>
                        <span className="font-semibold">{item.title}:</span>{" "}
                        {item.description}
                        <div className="list-disc pl-5 mt-1">
                          <span className="italic">{t("expSportsEventsAddressLabel")}:</span>{" "}
                          {item.address}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 shrink-0 text-brand-gold mt-0.5"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
            <p className="text-xs leading-relaxed text-gray-300">
              {t("expSportsEventsModalTip")}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
