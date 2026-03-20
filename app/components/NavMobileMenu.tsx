"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { navItems } from "../lib/nav-config";
import { useLangStore } from "../lib/langStore";
import LanguageSwitcher from "./LanguageSwitcher";

const LG_BREAKPOINT = 1024;

export default function NavMobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lang, t } = useLangStore(useShallow((s) => ({ lang: s.lang, t: s.t })));

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
    const handleChange = () => {
      if (mql.matches) setOpen(false);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <ul className="flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-600">
              {navItems.map(({ href, labelKey }) => {
                const isActive = pathname === href;
                return (
                  <li key={href} className="w-full flex justify-center">
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`py-3 px-2 rounded-lg hover:text-brand-black hover:bg-white/60 transition relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-brand-gold after:transition-all ${
                        isActive ? "text-brand-black after:w-3/4 after:bottom-0" : "after:w-0 after:bottom-0"
                      }`}
                    >
                      {t(labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/lobby#ai-guide"
                  onClick={() => setOpen(false)}
                  className="bg-brand-darkgray text-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider hover:bg-gray-600 transition shadow-sm rounded-sm"
                >
                  AI Asistente →
                </Link>
              </div>
              <div className="flex justify-center">
                <LanguageSwitcher compact inlineAll />
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
