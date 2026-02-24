"use client";

import { useEffect, useRef, useState } from "react";
import { useLangStore } from "../lib/langStore";
import type { Lang } from "../lib/langStore";

function FlagEngland({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FlagSpain({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 3 2"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="3" height="0.67" fill="#AA151B" />
      <rect y="0.67" width="3" height="0.66" fill="#F1BF00" />
      <rect y="1.33" width="3" height="0.67" fill="#AA151B" />
    </svg>
  );
}

function FlagRussia({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 9 6"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="9" height="2" fill="#fff" />
      <rect y="2" width="9" height="2" fill="#0039a6" />
      <rect y="4" width="9" height="2" fill="#d52b1e" />
    </svg>
  );
}

const LANGUAGES: Array<{ code: Lang; label: string; Icon: typeof FlagEngland; title: string }> = [
  { code: "eng", label: "ENG", Icon: FlagEngland, title: "English" },
  { code: "esp", label: "ESP", Icon: FlagSpain, title: "Español" },
  { code: "ru", label: "RU", Icon: FlagRussia, title: "Русский" },
];

type LanguageSwitcherProps = {
  /** When true, shows only the selected flag and opens a dropdown on click (for navbar). */
  compact?: boolean;
};

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (compact) {
    const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
    return (
      <div className="relative overflow-visible" ref={containerRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          className="w-8 h-6 shrink-0 overflow-hidden rounded-md border border-gray-300 inline-flex focus:outline-none focus:ring-2 focus:ring-brand-gold cursor-pointer"
          title={current.title}
          aria-label={`Language: ${current.title}`}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <current.Icon className="w-full h-full" />
        </button>
        {open && (
          <div
            className="absolute right-0 top-full mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-8 z-[100]"
            role="listbox"
            aria-label="Select language"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={lang === l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full flex justify-center py-2 px-3 hover:bg-brand-stone transition ${lang === l.code ? "ring-1 ring-inset ring-brand-gold" : ""}`}
                title={l.title}
              >
                <span className="w-7 h-5 shrink-0 overflow-hidden rounded-sm inline-flex">
                  <l.Icon className="w-full h-full" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition ${
            lang === l.code
              ? "text-brand-gold font-bold"
              : "text-white/80 hover:text-brand-gold hover:font-medium"
          }`}
          title={l.title}
        >
          <span className="w-5 h-3.5 shrink-0 overflow-hidden rounded-sm border border-white/20 inline-flex">
            <l.Icon className="w-full h-full" />
          </span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}
