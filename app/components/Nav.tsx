"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { navItems } from "../lib/nav-config";
import { useLangStore } from "../lib/langStore";
import AIAgentChat from "./AIAgentChat";
import LanguageSwitcher from "./LanguageSwitcher";
import NavMobileMenu from "./NavMobileMenu";

export default function Nav() {
  const pathname = usePathname();
  const { lang, t } = useLangStore(useShallow((s) => ({ lang: s.lang, t: s.t })));
  return (
    <nav className="sticky top-10 z-50 transition-all duration-300 bg-linear-to-r from-amber-50/90 via-amber-50/95 to-amber-50/90 backdrop-blur-sm border-b border-gray-300 min-w-0" data-lang={lang}>
      <div className="container mx-auto px-6 h-20 flex justify-between items-center min-w-0">
        <Link
          href="/"
          className="group flex flex-col items-start shrink-0"
        >
          <span className="font-serif text-2xl font-bold tracking-wider group-hover:text-brand-gold transition">
            INFTOUR
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400">
            {t("calpeCollection")}
          </span>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-10 text-xs font-bold uppercase tracking-widest">
          {navItems.map(({ href, labelKey, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 transition relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-brand-gold after:transition-all hover:after:w-full hover:text-brand-black ${
                  isActive ? "text-brand-black after:w-full" : "text-gray-600 after:w-0"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t(labelKey)}
              </Link>
            );
          })}
          <AIAgentChat />
          <LanguageSwitcher compact />
        </div>
        <div className="shrink-0">
          <NavMobileMenu />
        </div>
      </div>
      <div className="h-px w-full bg-gray-300 min-w-0" aria-hidden />
    </nav>
  );
}
