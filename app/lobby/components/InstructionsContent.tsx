"use client";

import { useState, type ReactNode } from "react";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../../experiencias/components/modalStyles";

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

function linkifyInstructionLine(text: string): ReactNode[] {
  return text
    .split(URL_IN_INSTR_RE)
    .filter(Boolean)
    .map((part, i) =>
      URL_IN_INSTR_RE.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words text-brand-gold underline decoration-brand-gold/30 underline-offset-2 hover:text-amber-700"
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
}

type ClassifiedBullet =
  | { kind: "step"; head: string; body?: string }
  | { kind: "important"; body: string };

function classifyInstructionBullet(raw: string): ClassifiedBullet {
  const clean = raw.replace(/^(â€¢|👉)\s*/, "").trim();
  if (/^(important|importante|важно|wichtig|ważne|важливо)\b/i.test(clean)) {
    return { kind: "important", body: clean };
  }
  const match = clean.match(/^([^:]+):\s*(.+)$/);
  if (match) {
    return { kind: "step", head: match[1].trim(), body: match[2].trim() };
  }
  return { kind: "step", head: clean };
}

function InstructionStepper({
  items,
}: {
  items: Exclude<ClassifiedBullet, { kind: "important" }>[];
}) {
  return (
    <ol className="mb-4 space-y-3">
      {items.map((item, index) => (
        <li key={`${item.head}-${index}`} className="flex items-start gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-xs font-bold text-brand-gold">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-relaxed text-brand-black">
              {linkifyInstructionLine(item.head)}
            </p>
            {item.body ? (
              <p className="mt-1 text-sm font-light leading-relaxed text-gray-600">
                {linkifyInstructionLine(item.body)}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
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
        {hasLabel ? (
          <span className="mr-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-brand-gold">
            {label}
          </span>
        ) : null}
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
    if (trimmed.startsWith("â€¢") || trimmed.startsWith("👉")) {
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

type InstructionsContentProps = {
  isModal?: boolean;
};

export default function InstructionsContent({
  isModal = false,
}: InstructionsContentProps) {
  const t = useLangStore((s) => s.t);
  const [openInstr, setOpenInstr] = useState<string | null>(null);

  return (
    <div className={isModal ? "w-full min-h-0" : "container mx-auto px-4 py-12"}>
      <div
        className={
          isModal
            ? "bg-brand-bg border-b border-gray-200 -mx-6 px-6 pt-6 pb-6 mb-6 md:-mx-8 md:px-8 md:pr-14"
            : "bg-brand-bg border border-gray-100 rounded-sm px-8 pt-6 pb-6 mb-6"
        }
      >
        <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
        <h1
          id="lobby-instructions-title"
          className={isModal ? "text-2xl md:text-3xl font-serif text-brand-black text-center" : "text-3xl md:text-4xl font-serif text-brand-black text-center"}
        >
          {t("lobInstructionsTitle")}
        </h1>
      </div>
      <div className="mb-6">
        <InstructionsSubtitle t={t} />
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
              {isOpen ? (
                <div className="scrollbar-modal max-h-[min(70vh,26rem)] overflow-y-auto border-t border-gray-50 px-4 pb-4 pt-3">
                  {renderInstructionAnswer(t(a))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
