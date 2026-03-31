"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import ecosistemaCalpe1 from "./pictures/Ecosistema deportivo de Calpe 1.png";
import ecosistemaCalpe2 from "./pictures/Ecosistema deportivo de Calpe 2.jpg";
import ecosistemaCalpe3 from "./pictures/Ecosistema deportivo de Calpe 3.png";
import ecosistemaCalpe4 from "./pictures/Ecosistema deportivo de Calpe 4.png";
import ecosistemaCalpe5 from "./pictures/Ecosistema deportivo de Calpe 5.jpg";
import ecosistemaCalpe6 from "./pictures/Ecosistema deportivo de Calpe 6.png";

type EcosistemaDeportivoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LINK_TEXT_TO_URL: Record<string, string> = {
  "La Sella Golf": "https://lasellagolf.com/",
  "La Sella Golf (Dénia)": "https://lasellagolf.com/",
  "La Sella Golf (Дения)": "https://lasellagolf.com/",
  "La Sella Golf (Денія)": "https://lasellagolf.com/",
  "Club de Golf Jávea": "https://www.clubdegolfjavea.com/",
  // In the .docx the hyperlink target is a search URL; we keep it as-is.
  "Villaitana Golf":
    "https://www.google.com/search?q=https://www.villaitanagolf.com/",
  "Villaitana Golf (Benidorm)":
    "https://www.google.com/search?q=https://www.villaitanagolf.com/",
  "Villaitana Golf (Бенидорм)":
    "https://www.google.com/search?q=https://www.villaitanagolf.com/",
  "Villaitana Golf (Бенідорм)":
    "https://www.google.com/search?q=https://www.villaitanagolf.com/",
  "Club de Tenis Calpe": "https://www.clubdeteniscalpe.net/",
  "Real Club Náutico de Calpe": "https://www.rcnc.es/",
  "Pabellón Municipal Miguel Ángel Benítez":
    "https://www.google.com/search?q=https://www.calpe.es/es/deportes",
  "Costa Blanca Bike Race":
    "https://www.google.com/search?q=https://costablancabikerace.net/",
  "Vuelta a la Comunitat Valenciana": "https://vueltacv.com/",
  "www.inftour.com": "https://www.inftour.com/",

  // Localized hyperlink texts (from the .docx).
  "Miguel Ángel Benítez Municipal Pavilion":
    "https://www.google.com/search?q=https://www.calpe.es/es/deportes",
  "Pavillon Municipal Miguel Ángel Benítez":
    "https://www.google.com/search?q=https://www.calpe.es/es/deportes",
  "Padiglione Municipale Miguel Ángel Benítez":
    "https://www.google.com/search?q=https://www.calpe.es/es/deportes",
  "Städtische Pavillon Miguel Ángel Benítez":
    "https://www.google.com/search?q=https://www.calpe.es/es/deportes",
  "Pawilon Miejski Miguel Ángel Benítez":
    "https://www.google.com/search?q=https://www.calpe.es/es/deportes",
  "Муниципальный павильон Мигель Анхель Бенитес":
    "https://www.google.com/search?q=https://www.calpe.es/es/deportes",
  "Муніципальний павільйон Мігель Анхель Бенітес":
    "https://www.google.com/search?q=https://www.calpe.es/es/deportes",
};

const LINK_ENTRIES = Object.entries(LINK_TEXT_TO_URL).sort(
  (a, b) => b[0].length - a[0].length,
);

function renderLinkedText(text: string): ReactNode {
  if (!text) return text;

  let nodes: ReactNode[] = [text];

  for (const [linkText, url] of LINK_ENTRIES) {
    nodes = nodes.flatMap((node, idx) => {
      if (typeof node !== "string") return [node];

      const out: ReactNode[] = [];
      let remaining = node;

      while (true) {
        const at = remaining.indexOf(linkText);
        if (at === -1) {
          if (remaining) out.push(remaining);
          break;
        }

        const before = remaining.slice(0, at);
        if (before) out.push(before);

        const match = remaining.slice(at, at + linkText.length);
        out.push(
          <a
            key={`ln-${idx}-${at}-${linkText}`}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {match}
          </a>,
        );

        remaining = remaining.slice(at + linkText.length);
      }

      return out;
    });
  }

  return <>{nodes}</>;
}

function renderLabeledLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return <>{renderLinkedText(line)}</>;
  const rawLabel = line.slice(0, colonIdx);
  const rest = line.slice(colonIdx + 1).trim();

  const bulletPrefix = rawLabel.startsWith("• ") ? "• " : "";
  const label = bulletPrefix ? rawLabel.slice(bulletPrefix.length) : rawLabel;
  const isShortLabel = label.trim().split(/\s+/).length <= 4;

  if (!isShortLabel || !rest) return <>{renderLinkedText(line)}</>;
  return (
    <>
      {bulletPrefix ? <span>{bulletPrefix}</span> : null}
      <strong>{renderLinkedText(label)}:</strong> {renderLinkedText(rest)}
    </>
  );
}

type SectionGroup = {
  main: string;
  bullets: string[];
};

function groupLines(lines: string[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("• ")) {
      if (groups.length > 0) {
        groups[groups.length - 1].bullets.push(line.slice(2));
      }
    } else {
      // Merge "Name:" only line with next non-bullet line
      const colonIdx = line.indexOf(":");
      const isLabelOnly =
        colonIdx !== -1 &&
        colonIdx === line.length - 1 &&
        line.slice(0, colonIdx).trim().split(/\s+/).length <= 5;
      // Merge numbered section header (e.g. "1. Golf...") with its description line
      const isNumberedHeader = /^\d+\./.test(line);
      // Merge when the *next* line is a long intro ending with ":" (e.g. "Infrastructure of triumph..." + "A unique environment...:")
      const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
      const nextIsLongIntro =
        nextLine.endsWith(":") &&
        !nextLine.startsWith("• ") &&
        !/^\d+\./.test(nextLine);
      const shouldMerge = isLabelOnly || isNumberedHeader || nextIsLongIntro;
      if (
        shouldMerge &&
        i + 1 < lines.length &&
        !lines[i + 1].startsWith("• ")
      ) {
        groups.push({ main: line + "\n" + lines[i + 1], bullets: [] });
        i++;
      } else {
        groups.push({ main: line, bullets: [] });
      }
    }
  }
  return groups;
}

const CALENDAR_KEYWORDS =
  /calendar|calendario|calendrier|kalender|kalendarz|календар|Календарь/i;

const VOICES_KEYWORDS =
  /voices|voces|голос[аи]|voix|voci|stimmen|głosy|голоси/i;

function parseVoiceBullets(
  bullets: string[],
): { quote: string; attribution: string }[] {
  const pairs: { quote: string; attribution: string }[] = [];
  for (let i = 0; i < bullets.length; i++) {
    const b = bullets[i];
    const isQuote =
      b.startsWith('"') ||
      b.startsWith("\u201C") ||
      b.startsWith("\u00AB") ||
      b.startsWith("\u201E");
    if (isQuote) {
      const next = bullets[i + 1] ?? "";
      const isAttrib =
        next.startsWith("—") || next.startsWith("–") || next.startsWith("-");
      pairs.push({ quote: b, attribution: isAttrib ? next : "" });
      if (isAttrib) i++;
    }
  }
  return pairs;
}

function parseCalendarBullet(
  bullet: string,
): { period: string; event: string } | null {
  const dashIdx = bullet.indexOf(" - ");
  if (dashIdx !== -1) {
    return {
      period: bullet.slice(0, dashIdx).trim(),
      event: bullet.slice(dashIdx + 3).trim(),
    };
  }
  const colonIdx = bullet.indexOf(":");
  if (colonIdx !== -1) {
    return {
      period: bullet.slice(0, colonIdx).trim(),
      event: bullet.slice(colonIdx + 1).trim(),
    };
  }
  return null;
}

/** First line `1.` … `4.` for numbered body sections (Golf, Tennis, …). */
function getNumberedSectionNumber(group: SectionGroup): number | null {
  const firstLine = group.main.split("\n")[0]?.trim() ?? "";
  const m = firstLine.match(/^(\d+)\./);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= 4 ? n : null;
}

