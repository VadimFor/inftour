"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { useLangStore } from "../../lib/langStore";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";
import lobbyAboutImage from "../pictures/Inftour.png";
import ArrivalStayModal from "./ArrivalStayModal";
import AboutUsContent from "./AboutUsContent";
import FaqModal from "./FaqModal";
import InstructionsContent from "./InstructionsContent";
import PrivacyModal from "./PrivacyModal";
import ReportingChannelModal from "./ReportingChannelModal";

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

const INSTRUCTION_ITEMS = [
  { q: "lobInstr1Q" as const, a: "lobInstr1A" as const },
  { q: "lobInstr2Q" as const, a: "lobInstr2A" as const },
  { q: "lobInstr3Q" as const, a: "lobInstr3A" as const },
  { q: "lobInstr4Q" as const, a: "lobInstr4A" as const },
  { q: "lobInstr5Q" as const, a: "lobInstr5A" as const },
  { q: "lobInstr6Q" as const, a: "lobInstr6A" as const },
  { q: "lobInstr7Q" as const, a: "lobInstr7A" as const },
  { q: "lobInstr8Q" as const, a: "lobInstr8A" as const },
  { q: "lobInstr9Q" as const, a: "lobInstr9A" as const },
  { q: "lobInstr10Q" as const, a: "lobInstr10A" as const },
  { q: "lobInstr11Q" as const, a: "lobInstr11A" as const },
  { q: "lobInstr12Q" as const, a: "lobInstr12A" as const },
  { q: "lobInstr13Q" as const, a: "lobInstr13A" as const },
  { q: "lobInstr14Q" as const, a: "lobInstr14A" as const },
  { q: "lobInstr15Q" as const, a: "lobInstr15A" as const },
  { q: "lobInstr16Q" as const, a: "lobInstr16A" as const },
  { q: "lobInstr17Q" as const, a: "lobInstr17A" as const },
  { q: "lobInstr18Q" as const, a: "lobInstr18A" as const },
  { q: "lobInstr19Q" as const, a: "lobInstr19A" as const },
  { q: "lobInstr20Q" as const, a: "lobInstr20A" as const },
] as const;

const INSTRUCTION_QUICK_ITEMS = [
  "lobInstructionsQuickQ1",
  "lobInstructionsQuickQ2",
  "lobInstructionsQuickQ3",
  "lobInstructionsQuickQ4",
  "lobInstructionsQuickQ5",
] as const;

const URL_IN_INSTR_RE = /(https?:\/\/[^\s]+)/g;

/** Matches PASO 1 –, STEP 2 –, ШАГ 3 –, ÉTAPE 1 –, etc. */
const INSTR_STEP_RE =
  /^(?:PASO|STEP|SCHRITT|ШАГ|ÉTAPE|ÈTAPE|ETAPE|PASSO|FASE|KROK|КРОК)\s+(\d+)\s*[–\-—]\s*(.+)$/iu;

const INSTR_IMPORTANT_PREFIX =
  /^(?:IMPORTANTE|IMPORTANT|WICHTIG|ВАЖНО|ВАЖЛИВО|WAŻNE)\s*:/iu;

const INSTR_CASE_RE = /^👉\s*(.+)$/;

function stripLeadingListGlyph(s: string) {
  return s.replace(/^[•‣▪]\s*/, "");
}

