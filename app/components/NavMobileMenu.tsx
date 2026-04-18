"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { navItems } from "../lib/nav-config";
import { useLangStore } from "../lib/langStore";
import LanguageSwitcher from "./LanguageSwitcher";

const LG_BREAKPOINT = 1024;

export default function NavMobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [panelTopPx, setPanelTopPx] = useState(0);
  const { lang, t } = useLangStore(
    useShallow((s) => ({ lang: s.lang, t: s.t })),
  );
  const aiLabel = lang === "esp" ? "Asistente IA" : t("aiAgent");

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

  useLayoutEffect(() => {
    if (!open) return;
    const nav = document.querySelector<HTMLElement>("[data-site-nav]");
    const syncTop = () => {
      const bottom = nav?.getBoundingClientRect().bottom;
      if (typeof bottom === "number" && bottom > 0) setPanelTopPx(bottom);
    };
    syncTop();
    const ro = nav ? new ResizeObserver(syncTop) : null;
    if (nav) ro?.observe(nav);
    window.addEventListener("resize", syncTop);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", syncTop);
    };
  }, [open]);

  return (
    <div className="shrink-0 lg:hidden">
      <button
        type="button"
        onClick={() => {
          triggerLightTapHaptic();
          setOpen((o) => !o);
        }}
        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-brand-black"
        aria-expanded={open}
        aria-label={open ? t("closeMenu") : t("openMenu")}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <>
          <div
            className="fixed inset-0 z-[1290] bg-black/20"
            aria-hidden
            onClick={() => {
              triggerLightTapHaptic();
              setOpen(false);
            }}
          />
          <div
            className="fixed left-0 right-0 z-[1300] border-b border-gray-200 bg-gradient-to-b from-gray-50 to-brand-stone px-6 py-4 shadow-lg"
            style={{ top: panelTopPx > 0 ? `${panelTopPx}px` : "5rem" }}
          >
            <ul className="flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-widest text-gray-600">
              {navItems.map(({ href, labelKey }) => {
                const isActive = pathname === href;
                return (
                  <li key={href} className="flex w-full justify-center">
                    <Link
                      href={href}
                      onClick={() => {
                        triggerLightTapHaptic();
                        setOpen(false);
                      }}
                      className={`relative rounded-lg px-2 py-3 transition after:absolute after:left-1/2 after:h-0.5 after:-translate-x-1/2 after:bg-brand-gold after:transition-all after:content-[''] hover:bg-white/60 hover:text-brand-black ${
                        isActive
                          ? "text-brand-black after:bottom-0 after:w-3/4"
                          : "after:bottom-0 after:w-0"
                      }`}
                    >
                      {t(labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/lobby#ai-guide"
                  onClick={() => {
                    triggerLightTapHaptic();
                    setOpen(false);
                  }}
                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-sm bg-brand-darkgray px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-gray-600"
                >
                  <span>{aiLabel}</span>
                  <span aria-hidden>&rarr;</span>
                </Link>
              </div>
              <div className="flex justify-center">
                <LanguageSwitcher compact inlineAll />
              </div>
            </div>
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}
