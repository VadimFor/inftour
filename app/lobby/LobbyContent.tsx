"use client";

import Link from "next/link";
import { useState } from "react";
import { useLangStore } from "../lib/langStore";

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

      {/* 1) Real estate company info */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-semibold text-brand-black mb-4">
          {t("sectionRealEstate")}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {t("sectionRealEstateContent")}
        </p>
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

      {/* 3) Email form */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-semibold text-brand-black mb-4">
          {t("sectionContact")}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {t("formMessageLabel")} → booking@inftour.com
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="lobby-email" className="block text-sm font-medium text-gray-700 mb-1">
              {t("formEmailLabel")}
            </label>
            <input
              id="lobby-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="lobby-message" className="block text-sm font-medium text-gray-700 mb-1">
              {t("formMessageLabel")}
            </label>
            <textarea
              id="lobby-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold resize-y"
              placeholder="..."
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-6 py-2 bg-brand-gold text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {status === "sending" ? "…" : t("formSubmit")}
          </button>
          {status === "success" && (
            <p className="text-green-600 text-sm">{t("formSuccess")}</p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm">{t("formError")}</p>
          )}
        </form>
      </section>

      {/* 4) Policies */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-semibold text-brand-black mb-4">
          {t("sectionPolicies")}
        </h2>
        <ul className="space-y-2 text-gray-600">
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
      <section>
        <h2 className="text-2xl font-serif font-semibold text-brand-black mb-4">
          {t("sectionFaq")}
        </h2>
        <dl className="space-y-4">
          <details className="group border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-4 py-3 bg-gray-50 cursor-pointer list-none font-medium text-brand-black">
              {t("faq1Q")}
            </summary>
            <dd className="px-4 py-3 text-gray-600 border-t border-gray-200">
              {t("faq1A")}
            </dd>
          </details>
          <details className="group border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-4 py-3 bg-gray-50 cursor-pointer list-none font-medium text-brand-black">
              {t("faq2Q")}
            </summary>
            <dd className="px-4 py-3 text-gray-600 border-t border-gray-200">
              {t("faq2A")}
            </dd>
          </details>
          <details className="group border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-4 py-3 bg-gray-50 cursor-pointer list-none font-medium text-brand-black">
              {t("faq3Q")}
            </summary>
            <dd className="px-4 py-3 text-gray-600 border-t border-gray-200">
              {t("faq3A")}
            </dd>
          </details>
        </dl>
      </section>
    </main>
  );
}
