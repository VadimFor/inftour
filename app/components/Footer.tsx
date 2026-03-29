"use client";

import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../lib/langStore";

export default function Footer() {
  const { t } = useLangStore(useShallow((s) => ({ t: s.t })));
  return (
    <footer className="bg-brand-footer pt-16 border-t border-gray-200 mt-auto text-gray-800">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 pb-16">
        <div>
          <h4 className="text-brand-gold text-xl font-bold font-serif tracking-wider mb-6">
            INFTOUR SPAIN S.L.
          </h4>
          <p className="text-sm text-gray-600 mb-6 font-medium">
            {t("footerTagline")}
          </p>
          <div className="text-sm text-gray-600 font-medium">
            <p>{t("footerLicense")}</p>
          </div>
        </div>

        <div>
          <h4 className="text-brand-gold text-lg font-bold mb-6">
            {t("navigation")}
          </h4>
          <ul className="space-y-2 text-sm text-gray-800 font-semibold">
            <li>
              <Link href="/" className="hover:text-brand-gold transition">
                {t("reservaDirecta")}
              </Link>
            </li>
            <li>
              <Link
                href="/experiencias"
                className="hover:text-brand-gold transition"
              >
                {t("experiencias")}
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-brand-gold transition">
                {t("services")}
              </Link>
            </li>
            <li>
              <Link href="/revista" className="hover:text-brand-gold transition">
                {t("revista")}
              </Link>
            </li>
            <li>
              <Link href="/lobby" className="hover:text-brand-gold transition">
                {t("lobby")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-brand-gold text-lg font-bold mb-6">
            {t("contact")}
          </h4>
          <div className="space-y-4 text-sm text-gray-800 font-semibold">
            <p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=INFTOUR,+C.+Jardín,+3,+03710+Calp,+Alicante"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold transition"
              >
                C. Jardín 3 Local INFTOUR
                <br />
                Calpe, Alicante
              </a>
            </p>
            <p>
              e-mail:{" "}
              <a
                href="mailto:mail@inftour.net"
                className="hover:text-brand-gold transition font-normal"
              >
                mail@inftour.net
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-brand-darkgray text-white text-[11px] py-4 text-center tracking-wide font-medium">
        {t("allRightsReserved")}
      </div>
    </footer>
  );
}
