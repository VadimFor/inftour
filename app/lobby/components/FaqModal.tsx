"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { Fragment, ReactNode, useCallback, useEffect, useMemo } from "react";
import { useLangStore } from "../../lib/langStore";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";

type FaqModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FaqSection = {
  heading: string;
  lines: string[];
};

function normalizeAdviceLine(line: string): string {
  return line
    .replace(
      /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?=[^\s.,;:!?])/g,
      "$1 ",
    )
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function splitAdviceLineIfCompound(line: string): string[] {
  const normalized = normalizeAdviceLine(line).replace(/\u00A0/g, " ");
  if (!normalized) return [];

  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
  const emailStart = normalized.search(emailRegex);

  // Some translations accidentally merge "Phone/WhatsApp" + email into one line.
  if (
    emailStart > 0 &&
    /(whatsapp|phone|tel[eé]fono|telefono|телефон|t[ée]l[ée]phone)/i.test(
      normalized.slice(0, emailStart),
    )
  ) {
    const beforeEmail = normalized.slice(0, emailStart).trim();
    const fromEmail = normalized.slice(emailStart).trim();
    return [beforeEmail, ...splitAdviceLineIfCompound(fromEmail)].filter(Boolean);
  }

  const emailTailMatch = normalized.match(
    /^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\s+(.+)$/,
  );
  if (emailTailMatch) {
    return [emailTailMatch[1], ...splitAdviceLineIfCompound(emailTailMatch[2])].filter(
      Boolean,
    );
  }

  return [normalized];
}

function isNoiseAdviceLine(line: string): boolean {
  const value = line.trim();
  if (!value) return true;
  // Guard against orphan fragments from malformed translations (e.g. lone "t").
  if (/^[A-Za-z]$/.test(value)) return true;
  return false;
}

function splitSectionHeading(heading: string) {
  const match = heading.match(/^(\d+)\.\s*(.+)$/);
  if (!match) return null;
  return { number: match[1], title: match[2] };
}

