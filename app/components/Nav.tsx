"use client";

import Link from "next/link";
import { navItems } from "../lib/nav-config";
import { useLangStore } from "../lib/langStore";
import AIAgentChat from "./AIAgentChat";
import LanguageSwitcher from "./LanguageSwitcher";
import NavMobileMenu from "./NavMobileMenu";

export default function Nav() {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);
  return (
    <nav className="sticky top-8 z-50 transition-all duration-300 bg-gradient-to-r from-amber-50/90 via-amber-50/95 to-amber-50/90 backdrop-blur-sm border-b border-amber-100/80 min-w-0">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center min-w-0">
        <Link href="/" className="group flex flex-col items-start shrink-0">
          <span className="font-serif text-2xl font-bold tracking-wider group-hover:text-brand-gold transition">
            INFTOUR
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400">
            {t("calpeCollection")}
          </span>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-10 text-xs font-bold uppercase tracking-widest text-gray-600">
          {navItems.map(({ href, labelKey, first, Icon }) => (
            <Link
              key={href}
              href={href}
              className={
                first
                  ? "flex items-center gap-2 hover:text-brand-black transition relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-brand-gold hover:after:w-full after:transition-all"
                  : "flex items-center gap-2 hover:text-brand-black transition"
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t(labelKey)}
            </Link>
          ))}
          <AIAgentChat />
          <LanguageSwitcher compact />
        </div>
        <div className="shrink-0">
          <NavMobileMenu />
        </div>
      </div>
      <div className="h-px w-full bg-amber-100 min-w-0" aria-hidden />
    </nav>
  );
}
