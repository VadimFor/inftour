"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../../experiencias/components/modalStyles";
import lobbyAboutImage from "../pictures/Inftour.png";

const ABOUT_DOC_PARAGRAPHS = [
  "lobAboutDocP1",
  "lobAboutDocP2",
  "lobAboutDocP3",
  "lobAboutDocP4",
  "lobAboutDocP5",
  "lobAboutDocP6",
] as const;

const ABOUT_DOC_AREAS = [
  "lobAboutDocArea1",
  "lobAboutDocArea2",
  "lobAboutDocArea3",
  "lobAboutDocArea4",
] as const;

const AREA_ICONS = [
  <svg
    key="home"
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>,
  <svg
    key="building"
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
    />
  </svg>,
  <svg
    key="exchange"
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
    />
  </svg>,
  <svg
    key="wrench"
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.585l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
    />
  </svg>,
];

function renderBoldFragments(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-brand-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type AboutUsContentProps = {
  isModal?: boolean;
};

export default function AboutUsContent({
  isModal = false,
}: AboutUsContentProps) {
  const t = useLangStore((s) => s.t);

  return (
    <div className={isModal ? "w-full min-h-0" : "container mx-auto px-4 py-12"}>
      <div
        className={
          isModal
            ? "bg-linear-to-br from-white via-brand-bg to-amber-50/30 px-3 py-4 sm:px-4 md:py-6"
            : "rounded-2xl border border-gray-200 bg-linear-to-br from-white via-brand-bg to-amber-50/30 p-8 md:p-12 lg:p-14 shadow-sm"
        }
      >
        <span className="text-brand-gold font-bold uppercase tracking-[0.22em] text-[11px] mb-3 block">
          {t("lobAboutTitle")}
        </span>
        <h1
          id="lobby-about-us-title"
          className={isModal ? "text-3xl md:text-4xl font-serif text-brand-black mb-8 leading-tight" : "text-3xl md:text-4xl font-serif text-brand-black mb-8 leading-tight"}
        >
          {isModal ? t("lobAboutDocMainTitle") : t("lobAboutDocMainTitle")}
        </h1>
        <div className="overflow-hidden text-[15px] md:text-base text-gray-600 font-light leading-relaxed">
          <figure className="mb-6 rounded-xl overflow-hidden border border-gray-100/90 shadow-md bg-white">
            <Image
              src={lobbyAboutImage}
              alt={t("lobAboutDocMainTitle")}
              className="w-full h-auto object-contain object-center"
              sizes="100vw"
              priority
              unoptimized
            />
          </figure>
          {ABOUT_DOC_PARAGRAPHS.map((key) => (
            <p key={key} className="mb-5 last:mb-0">
              {renderBoldFragments(t(key))}
            </p>
          ))}
        </div>
      </div>

      <div
        className={
          isModal
            ? "relative overflow-hidden border-t border-brand-gold/20 bg-linear-to-br from-brand-bg/90 via-white to-amber-50/20 px-3 py-6 sm:px-4 md:py-8"
            : "mt-6 rounded-2xl border border-brand-gold/20 bg-linear-to-br from-brand-bg/90 via-white to-amber-50/20 p-8 md:p-10 relative overflow-hidden"
        }
      >
        <div
          className="absolute -right-16 -top-16 size-48 rounded-full bg-brand-gold/5 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -left-8 bottom-0 size-32 rounded-full bg-amber-100/40 pointer-events-none"
          aria-hidden
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-brand-gold/20">
            <span className="h-7 w-1 rounded-full bg-brand-gold shrink-0" aria-hidden />
            <h2 className="text-xl md:text-2xl font-serif text-brand-black">
              {t("lobAboutDocSummaryTitle")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="flex gap-4 items-center bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                </svg>
              </span>
              <p className="text-[15px] text-gray-700 leading-snug">
                {renderBoldFragments(t("lobAboutDocSummaryFounded"))}
              </p>
            </div>
            <div className="flex gap-4 items-center bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              <p className="text-[15px] text-gray-700 leading-snug">
                {renderBoldFragments(t("lobAboutDocSummaryLocation"))}
              </p>
            </div>
          </div>
          <div className="mb-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4">
              <span className="h-5 w-1 shrink-0 rounded-full bg-brand-gold" aria-hidden />
              <h3 className="font-serif text-lg text-brand-black">{t("lobAboutDocAreasTitle")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-100">
              {ABOUT_DOC_AREAS.map((key, i) => (
                <div key={key} className="flex items-center gap-3 bg-white px-5 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                    {AREA_ICONS[i]}
                  </span>
                  <span className="text-sm font-medium text-gray-700 leading-snug">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[15px] md:text-base text-gray-600 font-light leading-relaxed border-t border-gray-100 pt-6">
            {renderBoldFragments(t("lobAboutDocClosing"))}
          </p>
        </div>
      </div>
    </div>
  );
}
