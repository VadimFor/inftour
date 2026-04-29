"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { navItems } from "../lib/nav-config";
import { useLangStore } from "../lib/langStore";
import LanguageSwitcher from "./LanguageSwitcher";
import NavMobileMenu from "./NavMobileMenu";

export default function Nav() {
  const pathname = usePathname();
  const { lang, t } = useLangStore(
    useShallow((s) => ({ lang: s.lang, t: s.t })),
  );
  const aiLabel = t("aiAgentCta");

  return (
    <nav
      className="sticky top-0 z-[1200] min-w-0 border-b border-gray-200 bg-white"
      data-lang={lang}
      data-site-nav
    >
      <div className="container mx-auto flex h-20 min-w-0 items-center justify-between px-6">
        <Link href="/" className="mt-1 flex shrink-0 flex-col items-start">
          <span className="font-serif text-3xl font-bold leading-none tracking-wider text-gray-800">
            INFTOUR
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-gold">
            {t("calpeCollection")}
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest lg:flex xl:gap-10">
          {navItems.map(({ href, labelKey }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-brand-gold after:transition-all after:content-[''] hover:text-brand-black hover:after:w-full ${
                  isActive
                    ? "text-brand-black after:w-full"
                    : "text-gray-600 after:w-0"
                }`}
              >
                {t(labelKey)}
              </Link>
            );
          })}
          <LanguageSwitcher compact />
          <a
            href="https://inftour.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 max-w-[190px] shrink-0 items-center justify-center rounded-sm bg-brand-darkgray px-2 py-1.5 text-center text-[11px] font-semibold leading-tight normal-case text-white shadow-sm transition hover:bg-gray-600 xl:px-3"
          >
            <span className="whitespace-normal">{aiLabel}</span>
          </a>
        </div>
        <div className="shrink-0">
          <NavMobileMenu />
        </div>
      </div>
      <div className="h-px w-full min-w-0 bg-gray-300" aria-hidden />
    </nav>
  );
}
