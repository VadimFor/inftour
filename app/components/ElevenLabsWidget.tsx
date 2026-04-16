"use client";

import { useEffect, useRef } from "react";
import { useLangStore } from "@/app/lib/langStore";
import type { Lang } from "@/app/lib/langStore";

const EL_AGENT_ID = "agent_7901kn00tj76ef0b6t7e7ebv8s22";

const WIDGET_LANG_TO_CODE: Record<Lang, string> = {
  eng: "en",
  esp: "es",
  ru: "ru",
  fr: "fr",
  it: "it",
  de: "de",
  uk: "uk",
  pl: "pl",
};

const widgetTextTranslations: Record<
  Lang,
  {
    actionText: string;
    startCallText: string;
    endCallText: string;
    listeningText: string;
    speakingText: string;
    bookingLinksAriaLabel: string;
  }
> = {
  eng: {
    actionText: "Need help?",
    startCallText: "Start a call",
    endCallText: "End call",
    listeningText: "Listening...",
    speakingText: "Assistant speaking",
    bookingLinksAriaLabel: "Booking links",
  },
  esp: {
    actionText: "Necesitas ayuda?",
    startCallText: "Iniciar llamada",
    endCallText: "Finalizar llamada",
    listeningText: "Escuchando...",
    speakingText: "Asistente hablando",
    bookingLinksAriaLabel: "Enlaces de reserva",
  },
  ru: {
    actionText: "Нужна помощь?",
    startCallText: "Начать звонок",
    endCallText: "Завершить звонок",
    listeningText: "Слушаю...",
    speakingText: "Ассистент говорит",
    bookingLinksAriaLabel: "Ссылки для бронирования",
  },
  fr: {
    actionText: "Besoin d'aide ?",
    startCallText: "Demarrer l'appel",
    endCallText: "Terminer l'appel",
    listeningText: "Ecoute...",
    speakingText: "Assistant en train de parler",
    bookingLinksAriaLabel: "Liens de reservation",
  },
  it: {
    actionText: "Hai bisogno di aiuto?",
    startCallText: "Avvia chiamata",
    endCallText: "Termina chiamata",
    listeningText: "In ascolto...",
    speakingText: "Assistente in conversazione",
    bookingLinksAriaLabel: "Link di prenotazione",
  },
  de: {
    actionText: "Brauchst du Hilfe?",
    startCallText: "Anruf starten",
    endCallText: "Anruf beenden",
    listeningText: "Ich hore zu...",
    speakingText: "Assistent spricht",
    bookingLinksAriaLabel: "Buchungslinks",
  },
  uk: {
    actionText: "Потрібна допомога?",
    startCallText: "Почати дзвінок",
    endCallText: "Завершити дзвінок",
    listeningText: "Слухаю...",
    speakingText: "Асистент говорить",
    bookingLinksAriaLabel: "Посилання для бронювання",
  },
  pl: {
    actionText: "Potrzebujesz pomocy?",
    startCallText: "Rozpocznij rozmowe",
    endCallText: "Zakoncz rozmowe",
    listeningText: "Slucham...",
    speakingText: "Asystent mowi",
    bookingLinksAriaLabel: "Linki rezerwacyjne",
  },
};

type BookingLink = {
  name?: string;
  price?: unknown;
  url?: string;
};

type ConvaiCallEvent = Event & {
  detail?: {
    config?: {
      clientTools?: Record<string, (...args: unknown[]) => unknown>;
    };
  };
};