function renderInlineLinkChunks(
  line: string,
  keyPrefix: string,
  linkClassName: string,
): ReactNode[] {
  const chunks: ReactNode[] = [];
  const tokenRegex =
    /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|(?:https?:\/\/)?(?:www\.)?inftour(?:\.?com)?|\+?\d[\d\s().-]{6,}\d)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null = tokenRegex.exec(line);
  let tokenIndex = 0;

  while (match) {
    const token = match[0];
    if (match.index > lastIndex) {
      chunks.push(
        <span key={`${keyPrefix}-text-${tokenIndex}`}>
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const normalizedToken = token.trim();
    const lowerToken = normalizedToken.toLowerCase();

    if (normalizedToken.includes("@")) {
      chunks.push(
        <a
          key={`${keyPrefix}-email-${tokenIndex}`}
          href={`mailto:${normalizedToken}`}
          className={linkClassName}
        >
          {normalizedToken}
        </a>,
      );
    } else if (lowerToken.includes("inftour")) {
      const looksLikeUrl = /^https?:\/\//i.test(normalizedToken);
      const label = looksLikeUrl
        ? normalizedToken
        : normalizedToken
            .replace(/^www\.?inftourcom$/i, "www.inftour.com")
            .replace(/^inftourcom$/i, "www.inftour.com")
            .replace(/^inftour\.com$/i, "www.inftour.com");
      chunks.push(
        <Link
          key={`${keyPrefix}-site-${tokenIndex}`}
          href="/"
          className={linkClassName}
        >
          {label}
        </Link>,
      );
    } else {
      const digitsOnly = normalizedToken.replace(/[^\d+]/g, "");
      const href = digitsOnly.startsWith("+")
        ? `tel:${digitsOnly}`
        : `tel:+${digitsOnly}`;
      chunks.push(
        <a
          key={`${keyPrefix}-phone-${tokenIndex}`}
          href={href}
          className={linkClassName}
        >
          {normalizedToken}
        </a>,
      );
    }

    lastIndex = match.index + token.length;
    tokenIndex += 1;
    match = tokenRegex.exec(line);
  }

  if (lastIndex < line.length) {
    chunks.push(<span key={`${keyPrefix}-tail`}>{line.slice(lastIndex)}</span>);
  }

  return chunks;
}

function renderLinkedContactLine(line: string, keyPrefix: string): ReactNode {
  return (
    <p key={keyPrefix} className="text-xs leading-relaxed text-gray-300">
      {renderInlineLinkChunks(
        line,
        keyPrefix,
        "text-brand-gold hover:underline",
      )}
    </p>
  );
}

function isChecklistCandidateLine(line: string): boolean {
  if (!line) return false;
  if (line.includes("?") || line.includes("@") || line.includes("→"))
    return false;
  if (/^\d+\.\s/.test(line) || /^[•\-]\s*/.test(line) || /^[oO]\s+/.test(line))
    return false;
  if (line.endsWith(":") || line.endsWith(".") || line.endsWith(";"))
    return false;
  if (line.split(/\s+/).length > 10) return false;
  return true;
}

function isAIAdviceLine(line: string): boolean {
  return /(?:\bAI\b|\bIA\b|assistant|asistente|ассистент|assistante|assistent|asystent)/i.test(
    line,
  );
}

function renderFaqLine(line: string, key: string): ReactNode {
  if (/^[•\-]\s*/.test(line)) {
    return (
      <p
        key={key}
        className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed"
      >
        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
        <span>{line.replace(/^[•\-]\s*/, "")}</span>
      </p>
    );
  }

  if (/^[oO]\s+/.test(line)) {
    return (
      <p
        key={key}
        className="flex items-start gap-2.5 pl-5 text-sm text-gray-600 leading-relaxed"
      >
        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
        <span>{line.replace(/^[oO]\s+/, "")}</span>
      </p>
    );
  }

  const questionWithAnswerMatch = line.match(/^(.*?\?)(.+)$/u);
  if (questionWithAnswerMatch) {
    const question = questionWithAnswerMatch[1].trim();
    const answer = questionWithAnswerMatch[2].trim();
    return (
      <div key={key} className="space-y-2">
        <p className="rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-brand-black">
          {question}
        </p>
        {!!answer && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {renderInlineLinkChunks(
              answer,
              `${key}-answer`,
              "font-medium text-brand-gold hover:underline",
            )}
          </p>
        )}
      </div>
    );
  }

  if (line.includes("?")) {
    return (
      <p
        key={key}
        className="rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-brand-black"
      >
        {line}
      </p>
    );
  }

  if (line.includes("→")) {
    return (
      <p
        key={key}
        className="rounded-sm bg-white border border-gray-200 px-4 py-3 text-sm font-semibold"
      >
        {line}
      </p>
    );
  }

  if (line.includes("@")) {
    return (
      <p key={key} className="text-sm text-gray-700 leading-relaxed">
        {renderInlineLinkChunks(
          line,
          key,
          "font-medium text-brand-gold hover:underline",
        )}
      </p>
    );
  }

  if (/(?:https?:\/\/)?(?:www\.)?inftour(?:\.?com)?/i.test(line)) {
    return (
      <p key={key} className="text-sm font-semibold text-brand-black break-all">
        {renderInlineLinkChunks(
          line,
          key,
          "text-brand-black underline hover:text-brand-gold",
        )}
      </p>
    );
  }

  if (/^\+?\d[\d\s()+-]+(\s[oó]| or )\s\+?\d/.test(line)) {
    return (
      <p
        key={key}
        className="rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800"
      >
        {line}
      </p>
    );
  }

  if (line.length <= 28 && !line.endsWith(".") && !line.endsWith(":")) {
    return (
      <h5 key={key} className="text-base font-semibold text-brand-black">
        {line}
      </h5>
    );
  }

  return (
    <p key={key} className="text-sm text-gray-700 leading-relaxed">
      {renderInlineLinkChunks(
        line,
        key,
        "font-medium text-brand-gold hover:underline",
      )}
    </p>
  );
}

