"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { useLangStore } from "@/app/lib/langStore";
import type { Lang } from "@/app/lib/langStore";

const EL_AGENT_ID = "agent_7901kn00tj76ef0b6t7e7ebv8s22";
const MOBILE_WIDGET_BREAKPOINT = 640;

/** Reserva Directa booking iframe modal uses `z-[2000]`; keep widget stack strictly below it. */
const MOBILE_WIDGET_BACKDROP_Z = 1970;
const MOBILE_WIDGET_PANEL_Z = 1980;
const MOBILE_WIDGET_CLOSE_Z = 1990;

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
    closeAssistantAriaLabel: string;
    /** Shown as the agent's first chat line when overrides are enabled for this field in ElevenLabs. */
    firstMessage: string;
  }
> = {
  eng: {
    actionText: "Need help?",
    startCallText: "Start a call",
    endCallText: "End call",
    listeningText: "Listening...",
    speakingText: "Assistant speaking",
    bookingLinksAriaLabel: "Booking links",
    closeAssistantAriaLabel: "Close assistant",
    firstMessage:
      "Call this number or talk to me here if you need any information.",
  },
  esp: {
    actionText: "Necesitas ayuda?",
    startCallText: "Iniciar llamada",
    endCallText: "Finalizar llamada",
    listeningText: "Escuchando...",
    speakingText: "Asistente hablando",
    bookingLinksAriaLabel: "Enlaces de reserva",
    closeAssistantAriaLabel: "Cerrar asistente",
    firstMessage:
      "Llama a este número o escríbeme aquí si necesitas cualquier información.",
  },
  ru: {
    actionText: "Нужна помощь?",
    startCallText: "Начать звонок",
    endCallText: "Завершить звонок",
    listeningText: "Слушаю...",
    speakingText: "Ассистент говорит",
    bookingLinksAriaLabel: "Ссылки для бронирования",
    closeAssistantAriaLabel: "Закрыть помощника",
    firstMessage:
      "Позвоните по этому номеру или напишите мне здесь, если нужна информация.",
  },
  fr: {
    actionText: "Besoin d'aide ?",
    startCallText: "Demarrer l'appel",
    endCallText: "Terminer l'appel",
    listeningText: "Ecoute...",
    speakingText: "Assistant en train de parler",
    bookingLinksAriaLabel: "Liens de reservation",
    closeAssistantAriaLabel: "Fermer l'assistant",
    firstMessage:
      "Appelez ce numéro ou parlez-moi ici pour toute information.",
  },
  it: {
    actionText: "Hai bisogno di aiuto?",
    startCallText: "Avvia chiamata",
    endCallText: "Termina chiamata",
    listeningText: "In ascolto...",
    speakingText: "Assistente in conversazione",
    bookingLinksAriaLabel: "Link di prenotazione",
    closeAssistantAriaLabel: "Chiudi assistente",
    firstMessage:
      "Chiama questo numero o scrivimi qui se ti servono informazioni.",
  },
  de: {
    actionText: "Brauchst du Hilfe?",
    startCallText: "Anruf starten",
    endCallText: "Anruf beenden",
    listeningText: "Ich hore zu...",
    speakingText: "Assistent spricht",
    bookingLinksAriaLabel: "Buchungslinks",
    closeAssistantAriaLabel: "Assistenten schließen",
    firstMessage:
      "Rufen Sie diese Nummer an oder schreiben Sie mir hier, wenn Sie Informationen brauchen.",
  },
  uk: {
    actionText: "Потрібна допомога?",
    startCallText: "Почати дзвінок",
    endCallText: "Завершити дзвінок",
    listeningText: "Слухаю...",
    speakingText: "Асистент говорить",
    bookingLinksAriaLabel: "Посилання для бронювання",
    closeAssistantAriaLabel: "Закрити асистента",
    firstMessage:
      "Зателефонуйте за цим номером або напишіть мені тут, якщо потрібна інформація.",
  },
  pl: {
    actionText: "Potrzebujesz pomocy?",
    startCallText: "Rozpocznij rozmowe",
    endCallText: "Zakoncz rozmowe",
    listeningText: "Slucham...",
    speakingText: "Asystent mowi",
    bookingLinksAriaLabel: "Linki rezerwacyjne",
    closeAssistantAriaLabel: "Zamknij asystenta",
    firstMessage:
      "Zadzwon pod ten numer lub napisz do mnie tutaj, jesli potrzebujesz informacji.",
  },
};