function safeParseLinks(input: unknown): BookingLink[] {
  try {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return JSON.parse(input) as BookingLink[];
    return [];
  } catch {
    return [];
  }
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function formatBookingPrice(price: unknown): string {
  if (price === null || price === undefined || price === "") return "";

  const num = Number.parseFloat(String(price).replace(",", "."));
  if (Number.isNaN(num)) return `${String(price)} \u20ac`;

  return `${num.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} \u20ac`;
}

function removeBookingCard(card: HTMLElement) {
  card.style.opacity = "0";
  window.setTimeout(() => card.remove(), 250);
}

function renderBookingCards(linksParam: unknown): string {
  const container = document.getElementById("el-booking-links");
  if (!container) return "error:no-container";

  container.innerHTML = "";
  let links = safeParseLinks(linksParam);

  const seen = new Set<string>();
  links = links
    .filter((item) => {
      if (!item?.url || !isValidHttpUrl(item.url)) return false;
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .slice(0, 5);

  if (!links.length) return "empty";

  links.forEach((item, idx) => {
    if (!item.url) return;

    const card = document.createElement("a");
    card.className = "el-bk-card";
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.style.animationDelay = `${idx * 80}ms`;

    const closeBtn = document.createElement("button");
    closeBtn.className = "el-bk-close";
    closeBtn.type = "button";
    closeBtn.title = "Cerrar";
    closeBtn.textContent = "\u2715";
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeBookingCard(card);
    });

    const name = document.createElement("div");
    name.className = "el-bk-name";
    name.textContent = item.name || "Apartamento";

    const row = document.createElement("div");
    row.className = "el-bk-row";

    const price = document.createElement("span");
    price.className = "el-bk-price";
    price.textContent = formatBookingPrice(item.price);

    const btn = document.createElement("span");
    btn.className = "el-bk-btn";
    btn.textContent = "Reservar \u2192";

    row.appendChild(price);
    row.appendChild(btn);
    card.appendChild(closeBtn);
    card.appendChild(name);
    card.appendChild(row);

    window.setTimeout(() => {
      if (card.parentNode) removeBookingCard(card);
    }, 180000);

    container.appendChild(card);
  });

  return "ok";
}

function getFirstArgObject(args: unknown[]): Record<string, unknown> {
  const first = args[0];
  if (!first || typeof first !== "object") return {};
  return first as Record<string, unknown>;
}

export default function ElevenLabsWidget() {
  const lang = useLangStore((s) => s.lang);
  const ref = useRef<HTMLElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted.current) return;
    mounted.current = true;

    let clientId: string;

    try {
      clientId = localStorage.getItem("inftour_client_id") || "";
      if (!clientId) {
        clientId = `web_${crypto.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`}`;
        localStorage.setItem("inftour_client_id", clientId);
      }
    } catch {
      clientId = `web_session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }

    const dynamicVariables = {
      client_id: clientId,
      channel: "web",
      phone: "",
      page_url: window.location.href,
      user_agent: navigator.userAgent.slice(0, 300),
      language: document.documentElement.lang || "es",
    };

    el.setAttribute("placement", "bottom-right");
    el.setAttribute("agent-id", EL_AGENT_ID);
    el.setAttribute("dynamic-variables", JSON.stringify(dynamicVariables));

    const handleCall = (event: Event) => {
      const callEvent = event as ConvaiCallEvent;
      const config = (callEvent.detail ??= {}).config ??= {};

      config.clientTools = {
        ...(config.clientTools ?? {}),
        renderBookingCards: (...args: unknown[]) => {
          const { links } = getFirstArgObject(args);
          return renderBookingCards(links);
        },
        redirectToExternalURL: (...args: unknown[]) => {
          const { url } = getFirstArgObject(args);
          if (typeof url !== "string" || !isValidHttpUrl(url)) {
            return "error:invalid-url";
          }
          window.open(url, "_blank", "noopener,noreferrer");
          return "ok";
        },
      };
    };

    el.addEventListener("elevenlabs-convai:call", handleCall as EventListener);

    return () => {
      el.removeEventListener(
        "elevenlabs-convai:call",
        handleCall as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const widgetText = widgetTextTranslations[lang];
    const languageCode = WIDGET_LANG_TO_CODE[lang] ?? "es";

    el.setAttribute("override-language", languageCode);
    el.setAttribute("action-text", widgetText.actionText);
    el.setAttribute("start-call-text", widgetText.startCallText);
    el.setAttribute("end-call-text", widgetText.endCallText);
    el.setAttribute("listening-text", widgetText.listeningText);
    el.setAttribute("speaking-text", widgetText.speakingText);

    const linksContainer = document.getElementById("el-booking-links");
    if (linksContainer) {
      linksContainer.setAttribute("aria-label", widgetText.bookingLinksAriaLabel);
    }
  }, [lang]);

  return (
    <>
      <div id="el-booking-links" aria-live="polite" aria-label={widgetTextTranslations[lang].bookingLinksAriaLabel} />
      <elevenlabs-convai
        ref={(node) => {
          ref.current = node as HTMLElement | null;
        }}
        agent-id={EL_AGENT_ID}
        placement="bottom-right"
      />
    </>
  );
}
