"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../../lib/langStore";
import { recipesModalSectionsByLang } from "./recipes_modal_sections";
import { MODAL_TITLE_CLASS } from "../modalStyles";

type RecipesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/** Bold text before the first colon (e.g. "Source: …", "The ritual: …"). */
function renderLabeledLine(line: string) {
  const [label, ...rest] = line.split(":");
  const hasLabel = rest.length > 0;
  if (!hasLabel) return line;
  return (
    <>
      <strong>{label}:</strong> {rest.join(":").trim()}
    </>
  );
}

export default function RecipesModal({ isOpen, onClose }: RecipesModalProps) {
  const t = useLangStore((s) => s.t);
  const lang = useLangStore((s) => s.lang);
  const sections = recipesModalSectionsByLang[lang];

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipes-modal-title"
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
            <h3 id="recipes-modal-title" className={MODAL_TITLE_CLASS}>
              {t("expRecipesModalTitle")}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {t("expRecipesModalSubtitle")}
            </p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold pl-4">
            {t("expRecipesModalIntro")}
          </p>

          <div className="grid grid-cols-1 gap-5">
            {sections.map((section, sectionIndex) => (
              <article
                key={`recipe-section-${sectionIndex}`}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 sm:p-6 flex flex-col gap-4 hover:border-brand-gold/40 transition-colors"
              >
                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                    {section.title}
                  </h4>
                  {section.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {section.description}
                    </p>
                  )}
                </div>

                {section.source.length > 0 && (
                  <div className="bg-white/80 border border-gray-200 rounded-sm px-4 py-3">
                    <ul className="space-y-1 text-sm text-gray-500">
                      {section.source.map((line, lineIndex) => (
                        <li
                          key={`${sectionIndex}-source-${lineIndex}`}
                          className="flex items-start gap-2"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            className="w-4 h-4 shrink-0 mt-0.5 text-gray-400"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                            />
                          </svg>
                          <span className="leading-relaxed">
                            {renderLabeledLine(line)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.ingredients.length > 0 && (
                  <div className="bg-white/80 border border-brand-gold/20 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-4 h-4 text-brand-gold"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                        />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                        {t("expRecipesModalIngredientsLabel")}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      {section.ingredients.map((line, lineIndex) => (
                        <li
                          key={`${sectionIndex}-ing-${lineIndex}`}
                          className="flex items-start gap-2"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5"
                            aria-hidden
                          />
                          <span className="leading-relaxed">
                            {renderLabeledLine(line)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.notes.length > 0 && (
                  <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                    {section.notes.map((line, lineIndex) => (
                      <p key={`${sectionIndex}-note-${lineIndex}`}>{line}</p>
                    ))}
                  </div>
                )}

                {section.steps.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-4 h-4 text-brand-gold"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z"
                        />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                        {t("expRecipesModalStepsLabel")}
                      </span>
                    </div>
                    <ol className="relative ml-[18px] space-y-0">
                      {section.steps.map((body, i) => {
                        const isLast = i === section.steps.length - 1;
                        return (
                          <li
                            key={`${sectionIndex}-step-${i}`}
                            className={`relative pl-6 ${isLast ? "pb-0" : "pb-5 border-l-2 border-brand-gold/25"}`}
                          >
                            <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center text-white text-[11px] font-bold shadow-sm ring-2 ring-white">
                              {i + 1}
                            </div>
                            <div className="bg-white/70 border border-gray-100 rounded-sm px-4 py-3 text-sm text-gray-700 leading-relaxed hover:border-brand-gold/30 transition-colors">
                              {body}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </article>
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
              {t("expRecipesModalTip")}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
