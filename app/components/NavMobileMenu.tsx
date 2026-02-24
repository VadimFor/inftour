"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { navItems } from "../lib/nav-config";
import { useLangStore } from "../lib/langStore";
import AIAgentChat from "./AIAgentChat";
import LanguageSwitcher from "./LanguageSwitcher";

export default function NavMobileMenu() {
  const [open, setOpen] = useState(false);
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);

  return (
    <div className="lg:hidden shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg text-gray-600 hover:text-brand-black hover:bg-gray-100 transition"
        aria-expanded={open}
        aria-label={open ? t("closeMenu") : t("openMenu")}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed left-0 right-0 z-50 py-4 px-6 bg-gradient-to-b from-gray-50 to-brand-stone border-b border-gray-200 shadow-lg"
            style={{ top: "7.5rem" }}
          >
            <ul className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-gray-600">
              {navItems.map(({ href, labelKey, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:text-brand-black hover:bg-white/60 transition"
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {t(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 pt-4 mt-4 border-t border-gray-200">
              <AIAgentChat />
              <LanguageSwitcher compact />
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
