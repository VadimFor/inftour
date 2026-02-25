"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLangStore } from "../lib/langStore";

const TEAM = [
  { image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", nameKey: "team1Name" as const, titleKey: "team1Title" as const },
  { image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", nameKey: "team2Name" as const, titleKey: "team2Title" as const },
  { image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", nameKey: "team3Name" as const, titleKey: "team3Title" as const },
  { image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", nameKey: "team4Name" as const, titleKey: "team4Title" as const },
];

const OFFICE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", alt: "Office" },
  { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80", alt: "Office space" },
  { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", alt: "Reception" },
];

const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps?q=C.+Jardín+3,+03710+Calp,+Alicante&z=16&output=embed";
const GOOGLE_MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=INFTOUR,+C.+Jardín,+3,+03710+Calp,+Alicante";

export default function LobbyContent() {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="relative z-20 pt-12 pb-24 container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif text-brand-black mb-12">
        {t("lobbyTitle")}
      </h1>

      {/* 1) Real estate company info + team */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-semibold text-brand-black mb-4">
          {t("sectionRealEstate")}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-10">
          {t("sectionRealEstateContent")}
        </p>
        <h3 className="text-xl font-serif font-semibold text-brand-black mb-6">
          {t("lobbyTeamHeading")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((person) => (
            <article key={person.nameKey} className="text-center">
              <div className="relative aspect-square max-w-[200px] mx-auto rounded-full overflow-hidden border-2 border-amber-100 shadow-md mb-3">
                <Image
                  src={person.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <p className="font-semibold text-brand-black">{t(person.nameKey)}</p>
              <p className="text-sm text-gray-500">{t(person.titleKey)}</p>
            </article>
          ))}
        </div>

        <h3 className="text-xl font-serif font-semibold text-brand-black mt-14 mb-6">
          {t("lobbyOfficeHeading")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {OFFICE_IMAGES.map((img) => (
            <div key={img.url} className="relative aspect-4/3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
            </div>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="INFTOUR office location"
          />
          <div className="p-3 bg-white border-t border-gray-200">
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold font-medium hover:underline"
            >
              {t("lobbyOpenInMaps")}
            </a>
            <span className="text-gray-500 text-sm ml-2">— INFTOUR, C. Jardín, 3, 03710 Calp, Alicante</span>
          </div>
        </div>
      </section>

      {/* 2) AI chatbot info */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-semibold text-brand-black mb-4">
          {t("sectionAIChat")}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {t("sectionAIChatContent")}
        </p>
      </section>

      {/* 3) Contact form – dark grey only around the form */}
      <section className="mb-16">
        <div className="max-w-xl mx-auto rounded-2xl bg-gray-800 border border-gray-600 p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold text-white">
                {t("sectionContact")}
              </h2>
              <p className="text-gray-400 mt-1.5 text-sm">
                {t("sectionContactSubtitle")}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="lobby-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  {t("formEmailLabel")}
                </label>
                <input
                  id="lobby-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/60 focus:border-brand-gold transition"
                placeholder={t("formEmailPlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="lobby-message" className="block text-sm font-medium text-gray-300 mb-1.5">
                  {t("formMessageLabel")}
                </label>
                <textarea
                  id="lobby-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/60 focus:border-brand-gold transition resize-y min-h-[120px]"
                  placeholder={t("formMessagePlaceholder")}
                />
              </div>
              <p className="text-gray-500 text-xs">
                {t("formSendsTo")}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full sm:w-auto min-w-[180px] px-6 py-3.5 rounded-xl bg-brand-gold text-brand-black font-semibold hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="size-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                    {t("formSubmit")}
                  </span>
                ) : (
                  t("formSubmit")
                )}
              </button>
              {status === "success" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-900/40 border border-green-700 text-green-200 text-sm">
                  <span className="size-5 shrink-0 rounded-full bg-green-500 flex items-center justify-center text-white" aria-hidden>
                    <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {t("formSuccess")}
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/40 border border-red-700 text-red-200 text-sm">
                  <span className="size-5 shrink-0 rounded-full bg-red-500 flex items-center justify-center text-white" aria-hidden>
                    <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  {t("formError")}
                </div>
              )}
            </form>
        </div>
      </section>

      {/* 4) Policies */}
      <section className="mb-16 text-center">
        <h2 className="text-2xl font-serif font-semibold text-brand-black mb-4">
          {t("sectionPolicies")}
        </h2>
        <ul className="space-y-2 text-gray-600 max-w-md mx-auto">
          <li>
            <Link href="#" className="hover:text-brand-gold underline">
              {t("cancellationPolicy")}
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-brand-gold underline">
              {t("paymentPolicy")}
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-brand-gold underline">
              {t("termsPolicy")}
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-brand-gold underline">
              {t("privacyPolicy")}
            </Link>
          </li>
        </ul>
      </section>

      {/* 5) FAQ */}
      <section className="mb-16 text-center">
        <h2 className="text-2xl font-serif font-semibold text-brand-black mb-4">
          {t("sectionFaq")}
        </h2>
        <div className="mx-auto max-w-2xl">
          <dl className="space-y-4 text-center">
          <details className="group border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-4 py-3 bg-gray-50 cursor-pointer list-none font-medium text-brand-black text-center">
              {t("faq1Q")}
            </summary>
            <dd className="px-4 py-3 text-gray-600 border-t border-gray-200 text-center">
              {t("faq1A")}
            </dd>
          </details>
          <details className="group border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-4 py-3 bg-gray-50 cursor-pointer list-none font-medium text-brand-black text-center">
              {t("faq2Q")}
            </summary>
            <dd className="px-4 py-3 text-gray-600 border-t border-gray-200 text-center">
              {t("faq2A")}
            </dd>
          </details>
          <details className="group border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-4 py-3 bg-gray-50 cursor-pointer list-none font-medium text-brand-black text-center">
              {t("faq3Q")}
            </summary>
            <dd className="px-4 py-3 text-gray-600 border-t border-gray-200 text-center">
              {t("faq3A")}
            </dd>
          </details>
          </dl>
        </div>
      </section>
    </main>
  );
}
