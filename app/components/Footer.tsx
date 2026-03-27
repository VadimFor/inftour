"use client";

import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../lib/langStore";

export default function Footer() {
  const { t } = useLangStore(useShallow((s) => ({ t: s.t })));
  return (
    <footer className="bg-brand-stone text-gray-700 pt-20 pb-10 border-t border-gray-300 font-bold">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-300 pb-16">
          <div className="md:col-span-1 text-center md:text-left">
            <span className="block font-serif text-[30px]! leading-[0.95] font-semibold tracking-[0.06em] text-brand-gold uppercase">
              INFTOUR SPAIN S.L.
            </span>
            <p className="mt-6 text-[19px] text-gray-700 leading-relaxed font-bold">
              {t("footerTagline")}
            </p>
            <p className="mt-4 text-[15px] text-gray-400 leading-relaxed font-bold">
              {t("footerLicense")}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h5 className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-6">
              {t("navigation")}
            </h5>
            <ul className="space-y-4 text-sm text-gray-600 font-bold flex flex-col items-center md:items-start">
              <li>
                <Link href="/" className="hover:text-gray-900 transition">
                  {t("reservaDirecta")}
                </Link>
              </li>
              <li>
                <Link
                  href="/experiencias"
                  className="hover:text-gray-900 transition"
                >
                  {t("experiencias")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-gray-900 transition"
                >
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link
                  href="/revista"
                  className="hover:text-gray-900 transition"
                >
                  {t("revista")}
                </Link>
              </li>
              <li>
                <Link href="/lobby" className="hover:text-gray-900 transition">
                  {t("lobby")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h5 className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-6">
              {t("contact")}
            </h5>
            <div className="text-sm text-gray-700 leading-relaxed flex flex-col items-center md:items-start font-bold">
              <a
                href="https://www.google.com/maps/search/?api=1&query=INFTOUR,+C.+Jardín,+3,+03710+Calp,+Alicante"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition"
              >
                C. Jardín 3 Local INFTOUR
                <br />
                Calpe, Alicante
              </a>
              <p className="mt-3 text-gray-600 font-bold">
                e-mail:{" "}
                <a
                  href="mailto:mail@inftour.net"
                  className="text-brand-gold hover:opacity-80 transition"
                >
                  mail@inftour.net
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider text-center md:text-left">
          <p>{t("allRightsReserved")}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-gray-900 transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