export default function EcosistemaDeportivoModal({
  isOpen,
  onClose,
}: EcosistemaDeportivoModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  const title = t("expEcosistemaDeportivoModalTitle");
  const subtitle = t("expEcosistemaDeportivoModalSubtitle");
  const intro = t("expEcosistemaDeportivoModalIntro");

  const bodyRaw = t("expEcosistemaDeportivoModalBody");
  const bodyLines = bodyRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const tip = bodyLines.length > 0 ? bodyLines[bodyLines.length - 1] : "";
  const rawContentLines = tip ? bodyLines.slice(0, -1) : bodyLines;
  const rawGroups = groupLines(rawContentLines);

  // Merge consecutive plain (no-bullet, non-numbered) groups into one block
  const groups: SectionGroup[] = [];
  for (const group of rawGroups) {
    const last = groups[groups.length - 1];
    const isPlain = group.bullets.length === 0 && !/^\d+\./.test(group.main);
    const lastIsPlain =
      last && last.bullets.length === 0 && !/^\d+\./.test(last.main);
    if (last && isPlain && lastIsPlain) {
      last.main += "\n" + group.main;
    } else {
      groups.push({ main: group.main, bullets: group.bullets });
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ecosistema-deportivo-modal-title"
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
            <h3
              id="ecosistema-deportivo-modal-title"
              className={MODAL_TITLE_CLASS}
            >
              {title}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {subtitle}
            </p>
          </div>

          {intro ? (
            <p className="text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold pl-4 whitespace-pre-line">
              {intro}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4">
            {groups.map((group, idx) => {
              const isCalendar = CALENDAR_KEYWORDS.test(group.main);

              const isVoices = VOICES_KEYWORDS.test(group.main);

              if (isVoices && group.bullets.length > 0) {
                const pairs = parseVoiceBullets(group.bullets);
                return (
                  <div
                    key={`${idx}-${group.main.slice(0, 20)}`}
                    className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-5 hover:border-brand-gold/40 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                      {renderLinkedText(group.main)}
                    </p>
                    <div className="flex flex-col gap-4">
                      {pairs.map((pair, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex flex-col gap-1.5 pl-4 border-l-2 border-brand-gold/50"
                        >
                          <p className="text-sm italic text-gray-700 leading-relaxed">
                            {renderLinkedText(pair.quote)}
                          </p>
                          {pair.attribution && (
                            <p className="text-xs font-semibold text-brand-gold tracking-wide">
                              {pair.attribution}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (isCalendar && group.bullets.length > 0) {
                return (
                  <div
                    key={`${idx}-${group.main.slice(0, 20)}`}
                    className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-4 hover:border-brand-gold/40 transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                      {renderLinkedText(group.main)}
                    </p>
                    <div className="flex flex-col gap-2">
                      {group.bullets.map((bullet, bIdx) => {
                        const parsed = parseCalendarBullet(bullet);
                        return parsed ? (
                          <div key={bIdx} className="flex items-start gap-3">
                            <span className="shrink-0 min-w-[90px] text-center bg-brand-gold/10 text-brand-gold text-[11px] font-bold uppercase tracking-wide rounded-sm px-2 py-1 leading-tight">
                              {parsed.period}
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {renderLabeledLine(parsed.event)}
                            </p>
                          </div>
                        ) : (
                          <p
                            key={bIdx}
                            className="text-sm text-gray-700 leading-relaxed"
                          >
                            {renderLabeledLine(bullet)}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const newlineIdx = group.main.indexOf("\n");
              const [mainHeader, mainBody] =
                newlineIdx !== -1
                  ? [
                      group.main.slice(0, newlineIdx),
                      group.main.slice(newlineIdx + 1),
                    ]
                  : [null, group.main];

              const sectionNum = getNumberedSectionNumber(group);

              const imagesAfterTitle =
                sectionNum === 1 ? (
                  <div className="w-full overflow-hidden rounded-sm border border-gray-200 bg-gray-100 mb-4">
                    <Image
                      src={ecosistemaCalpe1}
                      alt={`${title} — Golf`}
                      width={ecosistemaCalpe1.width}
                      height={ecosistemaCalpe1.height}
                      className="w-full h-auto"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
                ) : sectionNum === 2 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mb-4 border border-gray-200 bg-gray-100 p-2 rounded-sm overflow-hidden">
                    <div className="overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                      <Image
                        src={ecosistemaCalpe2}
                        alt={`${title} — Tennis & padel (1)`}
                        width={ecosistemaCalpe2.width}
                        height={ecosistemaCalpe2.height}
                        className="w-full h-auto"
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                    </div>
                    <div className="overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                      <Image
                        src={ecosistemaCalpe3}
                        alt={`${title} — Tennis & padel (2)`}
                        width={ecosistemaCalpe3.width}
                        height={ecosistemaCalpe3.height}
                        className="w-full h-auto"
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                    </div>
                  </div>
                ) : sectionNum === 3 ? (
                  <div className="flex flex-row gap-2 w-full mb-4 border border-gray-200 bg-gray-100 p-2 rounded-sm overflow-hidden">
                    <div className="flex-1 h-36 overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                      <Image
                        src={ecosistemaCalpe4}
                        alt={`${title} — Nautical & water (1)`}
                        width={ecosistemaCalpe4.width}
                        height={ecosistemaCalpe4.height}
                        className="w-full h-full object-cover"
                        sizes="33vw"
                      />
                    </div>
                    <div className="flex-1 h-36 overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                      <Image
                        src={ecosistemaCalpe5}
                        alt={`${title} — Nautical & water (2)`}
                        width={ecosistemaCalpe5.width}
                        height={ecosistemaCalpe5.height}
                        className="w-full h-full object-cover"
                        sizes="33vw"
                      />
                    </div>
                    <div className="flex-1 h-36 overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                      <Image
                        src={ecosistemaCalpe6}
                        alt={`${title} — Nautical & water (3)`}
                        width={ecosistemaCalpe6.width}
                        height={ecosistemaCalpe6.height}
                        className="w-full h-full object-cover"
                        sizes="33vw"
                      />
                    </div>
                  </div>
                ) : null;

              return (
                <div
                  key={`${idx}-${group.main.slice(0, 20)}`}
                  className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors overflow-hidden"
                >
                  {mainHeader ? (
                    <>
                      {mainHeader.includes(":") ? (
                        (() => {
                          const colonIdx = mainHeader.indexOf(":");
                          const labelPart = mainHeader.slice(0, colonIdx);
                          const restPart = mainHeader
                            .slice(colonIdx + 1)
                            .trim();
                          return (
                            <p className="text-sm text-gray-800">
                              <strong>{renderLinkedText(labelPart)}:</strong>{" "}
                              {renderLinkedText(restPart)}
                            </p>
                          );
                        })()
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">
                          {renderLinkedText(mainHeader)}
                        </p>
                      )}
                      {imagesAfterTitle}
                      {mainBody.split("\n").map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-sm text-gray-700 leading-relaxed"
                        >
                          {renderLabeledLine(para)}
                        </p>
                      ))}
                    </>
                  ) : /^\d+\./.test(group.main) ? (
                    <>
                      <p className="text-sm text-gray-800">
                        {(() => {
                          const ci = group.main.indexOf(":");
                          if (ci === -1)
                            return (
                              <strong>{renderLinkedText(group.main)}</strong>
                            );
                          return (
                            <>
                              <strong>
                                {renderLinkedText(group.main.slice(0, ci))}:
                              </strong>{" "}
                              {renderLinkedText(
                                group.main.slice(ci + 1).trim(),
                              )}
                            </>
                          );
                        })()}
                      </p>
                      {imagesAfterTitle}
                    </>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {renderLabeledLine(group.main)}
                    </p>
                  )}
                  {group.bullets.length > 0 && (
                    <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                      {group.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                        >
                          {renderLabeledLine(bullet)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
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
