"use client";

import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../lib/langStore";

export default function Footer() {
  const { lang, t } = useLangStore(useShallow((s) => ({ lang: s.lang, t: s.t })));
  return (
    <footer className="bg-gradient-to-b from-brand-black via-gray-900 to-black text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-800 pb-16">
          <div className="md:col-span-1 text-center md:text-left">
            <span className="font-serif text-3xl font-bold tracking-wider text-white">
              INFTOUR
            </span>
            <p className="mt-6 text-xs text-gray-400 leading-loose">
              {t("footerTagline")}
              <br />
              {t("footerLicense")}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h5 className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-6">
              {t("navigation")}
            </h5>
            <ul className="space-y-4 text-sm text-gray-300 font-light flex flex-col items-center md:items-start">
              <li>
                <Link href="/" className="hover:text-white transition">
                  {t("reservaDirecta")}
                </Link>
              </li>
              <li>
                <Link href="/experiencias" className="hover:text-white transition">
                  {t("experiencias")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link href="/revista" className="hover:text-white transition">
                  {t("revista")}
                </Link>
              </li>
              <li>
                <Link href="/lobby" className="hover:text-white transition">
                  {t("lobby")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h5 className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-6">
              {t("contact")}
            </h5>
            <ul className="space-y-4 text-sm text-gray-300 font-light flex flex-col items-center md:items-start">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="opacity-50">📍</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=INFTOUR,+C.+Jardín,+3,+03710+Calp,+Alicante"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  INFTOUR, C. Jardín, 3, 03710 Calp, Alicante
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="opacity-50">📞</span>
                <a href="tel:+34690169954" className="hover:text-white transition">
                  +34 690 16 99 54
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="opacity-50">✉️</span>
                <a href="mailto:booking@inftour.com" className="hover:text-white transition">
                  booking@inftour.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-wider text-center md:text-left">
          <p>{t("allRightsReserved")}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-gray-400">
              {t("privacyPolicy")}
            </Link>
            <Link href="#" className="hover:text-gray-400">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
