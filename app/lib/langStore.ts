"use client";

import { create } from "zustand";

export type Lang = "eng" | "esp" | "ru";

const STORAGE_KEY = "inftour_lang";

type TranslationMap = Record<string, { eng: string; esp: string; ru: string }>;

const translations: TranslationMap = {
  // Nav & brand
  calpeCollection: {
    eng: "Calpe Collection",
    esp: "Calpe Collection",
    ru: "Коллекция Кальпе",
  },
  reservaDirecta: { eng: "Direct booking", esp: "Reserva directa", ru: "Прямое бронирование" },
  experiencias: { eng: "Experiences", esp: "Experiencias", ru: "Впечатления" },
  services: { eng: "Services", esp: "Servicios", ru: "Услуги" },
  revista: { eng: "Magazine", esp: "Revista", ru: "Журнал" },
  lobby: { eng: "Lobby", esp: "Lobby", ru: "Лобби" },
  aiAgent: { eng: "AI Agent", esp: "Agente IA", ru: "ИИ-агент" },
  openAIChat: { eng: "Open AI Agent chat", esp: "Abrir chat del agente IA", ru: "Открыть чат ИИ-агента" },

  // Footer
  footerTagline: {
    eng: "Exclusive apartment rentals in Calpe.",
    esp: "Alquiler exclusivo de apartamentos en Calpe.",
    ru: "Эксклюзивная аренда апартаментов в Кальпе.",
  },
  footerLicense: {
    eng: "Tour operator license: EGVT-XXX-A.",
    esp: "Licencia de agencia: EGVT-XXX-A.",
    ru: "Лицензия туристического оператора: EGVT-XXX-A.",
  },
  navigation: { eng: "Navigation", esp: "Navegación", ru: "Навигация" },
  contact: { eng: "Contact", esp: "Contacto", ru: "Связь" },
  allRightsReserved: {
    eng: "© 2026 INFTOUR. All rights reserved.",
    esp: "© 2026 INFTOUR. Todos los derechos reservados.",
    ru: "© 2026 INFTOUR. Все права защищены.",
  },
  privacyPolicy: { eng: "Privacy Policy", esp: "Política de privacidad", ru: "Политика конфиденциальности" },
  termsOfService: { eng: "Terms of Service", esp: "Términos de uso", ru: "Условия использования" },

  // TopBar
  sea: { eng: "Sea", esp: "Mar", ru: "Море" },
  seaTempTitle: { eng: "Sea temperature in Calpe", esp: "Temperatura del mar en Calpe", ru: "Температура моря в Кальпе" },
  calpeLiveWebcam: { eng: "Calpe Live Webcam", esp: "Webcam en vivo Calpe", ru: "Веб-камера Кальпе" },
  openInNewTab: { eng: "Open in new tab", esp: "Abrir en nueva pestaña", ru: "Открыть в новой вкладке" },
  close: { eng: "Close", esp: "Cerrar", ru: "Закрыть" },

  // Nav mobile menu
  openMenu: { eng: "Open menu", esp: "Abrir menú", ru: "Открыть меню" },
  closeMenu: { eng: "Close menu", esp: "Cerrar menú", ru: "Закрыть меню" },

  // AI Agent chat
  closeChat: { eng: "Close chat", esp: "Cerrar chat", ru: "Закрыть чат" },
  aiAgentWelcome: {
    eng: "Hello, I'm the INFTOUR assistant. How can I help you today? Ask me about bookings, experiences in Calpe or anything else.",
    esp: "Hola, soy el asistente de INFTOUR. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre reservas, experiencias en Calpe o cualquier otro tema.",
    ru: "Здравствуйте, я помощник INFTOUR. Чем могу помочь? Спрашивайте о бронировании, впечатлениях в Кальпе или о чём угодно.",
  },
  aiAgentReply: {
    eng: "Thank you for your message. An agent will reply shortly.",
    esp: "Gracias por tu mensaje. Un agente te responderá en breve.",
    ru: "Спасибо за сообщение. Агент ответит вам в ближайшее время.",
  },
  writeMessage: {
    eng: "Type your message...",
    esp: "Escribe tu mensaje...",
    ru: "Введите сообщение...",
  },
  send: { eng: "Send", esp: "Enviar", ru: "Отправить" },

  // Home
  loadingCalendar: {
    eng: "Loading calendar...",
    esp: "Cargando calendario...",
    ru: "Загрузка календаря...",
  },
  bookingCalendar: { eng: "Booking calendar", esp: "Calendario de reservas", ru: "Календарь бронирования" },

  // Pages
  experienciasTitle: { eng: "Experiences", esp: "Experiencias", ru: "Впечатления" },
  experienciasContent: {
    eng: "Experiences content.",
    esp: "Contenido de Experiencias.",
    ru: "Содержание раздела «Впечатления».",
  },
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
      document.documentElement.lang = lang === "eng" ? "en" : lang === "esp" ? "es" : "ru";
    }
  },

  t: (key: string, params?: Record<string, string | number>) => {
    const { lang } = get();
    const entry = translations[key as keyof typeof translations];
    if (!entry) return key;
    let text = entry[lang] ?? entry.eng;
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
    if (saved && (saved === "eng" || saved === "esp" || saved === "ru")) {
      useLangStore.setState({ lang: saved as Lang });
      if (typeof document !== "undefined") {
        document.documentElement.lang = saved === "eng" ? "en" : saved === "esp" ? "es" : "ru";
      }
      return saved as Lang;
    }
  } catch (e) {
    console.warn("Failed to restore language:", e);
  }
  return "eng";
}
