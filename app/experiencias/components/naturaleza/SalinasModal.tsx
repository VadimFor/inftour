"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import salinas1 from "./pictures/Las Salinas 1.jpg";
import salinas2 from "./pictures/Las Salinas 2.jpg";
import salinas3 from "./pictures/Las Salinas 3.png";
import salinas4 from "./pictures/Las Salinas 4.jpg";

type SalinasModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function isHeaderLike(line: string) {
  const t = line.trim();
  if (!t) return false;
  if (t.endsWith(".") || t.endsWith("!") || t.endsWith("?")) return false;
  return t.length <= 96;
}

function isSubgroupLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return false;
  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return false;
  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  return labelWords <= 5;
}

function renderLabeledLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return <>{line}</>;
  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return <>{line}</>;
  return (
    <>
      <span className="font-semibold">{rawLabel}</span>: {rest}
    </>
  );
}

export default function SalinasModal({ isOpen, onClose }: SalinasModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  const title = t("expSalinasModalTitle");
  const subtitle = t("expSalinasModalSubtitle");
  const paragraphs = [
    t("expSalinasModalParagraph1"),
    t("expSalinasModalParagraph2"),
    t("expSalinasModalParagraph3"),
    t("expSalinasModalParagraph4"),
    t("expSalinasModalParagraph5"),
    t("expSalinasModalParagraph6"),
    t("expSalinasModalParagraph7"),
    t("expSalinasModalParagraph8"),
    t("expSalinasModalParagraph9"),
    t("expSalinasModalParagraph10"),
    t("expSalinasModalParagraph11"),
    t("expSalinasModalParagraph12"),
    t("expSalinasModalParagraph13"),
    t("expSalinasModalParagraph14"),
    t("expSalinasModalParagraph15"),
  ].filter(Boolean);
  const tip = t("expSalinasModalInftourAdvice");

  type Section = { title: string | null; body: string[] };
  const sections: Section[] = [];
  for (const p of paragraphs) {
    if (isHeaderLike(p)) {
      sections.push({ title: p, body: [] });
      continue;
    }
    const current = sections[sections.length - 1];
    if (current) current.body.push(p);
    else sections.push({ title: null, body: [p] });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="salinas-modal-title"
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

        <div className="overflow-y-auto flex-1 px-8 py-6 scrollbar-modal">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h3 id="salinas-modal-title" className={MODAL_TITLE_CLASS}>
              {title}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-2 w-full border border-gray-200 bg-gray-100 p-2 rounded-sm overflow-hidden">
              {[salinas1, salinas2, salinas3, salinas4].map((src, i) => (
                <div key={i} className="h-36 overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                  <Image
                    src={src}
                    alt={`${title} — Las Salinas ${i + 1}`}
                    width={src.width}
                    height={src.height}
                    className="w-full h-full object-cover"
                    sizes="50vw"
                  />
                </div>
              ))}
            </div>
            {sections.map((section, idx) => (
              <div
                key={`s-${idx}-${(section.title ?? section.body[0] ?? "").slice(0, 24)}`}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
              >
                {section.title ? (
                  <p className="text-sm font-semibold text-gray-800">
                    {section.title}
                  </p>
                ) : null}
                {(() => {
                  const subgroupLines = section.body.filter(isSubgroupLine);
                  const mainLines = section.body.filter(
                    (line) => !isSubgroupLine(line),
                  );
                  const useSubgroups = subgroupLines.length >= 2;
                  return (
                    <>
                      {(useSubgroups ? mainLines : section.body).map((line) => (
                        <p
                          key={line}
                          className="text-sm text-gray-900 leading-relaxed"
                        >
                          {line}
                        </p>
                      ))}
                      {useSubgroups ? (
                        <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                          {subgroupLines.map((line) => (
                            <li
                              key={line}
                              className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                            >
                              {renderLabeledLine(line)}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  );
                })()}
              </div>
            ))}
          </div>

          {tip ? (
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
              <p className="text-xs leading-relaxed text-gray-300 whitespace-pre-line">
                {tip}
              </p>
            </div>
          ) : null}
        </div>
        <div className="border-t border-gray-200 px-6 py-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-brand-darkgray text-white rounded-sm px-5 py-2 font-semibold hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
