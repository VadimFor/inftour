"use client";

import { create } from "zustand";
import { experienciasTranslations } from "../experiencias/experiencias_translations";
import { revistaTranslations } from "../revista/translations/revista_translations";
import { servicesTranslations } from "../services/translations/services_translations";
import { referenceNumbersModalTranslations } from "../services/translations/reference_numbers_modal_translations";
import { ourServicesModalTranslations } from "../services/translations/our_services_modal_translations";
import { requestsCommentsModalTranslations } from "../services/translations/requests_comments_modal_translations";
import { lobbyTranslations } from "../lobby/translations/lobby_translations";
import { stayTranslations } from "../lobby/translations/stay_translations";
import { privacyModalTranslations } from "../lobby/translations/privacymodal_translate";
import { reportingChannelModalTranslations } from "../lobby/translations/reporting_channel_modal_translations";
import { faqModalTranslations } from "../lobby/translations/faq_modal_translations";
import { instrWhatIfTranslations } from "../lobby/translations/instr_whatif_merged";
import { menuTranslations } from "./menu_translations";
import { footerTranslations } from "./footer_translations";
import { topBarTranslations } from "../components/TopBar/topbar_translations";
import { LANG_TO_HTML, VALID_LANGS } from "./i18n";
import type { Lang } from "./i18n";

export type { Lang } from "./i18n";

const STORAGE_KEY = "inftour_lang";

/** Map browser language tag (e.g. "en", "es-ES") to our Lang. Uses first match from navigator.languages. */
function getBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "eng";
  const tags = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
  for (const tag of tags) {
    const code = tag.toLowerCase().split("-")[0];
    if (code === "en") return "eng";
    if (code === "es") return "esp";
    if (code === "ru") return "ru";
    if (code === "fr") return "fr";
    if (code === "it") return "it";
    if (code === "de") return "de";
    if (code === "uk") return "uk";
    if (code === "pl") return "pl";
  }
  return "eng";
}

type LangStrings = { eng: string; esp: string; ru: string; fr: string; it: string; de: string; uk: string; pl: string };
type TranslationMap = Record<string, LangStrings>;

