"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import ascenso1 from "./pictures/Ascenso al Peñón 1.jpeg";
import ascenso2 from "./pictures/Ascenso al Peñón 2.jpeg";
import ascenso3 from "./pictures/Ascenso al Peñón 3.jpeg";

type IfachModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function renderLabeledLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return <>{line}</>;

  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return <>{line}</>;

  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  if (labelWords > 6) return <>{line}</>;

  return (
    <>
      <span className="font-semibold">{rawLabel}</span>: {rest}
    </>
  );
}

function isHeaderLike(line: string) {
  const t = line.trim();
  if (!t) return false;
  if (/^inftour\s*:/i.test(t)) return true;
  if (t.endsWith(".") || t.endsWith("!") || t.endsWith("?")) return false;
  // Short-ish lines are usually headings in the DOCX structure
  return t.length <= 72;
}

export default function IfachModal({ isOpen, onClose }: IfachModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  const title = t("expIfachModalTitle");
  const subtitle = t("expIfachModalSubtitle");
  const bodyIntro = t("expIfachModalBodyIntro");
  const bodyTitan = t("expIfachModalBodyTitan");
  const bodyHeroRoute = t("expIfachModalBodyHeroRoute");
  const bodyRisk = t("expIfachModalBodyRisk");
  const inftourParagraph = t("expIfachModalInftourParagraph");
  const tip = t("expIfachModalInftourAdvice");
  const postscript = t("expIfachModalBodyPostscript");

  const parts = [
    bodyIntro,
    bodyTitan,
    bodyHeroRoute,
    bodyRisk,
    inftourParagraph,
    postscript,
  ]
    .filter(Boolean)
    .map((part) =>
      (part || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0);

  const sections = parts.map((lines) => {
    const first = lines[0] ?? "";
    const title = isHeaderLike(first) ? first : null;
    const rest = title ? lines.slice(1) : lines;

    const isSubBullet = (l: string) => l.startsWith("--");

    const isBulletLine = (l: string) => {
      const text = isSubBullet(l) ? l.slice(2) : l;
      const colonIdx = text.indexOf(":");
      if (colonIdx === -1) return false;
      const rawLabel = text.slice(0, colonIdx).trim();
      const after = text.slice(colonIdx + 1).trim();
      if (!after) return false;
      const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
      return labelWords <= 3;
    };

    const allBullets = rest.filter(isBulletLine);
    const mainLines = rest.filter((l) => !allBullets.includes(l));

    // Group sub-bullets under their preceding parent bullet
    type BulletItem = { text: string; subItems: string[] };
    const bulletLines: BulletItem[] = [];
    for (const l of allBullets) {
      if (isSubBullet(l)) {
        if (bulletLines.length > 0) {
          bulletLines[bulletLines.length - 1].subItems.push(l.slice(2));
        }
      } else {
        bulletLines.push({ text: l, subItems: [] });
      }
    }

    return { title, mainLines, bulletLines };
  });

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ifach-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
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
            <h3 id="ifach-modal-title" className={MODAL_TITLE_CLASS}>
              {title}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sections.map((section, sIdx) => (
              <div
                key={`s-${sIdx}-${(section.title ?? section.mainLines[0] ?? "").slice(0, 20)}`}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
              >
                {section.title ? (
                  <p className="text-sm font-semibold text-gray-800">
                    {section.title}
                  </p>
                ) : null}

                {section.mainLines.map((line, idx) => (
                  <p
                    key={`m-${idx}-${line.slice(0, 18)}`}
                    className="text-sm text-gray-900 leading-relaxed"
                  >
                    {renderLabeledLine(line)}
                  </p>
                ))}

                {section.bulletLines.length ? (
                  <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                    {section.bulletLines.map((b) => (
                      <li
                        key={b.text}
                        className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                      >
                        {renderLabeledLine(b.text)}
                        {b.subItems.length > 0 && (
                          <ul className="flex flex-col gap-1 mt-1 pl-4 border-l border-brand-gold/20">
                            {b.subItems.map((sub) => (
                              <li
                                key={sub}
                                className="text-sm text-gray-600 leading-relaxed list-disc list-inside"
                              >
                                {renderLabeledLine(sub)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {sIdx === 0 ? (
                  <div className="w-full border border-gray-200 bg-gray-100 p-2 rounded-sm overflow-hidden">
                    <div className="h-72 overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                      <Image
                        src={ascenso1}
                        alt={`${title} — Ascenso al Peñón 1`}
                        width={ascenso1.width}
                        height={ascenso1.height}
                        className="w-full h-full object-cover"
                        sizes="100vw"
                      />
                    </div>
                  </div>
                ) : null}

                {sIdx === 2 ? (
                  <div className="flex flex-row gap-2 w-full border border-gray-200 bg-gray-100 p-2 rounded-sm overflow-hidden">
                    {[ascenso2, ascenso3].map((src, i) => (
                      <div key={i} className="flex-1 h-36 overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                        <Image
                          src={src}
                          alt={`${title} — Ascenso al Peñón ${i + 2}`}
                          width={src.width}
                          height={src.height}
                          className="w-full h-full object-cover"
                          sizes="50vw"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
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
            {t("close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
