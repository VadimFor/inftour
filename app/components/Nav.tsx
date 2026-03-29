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
  return (
    <nav
      className="sticky top-10 z-50 bg-white border-b border-gray-200 min-w-0"
      data-lang={lang}
    >
      <div className="container mx-auto px-6 h-20 flex justify-between items-center min-w-0">
        <Link href="/" className="flex flex-col items-start mt-1 shrink-0">
          <span className="font-serif text-3xl font-bold tracking-wider text-gray-800 leading-none">
            INFTOUR
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-gold mt-1">
            {t("calpeCollection")}
          </span>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-10 text-xs font-bold uppercase tracking-widest">
          {navItems.map(({ href, labelKey }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`transition relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-brand-gold after:transition-all hover:after:w-full hover:text-brand-black ${
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
          <Link
            href="/lobby#ai-guide"
            className="bg-brand-darkgray text-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider hover:bg-gray-600 transition shadow-sm rounded-sm"
          >
            AI Asistente →
          </Link>
        </div>
        <div className="shrink-0">
          <NavMobileMenu />
        </div>
      </div>
      <div className="h-px w-full bg-gray-300 min-w-0" aria-hidden />
    </nav>
  );
}