function linkifyInstructionLine(s: string): ReactNode {
  const parts = s.split(URL_IN_INSTR_RE);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-brand-gold underline hover:text-amber-600"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type ClassifiedBullet =
  | { kind: "step"; num: string; body: string }
  | { kind: "case"; marker: string; body: string }
  | { kind: "plain"; body: string }
  | { kind: "important"; body: string };

function classifyInstructionBullet(raw: string): ClassifiedBullet {
  const trimmed = stripLeadingListGlyph(raw.trim());
  if (INSTR_IMPORTANT_PREFIX.test(trimmed)) {
    return { kind: "important", body: trimmed };
  }
  const caso = trimmed.match(INSTR_CASE_RE);
  if (caso) {
    const body = caso[1];
    const letter = body.match(/^(?:CASO|CASE|СЛУЧАЙ|FALL)\s*([AB])\b/i);
    const marker = letter ? letter[1].toUpperCase() : "→";
    return { kind: "case", marker, body };
  }
  const step = trimmed.match(INSTR_STEP_RE);
  if (step) return { kind: "step", num: step[1], body: step[2] };
  return { kind: "plain", body: trimmed };
}

function InstructionStepper({
  items,
}: {
  items: Exclude<ClassifiedBullet, { kind: "important" }>[];
}) {
  if (!items.length) return null;
  return (
    <div className="mb-4 space-y-2">
      {items.map((item, i) => {
        const badge =
          item.kind === "step"
            ? item.num
            : item.kind === "case"
              ? item.marker
              : "·";

        const body =
          item.kind === "case" ? (
            <>{linkifyInstructionLine(item.body)}</>
          ) : (
            linkifyInstructionLine(item.body)
          );

        return (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg bg-white border border-gray-100 px-4 py-3 shadow-sm"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold text-[0.65rem] font-bold text-white">
              {badge}
            </span>
            <p className="text-sm font-light leading-relaxed text-gray-700">
              {body}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ImportantCallout({ body }: { body: string }) {
  const sep = body.search(/:\s/);
  const hasLabel = sep >= 0;
  const label = hasLabel ? body.slice(0, sep + 1).trimEnd() : "";
  const rest = hasLabel ? body.slice(sep + 1).replace(/^\s+/, "") : body;
  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border-l-4 border-brand-gold bg-amber-50 px-4 py-3 text-sm font-light leading-relaxed text-gray-800">
      <div>
        {hasLabel && (
          <span className="mr-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brand-gold">
            {label}
          </span>
        )}
        {linkifyInstructionLine(rest)}
      </div>
    </div>
  );
}

function renderInstructionAnswer(text: string): ReactNode {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd());
  const nodes: ReactNode[] = [];
  let bulletGroup: string[] = [];

  function flushBullets() {
    if (!bulletGroup.length) return;
    const classified = bulletGroup.map(classifyInstructionBullet);
    let buf: Exclude<ClassifiedBullet, { kind: "important" }>[] = [];
    const flushStepper = () => {
      if (!buf.length) return;
      nodes.push(<InstructionStepper key={nodes.length} items={buf} />);
      buf = [];
    };
    for (const c of classified) {
      if (c.kind === "important") {
        flushStepper();
        nodes.push(<ImportantCallout key={nodes.length} body={c.body} />);
      } else {
        buf.push(c);
      }
    }
    flushStepper();
    bulletGroup = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBullets();
      continue;
    }
    if (trimmed.startsWith("•") || trimmed.startsWith("👉")) {
      bulletGroup.push(trimmed);
    } else {
      flushBullets();
      nodes.push(
        <p
          key={nodes.length}
          className="mb-3 text-sm font-light leading-relaxed text-gray-600"
        >
          {linkifyInstructionLine(trimmed)}
        </p>,
      );
    }
  }
  flushBullets();
  return <div className="space-y-1">{nodes}</div>;
}

const POLICIES = [
  {
    titleKey: "cancellationPolicy" as const,
    descKey: "cancellationPolicyDesc" as const,
    href: "#llegada-estancia",
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

function InstructionsSubtitle({ t }: { t: (key: string) => string }) {
  return (
    <div className="space-y-2">
      <p className="text-center text-base md:text-lg font-semibold italic leading-tight text-brand-black">
        {t("lobInstructionsQuickTitle")}
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {INSTRUCTION_QUICK_ITEMS.map((key) => (
          <p
            key={key}
            className="m-0 inline-flex rounded-md bg-[#eef1ff] px-3 py-2 text-sm md:text-base leading-snug text-[#2f45d3]"
          >
            {t(key)}
          </p>
        ))}
      </div>
    </div>
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
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [arrivalStayModalOpen, setArrivalStayModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [reportingChannelModalOpen, setReportingChannelModalOpen] =
    useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const shouldLockScroll = aboutModalOpen || instructionsModalOpen;
  useModalBodyScrollLock(shouldLockScroll);

  const openAIChat = useCallback(() => {
    const widget = document.querySelector(
      "elevenlabs-convai",
    ) as HTMLElement & {
      open?: () => void;
      toggle?: () => void;
      shadowRoot?: ShadowRoot | null;
    };
    if (!widget) return;

    const clickAcceptIfPresent = () => {
      const root = widget.shadowRoot;
      if (!root) return false;
      const buttons = Array.from(root.querySelectorAll("button"));
      for (const btn of buttons) {
        const text = (btn.textContent || "").trim().toLowerCase();
        if (
          text === "accept" ||
          text === "aceptar" ||
          text.includes("accept")
        ) {
          (btn as HTMLButtonElement).click();
          return true;
        }
      }
      return false;
    };

    if (typeof widget.open === "function") {
      widget.open();
    } else if (typeof widget.toggle === "function") {
      widget.toggle();
    } else {
      const root = widget.shadowRoot;
      if (!root) return;
      const avatar = root.querySelector(
        "div.absolute.inset-0.rounded-full.overflow-hidden.bg-base.bg-cover",
      ) as HTMLElement | null;
      if (avatar) {
        avatar.click();
      } else {
        const clickable = root.querySelector(
          "button, [role='button']",
        ) as HTMLElement | null;
        clickable?.click();
      }
    }

    let attempts = 0;
    const maxAttempts = 20;
    const timer = window.setInterval(() => {
      attempts += 1;
      const accepted = clickAcceptIfPresent();
      if (accepted || attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, 150);
  }, []);

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
    <>
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

        {/* About us: compact card + full story modal */}
        <section className="mb-24">
          <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 overflow-hidden">
              <Image
                src={lobbyAboutImage}
                alt={t("lobAboutDocMainTitle")}
                className="w-full h-full object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl font-serif text-gray-900 mb-4">
                {t("lobAboutTitle")}
              </h2>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                <strong className="font-bold text-gray-800">INFTOUR</strong>{" "}
                {t("lobAboutCardP1").replace(/^INFTOUR\s*/i, "")}{" "}
                {t("lobAboutCardP2")}
              </p>
              <button
                type="button"
                onClick={() => setAboutModalOpen(true)}
                className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-gold border-t border-gray-100 pt-3 transition hover:text-amber-600"
              >
                {t("lobAboutReadFull")}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Two columns: AI card + Contact card */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 md:mb-24">
          {/* AI Assistant card */}
          <div
            id="ai-guide"
            className="bg-white text-brand-black p-8 md:p-10 rounded-2xl border border-gray-200 shadow-[0_14px_38px_-20px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col justify-center min-h-[320px]"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-amber-50/70 to-transparent"
              aria-hidden
            />
            <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-[#f7f2e6] text-brand-gold rounded-full mb-5 border border-[#efe3c8]">
                <IconAI className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-serif mb-9">{t("lobAITitle")}</h3>
              <ul className="w-full max-w-sm text-center text-[15px] text-gray-700 font-light space-y-3.5 mb-8">
                {(["lobAI1", "lobAI2", "lobAI3", "lobAI4"] as const).map(
                  (key) => (
                    <li
                      key={key}
                      className="flex items-start justify-center gap-3"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f7f2e6] text-brand-gold text-xs">
                        •
                      </span>
                      <span>{t(key)}</span>
                    </li>
                  ),
                )}
              </ul>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={openAIChat}
                  className="inline-flex w-[360px] max-w-full items-center justify-center rounded-lg bg-brand-gold px-8 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-amber-500"
                >
                  {t("lobAIStartChat")}
                </button>
              </div>
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
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t("lobAddressLine"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-gold transition"
                >
                  {t("lobAddressLine")}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-brand-gold" aria-hidden>
                  📞
                </span>
                <a
                  href={`tel:${t("lobPhoneLine").replace(/\s+/g, "")}`}
                  className="hover:text-brand-gold transition"
                >
                  {t("lobPhoneLine")}
                </a>
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
        <section className="space-y-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.12)]">
            <h3 className="text-2xl font-serif text-brand-black mb-3 text-center">
              {t("lobInstructionsTitle")}
            </h3>
            <div className="mb-6">
              <InstructionsSubtitle t={t} />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setInstructionsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-lg bg-brand-darkgray px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gray-600"
              >
                {t("lobInstructionsOpenModal")}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-serif text-brand-black mb-6">
              {t("lobPoliciesTitle")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {POLICIES.map(({ titleKey, descKey, href }) =>
                titleKey === "privacyPolicy" ? (
                  <button
                    key={titleKey}
                    type="button"
                    onClick={() => setPrivacyModalOpen(true)}
                    className="group w-full cursor-pointer rounded-lg border border-gray-100 bg-(--color-brand-bg) p-6 text-left transition hover:border-brand-gold hover:bg-white"
                  >
                    <h4 className="mb-2 text-sm font-bold text-brand-black transition group-hover:text-brand-gold">
                      {t(titleKey)}
                    </h4>
                    <p className="text-xs font-light text-gray-500">
                      {t(descKey)}
                    </p>
                  </button>
                ) : titleKey === "cancellationPolicy" ? (
                  <button
                    key={titleKey}
                    type="button"
                    onClick={() => setArrivalStayModalOpen(true)}
                    className="group w-full cursor-pointer rounded-lg border border-gray-100 bg-(--color-brand-bg) p-6 text-left transition hover:border-brand-gold hover:bg-white"
                  >
                    <h4 className="mb-2 text-sm font-bold text-brand-black transition group-hover:text-brand-gold">
                      {t(titleKey)}
                    </h4>
                    <p className="text-xs font-light text-gray-500">
                      {t(descKey)}
                    </p>
                  </button>
                ) : titleKey === "paymentPolicy" ? (
                  <button
                    key={titleKey}
                    type="button"
                    onClick={() => setFaqModalOpen(true)}
                    className="group w-full cursor-pointer rounded-lg border border-gray-100 bg-(--color-brand-bg) p-6 text-left transition hover:border-brand-gold hover:bg-white"
                  >
                    <h4 className="mb-2 text-sm font-bold text-brand-black transition group-hover:text-brand-gold">
                      {t(titleKey)}
                    </h4>
                    <p className="text-xs font-light text-gray-500">
                      {t(descKey)}
                    </p>
                  </button>
                ) : titleKey === "termsPolicy" ? (
                  <button
                    key={titleKey}
                    type="button"
                    onClick={() => setReportingChannelModalOpen(true)}
                    className="group w-full cursor-pointer rounded-lg border border-gray-100 bg-(--color-brand-bg) p-6 text-left transition hover:border-brand-gold hover:bg-white"
                  >
                    <h4 className="mb-2 text-sm font-bold text-brand-black transition group-hover:text-brand-gold">
                      {t(titleKey)}
                    </h4>
                    <p className="text-xs font-light text-gray-500">
                      {t(descKey)}
                    </p>
                  </button>
                ) : (
                  <Link
                    key={titleKey}
                    href={href}
                    className="group block p-6 bg-(--color-brand-bg) border border-gray-100 rounded-lg hover:border-brand-gold hover:bg-white transition"
                  >
                    <h4 className="font-bold text-sm text-brand-black mb-2 group-hover:text-brand-gold transition">
                      {t(titleKey)}
                    </h4>
                    <p className="text-xs text-gray-500 font-light">
                      {t(descKey)}
                    </p>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      </main>
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
      <ArrivalStayModal
        isOpen={arrivalStayModalOpen}
        onClose={() => setArrivalStayModalOpen(false)}
      />
      <FaqModal isOpen={faqModalOpen} onClose={() => setFaqModalOpen(false)} />
      <ReportingChannelModal
        isOpen={reportingChannelModalOpen}
        onClose={() => setReportingChannelModalOpen(false)}
      />
      {aboutModalOpen && (
        <div
          className="fixed inset-0 z-9999 flex items-end justify-center bg-black/55 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] backdrop-blur-sm sm:items-center sm:pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pl-4 sm:pr-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("lobAboutDocMainTitle")}
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            className="relative flex min-h-0 w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1rem)] sm:max-h-[calc(100dvh-max(1rem,env(safe-area-inset-top,0px))-max(1rem,env(safe-area-inset-bottom,0px)))] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                triggerLightTapHaptic();
                setAboutModalOpen(false);
              }}
              className={`absolute right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] z-10 flex h-8 w-8 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-900 ${MODAL_PRESS}`}
              aria-label={t("lobCloseModal")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="scrollbar-modal min-h-0 flex-1 overflow-y-auto py-2 sm:py-4">
              <AboutUsContent isModal />
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 px-3 py-3 sm:px-4">
              <Link
                href="/lobby/about-us"
                onClick={() => {
                  triggerLightTapHaptic();
                }}
                className={`inline-flex items-center justify-center bg-white text-brand-darkgray border border-gray-300 rounded-sm px-5 py-2 font-semibold transition hover:bg-gray-50 ${MODAL_PRESS}`}
              >
                {t("openPage")}
              </Link>
              <button
                type="button"
                onClick={() => {
                  triggerLightTapHaptic();
                  setAboutModalOpen(false);
                }}
                className={`rounded-sm bg-brand-darkgray px-5 py-2 font-semibold text-white transition hover:opacity-90 ${MODAL_PRESS}`}
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
      {instructionsModalOpen && (
        <div
          className="fixed inset-0 z-9999 flex items-end justify-center bg-black/55 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] backdrop-blur-sm sm:items-center sm:pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pl-4 sm:pr-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("lobInstructionsTitle")}
          onClick={() => setInstructionsModalOpen(false)}
        >
          <div
            className="relative flex min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1rem)] sm:max-h-[calc(100dvh-max(1rem,env(safe-area-inset-top,0px))-max(1rem,env(safe-area-inset-bottom,0px)))] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                triggerLightTapHaptic();
                setInstructionsModalOpen(false);
              }}
              className={`absolute right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] z-10 flex h-8 w-8 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-900 ${MODAL_PRESS}`}
              aria-label={t("lobCloseModal")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="scrollbar-modal min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-4">
              <InstructionsContent isModal />
            </div>
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 px-3 py-3 sm:px-4">
              <Link
                href="/lobby/instructions"
                onClick={() => {
                  triggerLightTapHaptic();
                }}
                className={`inline-flex items-center justify-center bg-white text-brand-darkgray border border-gray-300 rounded-sm px-5 py-2 font-semibold transition hover:bg-gray-50 ${MODAL_PRESS}`}
              >
                {t("openPage")}
              </Link>
              <button
                type="button"
                onClick={() => {
                  triggerLightTapHaptic();
                  setInstructionsModalOpen(false);
                }}
                className={`rounded-sm bg-brand-darkgray px-5 py-2 font-semibold text-white transition hover:opacity-90 ${MODAL_PRESS}`}
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