const mobileWidgetTextTranslations: Record<
  Lang,
  Pick<(typeof widgetTextTranslations)[Lang], "actionText" | "startCallText">
> = {
  eng: {
    actionText: "Help?",
    startCallText: "Call",
  },
  esp: {
    actionText: "Ayuda?",
    startCallText: "Llamar",
  },
  ru: {
    actionText: "Помочь?",
    startCallText: "Звонок",
  },
  fr: {
    actionText: "Aide ?",
    startCallText: "Appel",
  },
  it: {
    actionText: "Aiuto?",
    startCallText: "Chiama",
  },
  de: {
    actionText: "Hilfe?",
    startCallText: "Anrufen",
  },
  uk: {
    actionText: "Допомога?",
    startCallText: "Дзвінок",
  },
  pl: {
    actionText: "Pomoc?",
    startCallText: "Zadzwon",
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

type ConvaiWidgetElement = HTMLElement & {
  open?: () => void;
  toggle?: () => void;
  shadowRoot?: ShadowRoot | null;
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
  const ref = useRef<ConvaiWidgetElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobilePanelVisible, setIsMobilePanelVisible] = useState(false);
  const [mobileWidgetVersion, setMobileWidgetVersion] = useState(0);
  const baseWidgetText = widgetTextTranslations[lang];
  const mobileWidgetText = mobileWidgetTextTranslations[lang];
  const widgetText = isMobile
    ? {
        ...baseWidgetText,
        ...mobileWidgetText,
      }
    : baseWidgetText;
  const languageCode = WIDGET_LANG_TO_CODE[lang] ?? "es";
  const widgetKey = `${lang}-${isMobile ? `mobile-${isMobilePanelVisible ? "panel" : "hidden"}-${mobileWidgetVersion}` : "desktop"}`;

  const closeMobilePanel = useCallback(() => {
    setIsMobilePanelVisible(false);
    setMobileWidgetVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_WIDGET_BREAKPOINT}px)`,
    );
    const syncMobileState = (event?: MediaQueryListEvent) => {
      const nextIsMobile = event ? event.matches : mediaQuery.matches;
      setIsMobile(nextIsMobile);
      if (!nextIsMobile) {
        setIsMobilePanelVisible(false);
      }
    };

    syncMobileState();
    mediaQuery.addEventListener("change", syncMobileState);

    return () => {
      mediaQuery.removeEventListener("change", syncMobileState);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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

    el.setAttribute("placement", isMobile ? "bottom" : "bottom-right");
    el.setAttribute("agent-id", EL_AGENT_ID);
    el.setAttribute("dynamic-variables", JSON.stringify(dynamicVariables));

    const handleCall = (event: Event) => {
      const callEvent = event as ConvaiCallEvent;
      const config = ((callEvent.detail ??= {}).config ??= {});

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
  }, [lang, isMobile]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.setAttribute("override-language", languageCode);
    el.setAttribute("action-text", widgetText.actionText);
    el.setAttribute("start-call-text", widgetText.startCallText);
    el.setAttribute("end-call-text", widgetText.endCallText);
    el.setAttribute("listening-text", widgetText.listeningText);
    el.setAttribute("speaking-text", widgetText.speakingText);
    el.setAttribute("override-first-message", widgetText.firstMessage);

    const linksContainer = document.getElementById("el-booking-links");
    if (linksContainer) {
      linksContainer.setAttribute(
        "aria-label",
        widgetText.bookingLinksAriaLabel,
      );
    }
  }, [languageCode, widgetText]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!isMobile) {
      el.style.display = "";
      el.style.zIndex = "";
      return;
    }

    el.style.display = isMobilePanelVisible ? "" : "none";
    el.style.zIndex = isMobilePanelVisible
      ? String(MOBILE_WIDGET_PANEL_Z)
      : "";
  }, [isMobile, isMobilePanelVisible, widgetKey]);

  useEffect(() => {
    if (!isMobile || !isMobilePanelVisible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeMobilePanel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobile, isMobilePanelVisible, closeMobilePanel]);

  useEffect(() => {
    const el = ref.current as
      | (ConvaiWidgetElement & {
          __inftourPatched?: boolean;
          __inftourOriginalOpen?: (() => void) | undefined;
          __inftourOriginalToggle?: (() => void) | undefined;
        })
      | null;
    if (!el || el.__inftourPatched) return;

    el.__inftourOriginalOpen =
      typeof el.open === "function" ? el.open.bind(el) : undefined;
    el.__inftourOriginalToggle =
      typeof el.toggle === "function" ? el.toggle.bind(el) : undefined;

    el.open = () => {
      const shouldIntercept = window.innerWidth <= MOBILE_WIDGET_BREAKPOINT;
      if (!shouldIntercept) {
        el.__inftourOriginalOpen?.();
        return;
      }

      setIsMobilePanelVisible(true);
      window.setTimeout(() => {
        el.__inftourOriginalOpen?.();
      }, 40);
    };

    el.toggle = () => {
      const shouldIntercept = window.innerWidth <= MOBILE_WIDGET_BREAKPOINT;
      if (!shouldIntercept) {
        el.__inftourOriginalToggle?.();
        return;
      }

      setIsMobilePanelVisible(true);
      window.setTimeout(() => {
        el.__inftourOriginalToggle?.();
      }, 40);
    };

    el.__inftourPatched = true;
  }, [widgetKey]);

  const openWidgetFromLauncher = () => {
    triggerLightTapHaptic();
    setIsMobilePanelVisible(true);

    window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;

      if (typeof el.open === "function") {
        el.open();
        return;
      }

      if (typeof el.toggle === "function") {
        el.toggle();
      }
    }, 40);
  };

  return (
    <>
      <div
        id="el-booking-links"
        aria-live="polite"
        aria-label={widgetText.bookingLinksAriaLabel}
      />
      {isMobile && !isMobilePanelVisible && (
        <button
          type="button"
          onClick={openWidgetFromLauncher}
          className="fixed bottom-[calc(10px+env(safe-area-inset-bottom,0px))] left-1/2 flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col rounded-[22px] bg-white px-3 py-2 text-left shadow-[0_10px_32px_rgba(0,0,0,0.16)]"
          style={{ zIndex: MOBILE_WIDGET_PANEL_Z }}
          aria-label={mobileWidgetText.startCallText}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src="/avatar.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
              aria-hidden
            />
            <span className="text-[13px] font-medium text-[#232323]">
              {mobileWidgetText.actionText}
            </span>
          </div>
          <div className="mt-2 flex w-full min-w-0 items-center justify-center gap-1.5 rounded-full bg-black px-3 py-2 text-[13px] font-semibold text-white">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>{mobileWidgetText.startCallText}</span>
          </div>
        </button>
      )}
      {isMobile && isMobilePanelVisible && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={widgetText.closeAssistantAriaLabel}
          className="fixed inset-0 cursor-default border-0 bg-black/35 p-0"
          style={{ zIndex: MOBILE_WIDGET_BACKDROP_Z }}
          onClick={() => {
            triggerLightTapHaptic();
            closeMobilePanel();
          }}
        />
      )}
      <elevenlabs-convai
        key={widgetKey}
        ref={(node) => {
          ref.current = node as ConvaiWidgetElement | null;
        }}
        agent-id={EL_AGENT_ID}
        placement={isMobile ? "bottom" : "bottom-right"}
        variant={isMobile && isMobilePanelVisible ? "expanded" : undefined}
        dismissible={isMobile && isMobilePanelVisible ? "false" : undefined}
        always-expanded={isMobile && isMobilePanelVisible ? "true" : undefined}
        override-language={languageCode}
        action-text={widgetText.actionText}
        start-call-text={widgetText.startCallText}
        end-call-text={widgetText.endCallText}
        listening-text={widgetText.listeningText}
        speaking-text={widgetText.speakingText}
        override-first-message={widgetText.firstMessage}
      />
      {isMobile && isMobilePanelVisible && (
        <button
          type="button"
          onClick={() => {
            triggerLightTapHaptic();
            closeMobilePanel();
          }}
          className="fixed bottom-[calc(12px+env(safe-area-inset-bottom,0px))] left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-red-200/90 bg-red-100 text-red-700 shadow-lg transition hover:border-red-300 hover:bg-red-200/90 hover:text-red-900"
          style={{ zIndex: MOBILE_WIDGET_CLOSE_Z }}
          aria-label={widgetText.closeAssistantAriaLabel}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </>
  );
}
