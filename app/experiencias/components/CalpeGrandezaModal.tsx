"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "./modalStyles";

type CalpeGrandezaModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sectionsMeta = [
  { key: "expCalpeGrandeurModalSection1" },
  { key: "expCalpeGrandeurModalSection2" },
  { key: "expCalpeGrandeurModalSection3" },
  { key: "expCalpeGrandeurModalSection4" },
  { key: "expCalpeGrandeurModalSection5" },
  { key: "expCalpeGrandeurModalSection6" },
  { key: "expCalpeGrandeurModalSection7" },
  { key: "expCalpeGrandeurModalSection8" },
  { key: "expCalpeGrandeurModalSection9" },
  { key: "expCalpeGrandeurModalSection10" },
  { key: "expCalpeGrandeurModalSection11" },
  { key: "expCalpeGrandeurModalSection12" },
  { key: "expCalpeGrandeurModalSection13" },
] as const;

function parseSection(raw: string) {
  const lines = raw.split("\n");
  const nonEmpty = lines.map((l) => l.trimEnd());
  const firstIdx = nonEmpty.findIndex((l) => l.trim().length > 0);
  if (firstIdx === -1) return { title: "", body: "" };
  const title = nonEmpty[firstIdx].trim();
  const rest = nonEmpty.slice(firstIdx + 1).join("\n").trim();
  return { title, body: rest };
}

function parseSubtitleLines(raw: string) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function CalpeGrandezaModal({ isOpen, onClose }: CalpeGrandezaModalProps) {
  const t = useLangStore((s) => s.t);

  const introParagraphs = t("expCalpeGrandeurModalIntro")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const subtitleLines = parseSubtitleLines(t("expCalpeGrandeurModalSubtitle"));

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calpe-grandeza-modal-title"
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto flex-1 px-8 sm:px-10 py-6 scrollbar-modal">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 sm:-mx-10 px-8 sm:px-10 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h3
              id="calpe-grandeza-modal-title"
              className={MODAL_TITLE_CLASS}
            >
              {t("expCalpeGrandeurModalTitle")}
            </h3>
            <div className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2 space-y-1">
              {subtitleLines.map((line, i) => {
                const isUrl = /^https?:\/\//i.test(line);
                if (isUrl) {
                  return (
                    <p key={`calpe-sub-${i}`}>
                      <a
                        href={line}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="normal-case font-semibold tracking-normal text-brand-link underline underline-offset-2 decoration-brand-link/40 hover:decoration-brand-link hover:text-brand-link break-all"
                      >
                        {line}
                      </a>
                    </p>
                  );
                }
                return <p key={`calpe-sub-${i}`}>{line}</p>;
              })}
            </div>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold pl-4 space-y-4">
            {introParagraphs.map((para, i) => (
              <p key={`calpe-intro-${i}`}>{para}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sectionsMeta.map(({ key }) => {
              const { title, body } = parseSection(t(key));
              return (
                <div
                  key={key}
                  className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
                >
                  <h4 className="text-base font-semibold text-gray-900 leading-snug">{title}</h4>
                  {body ? (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{body}</p>
                  ) : null}
                </div>
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
            <p className="text-xs leading-relaxed text-gray-300 whitespace-pre-line">{t("expCalpeGrandeurModalTip")}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