const translations: TranslationMap = {
  // Nav & brand
  ...menuTranslations,

  // Footer
  ...footerTranslations,

  // TopBar
  ...topBarTranslations,

  // AI Agent chat
  closeChat: { eng: "Close chat", esp: "Cerrar chat", ru: "Закрыть чат", fr: "Fermer le chat", it: "Chiudi chat", de: "Chat schließen", uk: "Закрити чат", pl: "Zamknij czat" },
  aiAgentWelcome: {
    eng: "Hello, I'm the INFTOUR assistant. How can I help you today? Ask me about bookings, experiences in Calpe or anything else.",
    esp: "Hola, soy el asistente de INFTOUR. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre reservas, experiencias en Calpe o cualquier otro tema.",
    ru: "Здравствуйте, я помощник INFTOUR. Чем могу помочь? Спрашивайте о бронировании, впечатлениях в Кальпе или о чём угодно.",
    fr: "Bonjour, je suis l'assistant INFTOUR. Comment puis-je vous aider ? Posez-moi des questions sur les réservations, les expériences à Calpe ou autre.",
    it: "Ciao, sono l'assistente INFTOUR. Come posso aiutarti? Chiedimi prenotazioni, esperienze a Calpe o altro.",
    de: "Hallo, ich bin der INFTOUR-Assistent. Wie kann ich Ihnen helfen? Fragen Sie nach Buchungen, Erlebnissen in Calpe oder anderem.",
    uk: "Вітаю, я помічник INFTOUR. Чим можу допомогти? Питайте про бронювання, враження в Кальпе або будь-що інше.",
    pl: "Witaj, jestem asystentem INFTOUR. Jak mogę ci pomóc? Pytaj o rezerwacje, atrakcje w Calpe lub cokolwiek innego.",
  },
  aiAgentReply: {
    eng: "Thank you for your message. An agent will reply shortly.",
    esp: "Gracias por tu mensaje. Un agente te responderá en breve.",
    ru: "Спасибо за сообщение. Агент ответит вам в ближайшее время.",
    fr: "Merci pour votre message. Un agent vous répondra sous peu.",
    it: "Grazie per il messaggio. Un agente risponderà a breve.",
    de: "Vielen Dank für Ihre Nachricht. Ein Agent wird sich in Kürze melden.",
    uk: "Дякуємо за повідомлення. Агент відповість найближчим часом.",
    pl: "Dziękujemy za wiadomość. Agent odpowie wkrótce.",
  },
  writeMessage: {
    eng: "Type your message...",
    esp: "Escribe tu mensaje...",
    ru: "Введите сообщение...",
    fr: "Tapez votre message...",
    it: "Scrivi il tuo messaggio...",
    de: "Nachricht eingeben...",
    uk: "Введіть повідомлення...",
    pl: "Wpisz wiadomość...",
  },
  send: { eng: "Send", esp: "Enviar", ru: "Отправить", fr: "Envoyer", it: "Invia", de: "Senden", uk: "Надіслати", pl: "Wyślij" },

  openPage: {
    eng: "Open page",
    esp: "Abrir página",
    ru: "Открыть страницу",
    fr: "Ouvrir la page",
    it: "Apri pagina",
    de: "Seite öffnen",
    uk: "Відкрити сторінку",
    pl: "Otwórz stronę",
  },

  // Home
  loadingCalendar: {
    eng: "Loading calendar...",
    esp: "Cargando calendario...",
    ru: "Загрузка календаря...",
    fr: "Chargement du calendrier...",
    it: "Caricamento calendario...",
    de: "Kalender wird geladen...",
    uk: "Завантаження календаря...",
    pl: "Ładowanie kalendarza...",
  },
  bookingCalendar: { eng: "Booking calendar", esp: "Calendario de reservas", ru: "Календарь бронирования", fr: "Calendrier des réservations", it: "Calendario prenotazioni", de: "Buchungskalender", uk: "Календар бронювань", pl: "Kalendarz rezerwacji" },

  // Pages – Experiencias (Ecosystem)
  ...experienciasTranslations,

  // Revista (Magazine)
  ...revistaTranslations,

  // Services
  ...servicesTranslations,

  // Services – modals (RecipesModal-style shells)
  ...referenceNumbersModalTranslations,
  ...ourServicesModalTranslations,
  ...requestsCommentsModalTranslations,

  // Lobby
  ...lobbyTranslations,

  // Lobby – Llegada y estancia (Lobby Llegada y estancia.docx)
  ...stayTranslations,

  // Lobby – "What to do if" (full text from Lobby Instrucciones docx; overrides lobInstr* in lobbyTranslations)
  ...instrWhatIfTranslations,

  // Lobby – Privacy Policy modal (full text from Lobby Políticas de privacidad.docx)
  ...privacyModalTranslations,

  // Lobby – Reporting channel modal
  ...reportingChannelModalTranslations,

  // Lobby – FAQ modal
  ...faqModalTranslations,
};

type LangStore = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof translations, params?: Record<string, string | number>) => string;
};

function persistLang(lang: Lang) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    console.warn("Failed to persist language:", e);
  }
}

export const useLangStore = create<LangStore>((set, get) => ({
  lang: "eng",

  setLang: (lang) => {
    set({ lang });
    persistLang(lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = LANG_TO_HTML[lang];
    }
  },

  t: (key: string, params?: Record<string, string | number>) => {
    const { lang } = get();
    const entry = translations[key as keyof typeof translations];
    if (!entry) return key;
    let text = (entry as LangStrings)[lang] ?? entry.eng;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  },
}));

export function restoreLastLanguage(): Lang {
  if (typeof window === "undefined") return "eng";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_LANGS.includes(saved as Lang)) {
      const lang = saved as Lang;
      useLangStore.setState({ lang });
      if (typeof document !== "undefined") {
        document.documentElement.lang = LANG_TO_HTML[lang];
      }
      return lang;
    }
    // No saved preference: use browser language and persist it
    const detected = getBrowserLang();
    useLangStore.setState({ lang: detected });
    if (typeof document !== "undefined") {
      document.documentElement.lang = LANG_TO_HTML[detected];
    }
    persistLang(detected);
    return detected;
  } catch (e) {
    console.warn("Failed to restore language:", e);
  }
  return "eng";
}
