"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../../lib/langStore";
import lobbyAboutImage from "../pictures/lobby.png";
import ArrivalStayModal from "./ArrivalStayModal";
import FaqModal from "./FaqModal";
import PrivacyModal from "./PrivacyModal";
import ReportingChannelModal from "./ReportingChannelModal";

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

const ABOUT_DOC_PARAGRAPHS = [
  "lobAboutDocP1",
  "lobAboutDocP2",
  "lobAboutDocP3",
  "lobAboutDocP4",
  "lobAboutDocP5",
  "lobAboutDocP6",
] as const;

const ABOUT_DOC_AREAS = [
  "lobAboutDocArea1",
  "lobAboutDocArea2",
  "lobAboutDocArea3",
  "lobAboutDocArea4",
] as const;

// Icons in same order as ABOUT_DOC_AREAS: holiday rentals, property mgmt, sales, construction
const AREA_ICONS = [
  <svg
    key="home"
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>,
  <svg
    key="building"
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
    />
  </svg>,
  <svg
    key="exchange"
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
    />
  </svg>,
  <svg
    key="wrench"
    className="size-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.585l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
    />
  </svg>,
];

function renderBoldFragments(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-brand-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

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
  const [openInstr, setOpenInstr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const shouldLockScroll =
      privacyModalOpen ||
      arrivalStayModalOpen ||
      faqModalOpen ||
      reportingChannelModalOpen ||
      aboutModalOpen ||
      instructionsModalOpen;
    if (!shouldLockScroll) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [
    privacyModalOpen,
    arrivalStayModalOpen,
    faqModalOpen,
    reportingChannelModalOpen,
    aboutModalOpen,
    instructionsModalOpen,
  ]);

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
          <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex flex-col md:flex-row md:min-h-[560px] lg:min-h-[620px]">
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
            <div className="md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center md:min-h-[560px] lg:min-h-[620px]">
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
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("lobAboutDocMainTitle")}
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAboutModalOpen(false)}
              className="absolute top-6 right-6 left-auto z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-sm transition"
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
            <div className="overflow-y-auto flex-1">
              <div className="p-8 md:p-12 lg:p-14 bg-linear-to-br from-white via-brand-bg to-amber-50/30">
                <span className="text-brand-gold font-bold uppercase tracking-[0.22em] text-[11px] mb-3 block">
                  {t("lobAboutTitle")}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-brand-black mb-8 leading-tight">
                  {t("lobAboutDocMainTitle")}
                </h2>
                <div className="overflow-hidden text-[15px] md:text-base text-gray-600 font-light leading-relaxed">
                  <figure className="mb-6 rounded-xl overflow-hidden border border-gray-100/90 shadow-md bg-white">
                    <Image
                      src={lobbyAboutImage}
                      alt={t("lobAboutDocMainTitle")}
                      className="w-full h-auto object-contain object-center"
                      sizes="100vw"
                      priority
                      unoptimized
                    />
                  </figure>
                  {ABOUT_DOC_PARAGRAPHS.map((key) => (
                    <p key={key} className="mb-5 last:mb-0">
                      {renderBoldFragments(t(key))}
                    </p>
                  ))}
                </div>
              </div>
              <div className="border-t border-brand-gold/20 bg-linear-to-br from-brand-bg/90 via-white to-amber-50/20 p-8 md:p-10 relative overflow-hidden">
                <div
                  className="absolute -right-16 -top-16 size-48 rounded-full bg-brand-gold/5 pointer-events-none"
                  aria-hidden
                />
                <div
                  className="absolute -left-8 bottom-0 size-32 rounded-full bg-amber-100/40 pointer-events-none"
                  aria-hidden
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-brand-gold/20">
                    <span
                      className="h-7 w-1 rounded-full bg-brand-gold shrink-0"
                      aria-hidden
                    />
                    <h3 className="text-xl md:text-2xl font-serif text-brand-black">
                      {t("lobAboutDocSummaryTitle")}
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    <div className="flex gap-4 items-center bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold"
                        aria-hidden
                      >
                        <svg
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
                          />
                        </svg>
                      </span>
                      <p className="text-[15px] text-gray-700 leading-snug">
                        {renderBoldFragments(t("lobAboutDocSummaryFounded"))}
                      </p>
                    </div>
                    <div className="flex gap-4 items-center bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold"
                        aria-hidden
                      >
                        <svg
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                      </span>
                      <p className="text-[15px] text-gray-700 leading-snug">
                        {renderBoldFragments(t("lobAboutDocSummaryLocation"))}
                      </p>
                    </div>
                  </div>
                  <div className="mb-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4">
                      <span
                        className="h-5 w-1 shrink-0 rounded-full bg-brand-gold"
                        aria-hidden
                      />
                      <h4 className="font-serif text-lg text-brand-black">
                        {t("lobAboutDocAreasTitle")}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-px bg-gray-100">
                      {ABOUT_DOC_AREAS.map((key, i) => (
                        <div
                          key={key}
                          className="flex items-center gap-3 bg-white px-5 py-4"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                            {AREA_ICONS[i]}
                          </span>
                          <span className="text-sm font-medium text-gray-700 leading-snug">
                            {t(key)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[15px] md:text-base text-gray-600 font-light leading-relaxed border-t border-gray-100 pt-6">
                    {renderBoldFragments(t("lobAboutDocClosing"))}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-2 flex justify-end">
              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="bg-brand-darkgray text-white rounded-sm px-5 py-2 font-semibold hover:opacity-90 transition"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
      {instructionsModalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("lobInstructionsTitle")}
          onClick={() => setInstructionsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInstructionsModalOpen(false)}
              className="absolute top-6 right-6 left-auto z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-sm transition"
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
            <div className="overflow-y-auto flex-1 px-6 py-6 md:px-8">
              <div className="bg-brand-bg border-b border-gray-200 -mx-6 px-6 pt-6 pb-6 mb-6 md:-mx-8 md:px-8 md:pr-14">
                <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
                <h3 className="text-2xl md:text-3xl font-serif text-brand-black text-center">
                  {t("lobInstructionsTitle")}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-3 items-start">
                {INSTRUCTION_ITEMS.map(({ q, a }) => {
                  const isOpen = openInstr === q;
                  return (
                    <div
                      key={q}
                      className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenInstr(isOpen ? null : q)}
                        className="flex w-full items-center justify-between p-4 cursor-pointer text-sm font-bold text-brand-black hover:text-brand-gold transition text-left"
                        aria-expanded={isOpen}
                      >
                        {t(q)}
                        <span
                          className={`text-gray-400 transition-transform duration-300 text-xl leading-none shrink-0 ml-2 ${isOpen ? "rotate-45" : ""}`}
                        >
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div className="scrollbar-modal max-h-[min(70vh,26rem)] overflow-y-auto border-t border-gray-50 px-4 pb-4 pt-3">
                          {renderInstructionAnswer(t(a))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInstructionsModalOpen(false)}
                className="bg-brand-darkgray text-white rounded-sm px-5 py-2 font-semibold hover:opacity-90 transition"
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
