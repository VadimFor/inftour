"use client";

import { createPortal } from "react-dom";
import { useState } from "react";
import Image from "next/image";
import { useLangStore } from "../../../lib/langStore";
import { restaurantsDocSectionsByLang } from "./restaurantsDocSections";
import { MODAL_TITLE_CLASS } from "../modalStyles";

const RESTAURANT_IMAGES = [
  "/sabores/pictures/Restaurantes 1.jpeg",
  "/sabores/pictures/Restaurantes 2.jpg",
  "/sabores/pictures/Restaurantes 3.png",
];

type RestaurantsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function splitAdviceFromContent(html: string) {
  const advicePattern =
    /<li><strong>[^<]*INFTOUR[^<]*<\/strong><\/li><\/ul><p>([\s\S]*?)<\/p>\s*$/i;
  const match = html.match(advicePattern);
  if (!match) return { contentHtml: html, adviceHtml: null as string | null };

  return {
    contentHtml: html.replace(advicePattern, "</ul>"),
    adviceHtml: match[1],
  };
}

function splitIntoSectionCards(html: string) {
  return html
    .split(/(?=<p><strong>\d+\.)/g)
    .map((section) => section.trim())
    .filter(Boolean);
}

export default function RestaurantsModal({
  isOpen,
  onClose,
}: RestaurantsModalProps) {
  const t = useLangStore((s) => s.t);
  const lang = useLangStore((s) => s.lang);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const { contentHtml, adviceHtml } = splitAdviceFromContent(
    restaurantsDocSectionsByLang[lang],
  );
  const sectionCards = splitIntoSectionCards(contentHtml);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restaurants-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-sm transition"
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

        <div className="overflow-y-auto flex-1 px-8 py-6">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h3 id="restaurants-modal-title" className={MODAL_TITLE_CLASS}>
              {t("expRestaurantsModalTitle")}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {t("expRestaurantsModalSubtitle")}
            </p>
          </div>
          {/* Intro */}
          <p className="text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold pl-4">
            {t("expRestaurantsModalIntro")}
          </p>

          <div className="space-y-4">
            {sectionCards.map((sectionHtml, index) => {
              const splitIdx = sectionHtml.indexOf("</p>");
              const titleHtml =
                splitIdx !== -1 ? sectionHtml.slice(0, splitIdx + 4) : "";
              const restHtml =
                splitIdx !== -1 ? sectionHtml.slice(splitIdx + 4) : sectionHtml;
              return (
                <section
                  key={index}
                  className="group bg-brand-bg border border-gray-100 rounded-sm overflow-hidden hover:border-brand-gold/40 transition-colors"
                >
                  <div className="px-5 pt-7">
                    <div className="h-px w-8 bg-brand-gold mb-3" />
                    <div
                      className="text-base sm:text-lg font-semibold text-gray-900 leading-snug [&_p]:mb-0 [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: titleHtml }}
                    />
                  </div>
                  {RESTAURANT_IMAGES[index] && !failedImages.has(index) && (
                    <div className="relative w-full h-72 mt-4 overflow-hidden">
                      <Image
                        src={RESTAURANT_IMAGES[index]}
                        alt=""
                        fill
                        onError={() => setFailedImages((prev) => new Set(prev).add(index))}
                        className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500 ease-in-out"
                        sizes="(max-width: 896px) 100vw, 896px"
                      />
                    </div>
                  )}
                  <div
                    className="p-5 text-sm text-gray-700 leading-relaxed [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:font-semibold [&_a]:text-blue-700 [&_a]:underline hover:[&_a]:text-blue-900"
                    dangerouslySetInnerHTML={{ __html: restHtml }}
                  />
                </section>
              );
            })}
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
            <p
              className="text-xs leading-relaxed text-gray-300"
              dangerouslySetInnerHTML={{
                __html: adviceHtml ?? t("expRestaurantsModalTip"),
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
