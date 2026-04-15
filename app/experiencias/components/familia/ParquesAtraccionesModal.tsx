"use client";

import type { StaticImageData } from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useMemo } from "react";
import { ProgressiveNextImage } from "../../../components/ProgressiveNextImage";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";
import terra1 from "./pictures/Terra 1.png";
import terra2 from "./pictures/Terra 2.png";
import terra3 from "./pictures/Terra 3.png";
import terra4 from "./pictures/Terra 4.png";
import terra5 from "./pictures/Terra 5.png";
import terra6 from "./pictures/Terra 6.png";

/** Imágenes por parque (orden de contenido: Aqualandia → Terra Natura → Terra Mítica → Safari Aitana) */
const TERRA_IMAGES_BY_PARK: Record<string, StaticImageData[]> = {
  "park-aqualandia": [terra2, terra3],
  "park-terra-natura": [terra4],
  "park-terra-mitica": [terra1],
  "park-safari-aitana": [terra5, terra6],
};

function TerraImagesForPark({ parkId, imgClassName }: { parkId: string; imgClassName?: string }) {
  const imgs = TERRA_IMAGES_BY_PARK[parkId];
  if (!imgs?.length) return null;
  const cols = imgs.length >= 2 ? "grid-cols-2" : "grid-cols-1";
  return (
    <div className={`grid ${cols} gap-2 mb-0`}>
      {imgs.map((img, i) => (
        <button
          key={`${parkId}-${i}`}
          type="button"
          onClick={() => scrollToParkSection(parkId)}
          className="overflow-hidden rounded-sm border border-gray-200 bg-gray-100 text-left cursor-pointer hover:border-brand-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 transition-colors"
          aria-label={parkId.replace(/^park-/, "").replace(/-/g, " ")}
        >
          <div
            className={`relative w-full overflow-hidden${
              imgClassName?.includes("max-h-24") ? " h-24" : ""
            }`}
            style={
              imgClassName?.includes("max-h-24")
                ? undefined
                : { aspectRatio: `${img.width} / ${img.height}` }
            }
          >
            <ProgressiveNextImage
              src={img}
              alt=""
              sizes="(max-width: 640px) 50vw, 33vw"
              loading="lazy"
              imageClassName="pointer-events-none object-cover"
            />
          </div>
        </button>
      ))}
    </div>
  );
}

function getParkAnchorIdFromText(text: string): string | null {
  const s = text.replace(/^•\s*/, "").trim().toLowerCase();
  if (s.includes("safari aitana")) return "park-safari-aitana";
  if (s.includes("terra mítica") || s.includes("terra mitica"))
    return "park-terra-mitica";
  if (s.includes("terra natura")) return "park-terra-natura";
  if (s.includes("aqualandia")) return "park-aqualandia";
  return null;
}

function assignScrollIds(groups: ParkGroup[]) {
  const used = new Set<string>();
  function take(text: string): string | undefined {
    const id = getParkAnchorIdFromText(text);
    if (!id || used.has(id)) return undefined;
    used.add(id);
    return id;
  }
  return groups.map((g) => ({
    group: g,
    mainId: take(g.main),
    bulletIds: g.bullets.map((b) => take(b)),
  }));
}

