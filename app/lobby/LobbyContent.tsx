"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../lib/langStore";
import aboutImage from "./pictures/oficina_inftour.png";
import aiBgImage from "./pictures/ai_espacio.png";

const INSTRUCTIONS = [
  { q: "lobInstr1Q" as const, a: "lobInstr1A" as const },
  { q: "lobInstr2Q" as const, a: "lobInstr2A" as const },
  { q: "lobInstr3Q" as const, a: "lobInstr3A" as const },
  { q: "lobInstr4Q" as const, a: "lobInstr4A" as const },
];

const POLICIES = [
  {
    titleKey: "cancellationPolicy" as const,
    descKey: "cancellationPolicyDesc" as const,
    href: "#",
  },
  {
    titleKey: "paymentPolicy" as const,
    descKey: "paymentPolicyDesc" as const,
    href: "#",
  },
  {
    titleKey: "termsPolicy" as const,
    descKey: "termsPolicyDesc" as const,
    href: "#",
  },
  {
    titleKey: "privacyPolicy" as const,
    descKey: "privacyPolicyDesc" as const,
    href: "#",
  },
];

function IconAI({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      />
    </svg>
  );
}

export default function LobbyContent() {
  const { t } = useLangStore(useShallow((s) => ({ lang: s.lang, t: s.t })));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  function openAIChat() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("openAIChat"));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, name: name || undefined }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
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
    <main className="relative z-20  pb-24 container mx-auto px-4 md:px-6 max-w-6xl">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto py-12 md:py-16">
        <span className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
          {t("lobHeroLabel")}
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-brand-black mb-6 leading-tight">
          {t("lobHeroTitle")}
        </h1>
        <p className="text-lg text-gray-600 font-light leading-relaxed">
          {t("lobHeroDesc")}
        </p>
      </section>

      {/* About us: image + text + details */}
      <section className="mb-20 md:mb-24">
        <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 relative h-64 md:min-h-[320px] overflow-hidden shrink-0">
            <Image
              src={aboutImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-serif text-brand-black mb-4">
              {t("lobAboutTitle")}
            </h2>
            <p className="text-gray-600 font-light leading-relaxed mb-6">
              {t("lobAboutIntro")
                .split(/\b(INFTOUR)\b/)
                .map((part, i) =>
                  part === "INFTOUR" ? (
                    <strong key={i} className="font-bold text-brand-black">
                      INFTOUR
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
            </p>
            <details className="group cursor-pointer">
              <summary className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-gold border-b border-gray-100 pb-3 list-none">
                {t("lobAboutReadMore")}
                <svg
                  className="w-4 h-4 transform group-open:rotate-180 transition duration-300 shrink-0 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="pt-4 text-sm text-gray-600 font-light leading-relaxed space-y-4">
                <p>{t("lobAboutStory1")}</p>
                <p>{t("lobAboutStory2")}</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Two columns: AI card + Contact card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 md:mb-24">
        {/* AI Assistant card */}
        <div
          id="ai-guide"
          className="bg-gray-900 text-white p-8 md:p-12 rounded-lg shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[320px]"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Image
              src={aiBgImage}
              alt=""
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 flex items-center justify-center bg-white/10 text-brand-gold rounded-full mb-6">
              <IconAI className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-serif mb-6">{t("lobAITitle")}</h3>
            <ul className="text-sm text-gray-300 font-light space-y-4 mb-8">
              {(["lobAI1", "lobAI2", "lobAI3", "lobAI4"] as const).map(
                (key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    {t(key)}
                  </li>
                ),
              )}
            </ul>
            <button
              type="button"
              onClick={openAIChat}
              className="bg-brand-gold text-white px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 transition rounded-lg"
            >
              {t("lobAIStartChat")}
            </button>
          </div>
        </div>

        {/* Contact card */}
        <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm rounded-lg">
          <h3 className="text-3xl font-serif text-brand-black mb-2">
            {t("sectionContact")}
          </h3>
          <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-8">
            {t("lobContactWeAreHere")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t("formNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition"
              />
              <input
                type="email"
                placeholder={t("formEmailLabel")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition"
              />
            </div>
            <textarea
              placeholder={t("lobFormHelpPlaceholder")}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition resize-none"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-(--color-brand-darkgray) text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-600 transition rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("formSubmit")}
                </span>
              ) : (
                t("formSubmit")
              )}
            </button>
            {status === "success" && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                {t("formSuccess")}
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {t("formError")}
              </div>
            )}
          </form>

          <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-600 font-medium">
            <p className="flex items-center gap-3">
              <span className="text-brand-gold" aria-hidden>
                📍
              </span>
              {t("lobAddressLine")}
            </p>
            <p className="flex items-center gap-3">
              <span className="text-brand-gold" aria-hidden>
                📞
              </span>
              {t("lobPhoneLine")}
            </p>
            <p className="flex items-center gap-3">
              <span className="text-brand-gold" aria-hidden>
                ✉️
              </span>
              <a
                href={`mailto:${t("lobEmailLine")}`}
                className="hover:text-brand-gold transition"
              >
                {t("lobEmailLine")}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Instructions + Policies */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-serif text-brand-black mb-6">
            {t("lobInstructionsTitle")}
          </h3>
          <div className="space-y-3">
            {INSTRUCTIONS.map(({ q, a }) => (
              <details
                key={q}
                className="group bg-white border border-gray-100 rounded-lg overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-bold text-brand-black hover:text-brand-gold transition list-none">
                  {t(q)}
                  <span className="text-gray-400 group-open:rotate-45 transition duration-300 text-xl leading-none shrink-0 ml-2">
                    +
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 font-light border-t border-gray-50 pt-3">
                  {t(a)}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-serif text-brand-black mb-6">
            {t("lobPoliciesTitle")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POLICIES.map(({ titleKey, descKey, href }) => (
              <Link
                key={titleKey}
                href={href}
                className="group block p-6 bg-(--color-brand-bg) border border-gray-100 rounded-lg hover:border-brand-gold hover:bg-white transition"
              >
                <h4 className="font-bold text-sm text-brand-black mb-2 group-hover:text-brand-gold transition">
                  {t(titleKey)}
                </h4>
                <p className="text-xs text-gray-500 font-light">{t(descKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
