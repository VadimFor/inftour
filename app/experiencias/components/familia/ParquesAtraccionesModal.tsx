"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";

type ParquesAtraccionesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function renderLabeledLine(line: string) {
  const [label, ...rest] = line.split(":");
  const hasLabel = rest.length > 0;
  if (!hasLabel) return line;
  const isShortLabel = label.trim().split(/\s+/).length <= 4;
  if (!isShortLabel) return <>{line}</>;
  return (
    <>
      <strong>{label}:</strong> {rest.join(":").trim()}
    </>
  );
}

type ParkGroup = {
  main: string;
  bullets: string[];
};

function groupBodyLines(lines: string[]): ParkGroup[] {
  const groups: ParkGroup[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("• ")) {
      if (groups.length > 0) {
        groups[groups.length - 1].bullets.push(line.slice(2));
      }
    } else {
      // If line is just "Name:" with no description, merge with next non-bullet line
      const colonIdx = line.indexOf(":");
      const isLabelOnly =
        colonIdx !== -1 &&
        colonIdx === line.length - 1 &&
        line.slice(0, colonIdx).trim().split(/\s+/).length <= 4;
      if (
        isLabelOnly &&
        i + 1 < lines.length &&
        !lines[i + 1].startsWith("• ")
      ) {
        const merged = line + " " + lines[i + 1];
        groups.push({ main: merged, bullets: [] });
        i++;
      } else {
        groups.push({ main: line, bullets: [] });
      }
    }
  }
  return groups;
}

export default function ParquesAtraccionesModal({
  isOpen,
  onClose,
}: ParquesAtraccionesModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  const title = t("expParquesAtraccionesModalTitle");
  const subtitle = t("expParquesAtraccionesModalSubtitle");
  const intro = t("expParquesAtraccionesModalIntro");

  const bodyRaw = t("expParquesAtraccionesModalBody");
  const bodyLines = bodyRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const tip = bodyLines.length > 0 ? bodyLines[bodyLines.length - 1] : "";
  const rawContentLines = tip ? bodyLines.slice(0, -1) : bodyLines;
  const parkGroups = groupBodyLines(rawContentLines);

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parques-attractions-modal-title"
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
            <h3
              id="parques-attractions-modal-title"
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
            {parkGroups.map((group, idx) => (
              <div
                key={`${idx}-${group.main.slice(0, 20)}`}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
              >
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {renderLabeledLine(group.main)}
                </p>
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