function scrollToParkSection(id: string) {
  if (!id) return;
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function shouldRenderImageBelowParagraph(parkId?: string) {
  return parkId === "park-terra-natura" || parkId === "park-terra-mitica";
}

type ParquesAtraccionesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ParquesAtraccionesContentProps = {
  isModal?: boolean;
  onClose?: () => void;
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
  useModalBodyScrollLock(isOpen);
  if (!isOpen || typeof document === "undefined") return null;

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

        <ParquesAtraccionesContent isModal onClose={onClose} />
        <div className="border-t border-gray-200 px-6 py-2 flex items-center justify-between gap-3">
          <a
            href="/experiencias/parques-atracciones"
            className="bg-white text-brand-darkgray border border-gray-300 rounded-sm px-5 py-2 font-semibold hover:bg-gray-50 transition"
          >
            {t("openPage")}
          </a>
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

export function ParquesAtraccionesContent({
  isModal = false,
  onClose,
}: ParquesAtraccionesContentProps) {
  const t = useLangStore((s) => s.t);
  const openAIWidget = useCallback(() => {
    const widget = document.querySelector("elevenlabs-convai") as HTMLElement & {
      open?: () => void;
      toggle?: () => void;
      shadowRoot?: ShadowRoot | null;
    };
    if (!widget) return;

    const clickAcceptIfPresent = () => {
      const root = widget.shadowRoot;
      if (!root) return false;
      const buttons = Array.from(root.querySelectorAll("button"));
      for (const btn of buttons) {
        const text = (btn.textContent || "").trim().toLowerCase();
        if (text === "accept" || text === "aceptar" || text.includes("accept")) {
          (btn as HTMLButtonElement).click();
          return true;
        }
      }
      return false;
    };

    if (typeof widget.open === "function") {
      widget.open();
    } else if (typeof widget.toggle === "function") {
      widget.toggle();
    } else {
      const root = widget.shadowRoot;
      if (!root) return;
      const avatar = root.querySelector(
        "div.absolute.inset-0.rounded-full.overflow-hidden.bg-base.bg-cover",
      ) as HTMLElement | null;
      if (avatar) {
        avatar.click();
      } else {
        const clickable = root.querySelector("button, [role='button']") as HTMLElement | null;
        clickable?.click();
      }
    }

    let attempts = 0;
    const maxAttempts = 20;
    const timer = window.setInterval(() => {
      attempts += 1;
      const accepted = clickAcceptIfPresent();
      if (accepted || attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, 150);
  }, []);
  const handleAdviceBoxClick = useCallback(() => {
    onClose?.();
    openAIWidget();
  }, [onClose, openAIWidget]);

  const bodyRaw = t("expParquesAtraccionesModalBody");
  const bodyLines = useMemo(
    () =>
      bodyRaw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    [bodyRaw],
  );

  const { parkGroups, tip } = useMemo(() => {
    const tipLine = bodyLines.length > 0 ? bodyLines[bodyLines.length - 1] : "";
    const rawContentLines = tipLine ? bodyLines.slice(0, -1) : bodyLines;
    return {
      parkGroups: groupBodyLines(rawContentLines),
      tip: tipLine,
    };
  }, [bodyLines]);

  const rowsWithIds = useMemo(() => assignScrollIds(parkGroups), [parkGroups]);

  const title = t("expParquesAtraccionesModalTitle");
  const subtitle = t("expParquesAtraccionesModalSubtitle");
  const intro = t("expParquesAtraccionesModalIntro");

  return (
    <div className={isModal ? "overflow-y-auto flex-1 px-8 py-6 scrollbar-modal" : "container mx-auto px-4 py-12"}>
      <div className={isModal ? "bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14" : "bg-brand-bg border border-gray-100 rounded-sm px-8 pt-6 pb-6 mb-6"}>
        <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
        <h1
          id="parques-attractions-modal-title"
          className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}
        >
          {title}
        </h1>
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
          {subtitle}
        </p>
      </div>

      {intro ? (
        <p className="text-sm text-gray-700 leading-relaxed mb-6 border-l-2 border-brand-gold pl-4 whitespace-pre-line">
          {intro}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        {rowsWithIds.map(({ group, mainId, bulletIds }, idx) => (
          <div
            key={`${idx}-${group.main.slice(0, 20)}`}
            id={mainId}
            className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors scroll-mt-6"
          >
            <>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {renderLabeledLine(group.main)}
              </p>
              {group.bullets.length > 0 && (
                <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                  {group.bullets.map((bullet, bIdx) => {
                    const bid = bulletIds[bIdx];
                    return (
                      <li
                        key={bIdx}
                        id={bid}
                        className="text-sm text-gray-700 leading-relaxed list-disc list-inside scroll-mt-6"
                      >
                        {renderLabeledLine(bullet)}
                        {bid &&
                          TERRA_IMAGES_BY_PARK[bid] &&
                          shouldRenderImageBelowParagraph(bid) && (
                            <div className="mt-2">
                              <TerraImagesForPark parkId={bid} />
                            </div>
                          )}
                        {bid &&
                          TERRA_IMAGES_BY_PARK[bid] &&
                          !shouldRenderImageBelowParagraph(bid) && (
                            <TerraImagesForPark parkId={bid} />
                          )}
                      </li>
                    );
                  })}
                </ul>
              )}
              {mainId && TERRA_IMAGES_BY_PARK[mainId] && (
                <TerraImagesForPark parkId={mainId} imgClassName={mainId === "park-terra-mitica" ? "max-h-24 object-cover" : undefined} />
              )}
            </>
          </div>
        ))}
      </div>

      {tip ? (
        <div
          className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={handleAdviceBoxClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleAdviceBoxClick();
            }
          }}
        >
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
  );
}
