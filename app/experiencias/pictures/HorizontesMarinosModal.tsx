"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "./modalStyles";

type HorizontesMarinosModalProps = {
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
  if (labelWords > 4) return <>{line}</>;

  return (
    <>
      <span className="font-semibold">{rawLabel}</span>: {rest}
    </>
  );
}

function isSectionHeader(line: string) {
  const t = line.trim();
  if (!t) return false;
  if (t.endsWith(".") || t.endsWith("!") || t.endsWith("?")) return false;
  return t.length <= 96;
}

function isInftourHeader(line: string) {
  return /^inftour\s*:/i.test(line.trim());
}

function isShortLabeledBullet(line: string) {
  if (isInftourHeader(line)) return false;
  // Keep both "Paseo Marítimo Infanta ..." entries as subpoints.
  if (/^paseo\s+mar[ií]timo\s+infanta/i.test(line.trim())) return true;
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return false;
  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return false;
  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  return labelWords <= 3;
}

function isGroupHeader(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return false;
  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (rest) return false;
  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  return labelWords <= 3;
}

export default function HorizontesMarinosModal({ isOpen, onClose }: HorizontesMarinosModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  const title = t("expHorizontesMarinosModalTitle");
  const subtitle = t("expHorizontesMarinosModalSubtitle");
  const intro = t("expHorizontesMarinosModalIntro");
  const body = t("expHorizontesMarinosModalBody");
  const ecoWalkBox = t("expHorizontesMarinosEcoWalkBox");
  const calpeWalkBox = t("expHorizontesMarinosCalpeWalkBox");
  const tip = t("expHorizontesMarinosModalInftourAdvice");
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const ecoLines = ecoWalkBox
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const calpeLines = calpeWalkBox
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  type Section = { title: string | null; mainLines: string[]; bullets: string[] };
  const sections: Section[] = [];

  for (const line of lines) {
    const lineIsHeader = isSectionHeader(line);
    const lineIsBullet = isShortLabeledBullet(line);

    if (lineIsHeader && !lineIsBullet) {
      sections.push({ title: line, mainLines: [], bullets: [] });
      continue;
    }

    if (lineIsBullet) {
      const current = sections[sections.length - 1];
      if (current) {
        current.bullets.push(line);
      } else {
        sections.push({ title: null, mainLines: [], bullets: [line] });
      }
      continue;
    }

    const current = sections[sections.length - 1];
    if (current) {
      current.mainLines.push(line);
    } else {
      sections.push({ title: null, mainLines: [line], bullets: [] });
    }
  }

  const ecoTitle = ecoLines[0] ?? "";
  const ecoIntro = ecoLines[1] ?? "";
  const ecoBullets = ecoLines.slice(2);
  const calpeTitle = calpeLines[0] ?? "";
  const calpeIntro = calpeLines[1] ?? "";
  const calpeBullets = calpeLines.slice(2);
  type EcoBulletGroup = { text: string; subItems: string[] };
  const ecoBulletGroups: EcoBulletGroup[] = [];
  for (const line of ecoBullets) {
    if (isGroupHeader(line)) {
      ecoBulletGroups.push({ text: line, subItems: [] });
      continue;
    }
    if (ecoBulletGroups.length > 0 && isShortLabeledBullet(line)) {
      ecoBulletGroups[ecoBulletGroups.length - 1].subItems.push(line);
      continue;
    }
    ecoBulletGroups.push({ text: line, subItems: [] });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="horizontes-marinos-modal-title"
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
            <h3 id="horizontes-marinos-modal-title" className={MODAL_TITLE_CLASS}>
              {title}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {intro ? (
              <div className="bg-brand-bg border border-gray-100 rounded-sm p-5">
                <p className="text-sm text-gray-900 leading-relaxed">{intro}</p>
              </div>
            ) : null}
            {ecoLines.length > 0 ? (
              <div className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors">
                {ecoTitle ? (
                  <p className="text-sm font-semibold text-gray-800">{ecoTitle}</p>
                ) : null}
                {ecoIntro ? (
                  <p className="text-sm text-gray-900 leading-relaxed">{ecoIntro}</p>
                ) : null}
                {ecoBulletGroups.length > 0 ? (
                  <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                    {ecoBulletGroups.map((item) => (
                      <li
                        key={item.text}
                        className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                      >
                        {renderLabeledLine(item.text)}
                        {item.subItems.length > 0 ? (
                          <ul className="flex flex-col gap-1 mt-1 pl-4 border-l border-brand-gold/20">
                            {item.subItems.map((sub) => (
                              <li
                                key={sub}
                                className="text-sm text-gray-600 leading-relaxed list-disc list-inside"
                              >
                                {renderLabeledLine(sub)}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
            {calpeLines.length > 0 ? (
              <div className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors">
                {calpeTitle ? (
                  <p className="text-sm font-semibold text-gray-800">{calpeTitle}</p>
                ) : null}
                {calpeIntro ? (
                  <p className="text-sm text-gray-900 leading-relaxed">{calpeIntro}</p>
                ) : null}
                {calpeBullets.length > 0 ? (
                  <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                    {calpeBullets.map((line) => (
                      <li
                        key={line}
                        className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                      >
                        {renderLabeledLine(line)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
            {sections.map((section, sIdx) => (
              <div
                key={`s-${sIdx}-${(section.title ?? section.mainLines[0] ?? "").slice(0, 20)}`}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
              >
                {section.title ? (
                  <p className="text-sm font-semibold text-gray-800">{section.title}</p>
                ) : null}

                {section.mainLines.map((line) => (
                  <p key={line} className="text-sm text-gray-900 leading-relaxed">
                    {line}
                  </p>
                ))}

                {section.bullets.length > 0 ? (
                  <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                    {section.bullets.map((line) => (
                      <li
                        key={line}
                        className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                      >
                        {renderLabeledLine(line)}
                      </li>
                    ))}
                  </ul>
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
      </div>
    </div>,
    document.body,
  );
}