function renderSectionLines(lines: string[], sectionKey: string): ReactNode[] {
  const rendered: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const current = lines[i];
    if (!current) {
      i += 1;
      continue;
    }

    if (current.endsWith(":")) {
      const checklistItems: string[] = [];
      let j = i + 1;
      while (j < lines.length && isChecklistCandidateLine(lines[j])) {
        checklistItems.push(lines[j]);
        j += 1;
      }

      if (checklistItems.length >= 2) {
        rendered.push(
          <div
            key={`${sectionKey}-checklist-${i}`}
            className="rounded-sm border border-brand-gold/25 bg-white/85 p-4 sm:p-5"
          >
            <p className="text-sm font-medium text-gray-800">{current}</p>
            <ul className="mt-3 space-y-2">
              {checklistItems.map((item, itemIdx) => (
                <li
                  key={`${sectionKey}-check-${i}-${itemIdx}`}
                  className="flex items-start gap-2.5 text-sm text-gray-700"
                >
                  <span className="mt-[6px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>,
        );
        i = j;
        continue;
      }
    }

    rendered.push(renderFaqLine(current, `${sectionKey}-line-${i}`));
    i += 1;
  }

  return rendered;
}

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const t = useLangStore((s) => s.t);
  const lang = useLangStore((s) => s.lang);
  useModalBodyScrollLock(isOpen);
  const openAIWidget = useCallback(() => {
    const widget = document.querySelector(
      "elevenlabs-convai",
    ) as HTMLElement & {
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
        if (
          text === "accept" ||
          text === "aceptar" ||
          text.includes("accept")
        ) {
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
        const clickable = root.querySelector(
          "button, [role='button']",
        ) as HTMLElement | null;
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
  const handleAIAdviceClick = useCallback(() => {
    onClose();
    openAIWidget();
  }, [onClose, openAIWidget]);
  const faqLines = useMemo(
    () =>
      t("faqModalContent")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(
          (line, index) =>
            !(
              index === 0 &&
              line.localeCompare(t("faqModalTitle"), undefined, {
                sensitivity: "accent",
              }) === 0
            ),
        ),
    [t, lang],
  );
  const firstSectionIndex = useMemo(
    () => faqLines.findIndex((line) => /^\d+\.\s/.test(line)),
    [faqLines],
  );
  const introLines = useMemo(
    () => (firstSectionIndex > 0 ? faqLines.slice(0, firstSectionIndex) : []),
    [faqLines, firstSectionIndex],
  );
  const introHeading = introLines[0] ?? "";
  const introDescription = introLines[1] ?? "";
  const introChecklist = useMemo(
    () =>
      introLines
        .slice(2)
        .map((line) => line.replace(/^[•\-]\s*/, ""))
        .filter(Boolean),
    [introLines],
  );
  const contentLines = useMemo(
    () =>
      firstSectionIndex > 0 ? faqLines.slice(firstSectionIndex) : faqLines,
    [faqLines, firstSectionIndex],
  );
  const adviceStartIndex = useMemo(
    () =>
      contentLines.findIndex(
        (line) => line.includes("→") && /inftour/i.test(line),
      ),
    [contentLines],
  );
  const adviceLines = useMemo(
    () =>
      adviceStartIndex >= 0
        ? contentLines
            .slice(adviceStartIndex)
            .flatMap((line) => splitAdviceLineIfCompound(line))
            .filter((line) => !isNoiseAdviceLine(line))
        : [],
    [contentLines, adviceStartIndex],
  );
  const mainContentLines = useMemo(
    () =>
      adviceStartIndex >= 0
        ? contentLines.slice(0, adviceStartIndex)
        : contentLines,
    [contentLines, adviceStartIndex],
  );
  const sections = useMemo<FaqSection[]>(() => {
    const parsed: FaqSection[] = [];
    let current: FaqSection | null = null;

    for (const line of mainContentLines) {
      if (!line) continue;

      if (/^\d+\.\s/.test(line)) {
        if (current) parsed.push(current);
        current = { heading: line, lines: [] };
        continue;
      }

      if (!current) {
        current = { heading: "", lines: [] };
      }
      current.lines.push(line);
    }

    if (current) parsed.push(current);
    return parsed;
  }, [mainContentLines]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-t-2xl sm:rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("lobCloseModal")}
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

        <div className="scrollbar-modal overflow-y-auto flex-1 px-8 py-6">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h2
              id="faq-modal-title"
              className="text-3xl font-serif text-gray-900 leading-tight"
            >
              {t("faqModalTitle")}
            </h2>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {t("faqModalSubtitle")}
            </p>
          </div>

          {introLines.length > 0 && (
            <div className="mb-6 rounded-lg border border-brand-gold/25 bg-linear-to-b from-white to-brand-bg/40 p-5 shadow-sm sm:p-6">
              {(!!introHeading || !!introDescription) && (
                <div className="pb-4 border-b border-brand-gold/20">
                  {!!introHeading && (
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1 inline-block h-5 w-1.5 rounded-full bg-brand-gold"
                        aria-hidden
                      />
                      <h4 className="text-[17px] font-semibold tracking-tight text-brand-black leading-tight">
                        {introHeading}
                      </h4>
                    </div>
                  )}
                  {!!introDescription && (
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed max-w-prose">
                      {introDescription}
                    </p>
                  )}
                </div>
              )}
              {introChecklist.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                  {introChecklist.map((line, idx) => (
                    <li
                      key={`intro-check-${idx}`}
                      className="flex items-start gap-2.5 rounded-md bg-white/80 px-3 py-2 text-sm text-gray-800"
                    >
                      <span
                        className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold"
                        aria-hidden
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5">
            {sections.map((section, sectionIdx) => (
              <article
                key={`faq-section-${sectionIdx}`}
                className="group bg-brand-bg border border-gray-100 rounded-sm p-5 sm:p-6 flex flex-col gap-3 hover:border-brand-gold/40 hover:shadow-sm transition-all"
              >
                {section.heading &&
                  (() => {
                    const parsedHeading = splitSectionHeading(section.heading);
                    return (
                      <div className="flex items-start gap-3 pb-3 border-b border-gray-200/80">
                        <span
                          className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-gold px-2 text-[11px] font-bold text-white"
                          aria-hidden
                        >
                          {parsedHeading?.number ?? `${sectionIdx + 1}`}
                        </span>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                          {parsedHeading?.title ?? section.heading}
                        </h4>
                      </div>
                    );
                  })()}
                <div className="space-y-2.5">
                  {renderSectionLines(
                    section.lines,
                    `faq-section-${sectionIdx}`,
                  )}
                </div>
              </article>
            ))}

            {sections.length === 0 &&
              mainContentLines.map((line, idx) => (
                <Fragment key={`faq-fallback-wrapper-${idx}`}>
                  {line ? (
                    renderFaqLine(line, `faq-fallback-${idx}`)
                  ) : (
                    <div className="h-2" aria-hidden />
                  )}
                </Fragment>
              ))}
          </div>

          {adviceLines.length > 0 && (
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
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-white">
                  {adviceLines[0]}
                </p>
                {adviceLines.slice(1).map((line, idx) =>
                  isAIAdviceLine(line) ? (
                    <button
                      key={`faq-advice-ai-${idx}`}
                      type="button"
                      onClick={handleAIAdviceClick}
                      className="text-left text-xs leading-relaxed text-gray-300 hover:text-brand-gold hover:underline transition-colors"
                    >
                      {line}
                    </button>
                  ) : (
                    renderLinkedContactLine(line, `faq-advice-${idx}`)
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-2 flex justify-end bg-white">
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
