"use client";

import Link from "next/link";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../lib/langStore";
import FooterRaicvModal from "./FooterRaicvModal";

export default function Footer() {
  const { t } = useLangStore(useShallow((s) => ({ t: s.t })));
  const [raicvModalOpen, setRaicvModalOpen] = useState(false);
  return (
    <footer className="bg-brand-footer pt-16 border-t border-gray-200 mt-auto text-gray-800">
      <div className="container mx-auto px-6 pb-16 flex justify-center">
        <div className="grid w-full max-w-full grid-cols-1 md:grid-cols-3 md:w-fit gap-x-14 gap-y-12 md:gap-x-16 lg:gap-x-20 text-center md:text-left">
          <div>
            <h4 className="text-brand-gold text-xl font-bold font-serif tracking-wider mb-6">
              INFTOUR SPAIN S.L.
            </h4>
            <p className="text-sm text-gray-600 mb-6 font-medium">
              {t("footerTagline")}
            </p>
            <div className="text-sm text-gray-600 font-medium space-y-2">
              <p>{t("footerLicense")}</p>
              <div className="flex justify-center md:justify-start">
                <button
                  type="button"
                  onClick={() => setRaicvModalOpen(true)}
                  aria-expanded={raicvModalOpen}
                  aria-haspopup="dialog"
                  className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold rounded-sm bg-brand-darkgray text-white shadow-sm border border-transparent hover:bg-gray-600 hover:border-gray-600 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-link"
                >
                  {t("footerRaicvViewInfo")}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
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
                <Link
                  href="/services"
                  className="hover:text-brand-gold transition"
                >
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link
                  href="/revista"
                  className="hover:text-brand-gold transition"
                >
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

          <div className="text-center">
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
                <a
                  href="tel:+34640748732"
                  className="hover:text-brand-gold transition"
                >
                  +34 640 748 732
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
      </div>

      <div className="bg-brand-darkgray text-white text-[11px] py-4 text-center tracking-wide font-medium">
        {t("allRightsReserved")}
      </div>

      <FooterRaicvModal isOpen={raicvModalOpen} onClose={() => setRaicvModalOpen(false)} />
    </footer>
  );
}
