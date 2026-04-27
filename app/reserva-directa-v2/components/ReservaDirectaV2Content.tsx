"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { useLangStore } from "@/app/lib/langStore";
import type { Lang } from "@/app/lib/langStore";

const API = "/api/avaibook";
const DETAIL_BATCH_API = "/api/avaibook-batch";
const BOOK = "https://rentbooking.inftour.es";
const BOOK_LANG_TO_PATH: Record<Lang, string> = {
  eng: "en",
  esp: "es",
  ru: "ru",
  fr: "fr",
  it: "it",
  de: "de",
  uk: "uk",
  pl: "pl",
};

const LANG_TO_LOCALE: Record<Lang, string> = {
  eng: "en-GB",
  esp: "es-ES",
  ru: "ru-RU",
  fr: "fr-FR",
  it: "it-IT",
  de: "de-DE",
  uk: "uk-UA",
  pl: "pl-PL",
};

const FEAT_LABELS: Record<string, string> = {
  wifi: "WiFi",
  ac: "A/C",
  tv: "TV",
  parking_pago_solicitud: "Parking",
  lavadora: "Lavadora",
  lavavajillas: "Lavavajillas",
  ascensor: "Ascensor",
  calefaccion: "CalefacciÃ³n",
  secador_pelo: "Secador",
  plancha: "Plancha",
  microondas: "Microondas",
  horno: "Horno",
  cafetera: "Cafetera",
  prohibido_fumar: "No fumar",
  vistas: "Vistas",
  vistas_ciudad: "Vistas ciudad",
  cerca_mar: "Cerca del mar",
  playa: "Playa",
  centro_ciudad: "Centro",
  aire_acondicionado_individual: "A/C individual",
  tv_pantalla_plana: "TV plana",
  ropa_cama: "Ropa cama",
  toallas: "Toallas",
  hervidor: "Hervidor",
  tostadora: "Tostadora",
  ventilador: "Ventilador",
  sofa: "SofÃ¡",
  sistema_antimosquitos: "Antimosquitos",
  cortinas_opacas: "Cortinas opacas",
  piscina: "Piscina",
  piscina_compartida: "Piscina compart.",
};

const AMENITY_CHIP_TRANSLATIONS: Record<string, Record<Lang, string>> = {
  wifi: {
    eng: "WiFi",
    esp: "WiFi",
    ru: "Wi-Fi",
    fr: "Wi-Fi",
    it: "Wi-Fi",
    de: "WLAN",
    uk: "Wi-Fi",
    pl: "Wi-Fi",
  },
  ac: {
    eng: "A/C",
    esp: "A/C",
    ru: "Кондиционер",
    fr: "Climatisation",
    it: "Aria cond.",
    de: "Klimaanlage",
    uk: "Кондиціонер",
    pl: "Klimatyzacja",
  },
  tv: {
    eng: "TV",
    esp: "TV",
    ru: "ТВ",
    fr: "TV",
    it: "TV",
    de: "TV",
    uk: "ТБ",
    pl: "TV",
  },
  piscina: {
    eng: "Pool",
    esp: "Piscina",
    ru: "Бассейн",
    fr: "Piscine",
    it: "Piscina",
    de: "Pool",
    uk: "Басейн",
    pl: "Basen",
  },
  piscina_compartida: {
    eng: "Shared pool",
    esp: "Piscina compart.",
    ru: "Общий бассейн",
    fr: "Piscine partagee",
    it: "Piscina condivisa",
    de: "Gemeinschaftspool",
    uk: "Спільний басейн",
    pl: "Basen wspolny",
  },
  parking_pago_solicitud: {
    eng: "Parking",
    esp: "Parking",
    ru: "Парковка",
    fr: "Parking",
    it: "Parcheggio",
    de: "Parkplatz",
    uk: "Паркування",
    pl: "Parking",
  },
  lavadora: {
    eng: "Washer",
    esp: "Lavadora",
    ru: "Стиральная машина",
    fr: "Lave-linge",
    it: "Lavatrice",
    de: "Waschmaschine",
    uk: "Пральна машина",
    pl: "Pralka",
  },
  ascensor: {
    eng: "Elevator",
    esp: "Ascensor",
    ru: "Лифт",
    fr: "Ascenseur",
    it: "Ascensore",
    de: "Aufzug",
    uk: "Ліфт",
    pl: "Winda",
  },
  vistas: {
    eng: "View",
    esp: "Vistas",
    ru: "Вид",
    fr: "Vue",
    it: "Vista",
    de: "Aussicht",
    uk: "Вид",
    pl: "Widok",
  },
  playa: {
    eng: "Beach",
    esp: "Playa",
    ru: "Пляж",
    fr: "Plage",
    it: "Spiaggia",
    de: "Strand",
    uk: "Пляж",
    pl: "Plaza",
  },
  cerca_mar: {
    eng: "Near the sea",
    esp: "Cerca del mar",
    ru: "Рядом с морем",
    fr: "Pres de la mer",
    it: "Vicino al mare",
    de: "Nahe am Meer",
    uk: "Біля моря",
    pl: "Blisko morza",
  },
  centro_ciudad: {
    eng: "City center",
    esp: "Centro",
    ru: "Центр",
    fr: "Centre-ville",
    it: "Centro",
    de: "Stadtzentrum",
    uk: "Центр",
    pl: "Centrum",
  },
  lavavajillas: {
    eng: "Dishwasher",
    esp: "Lavavajillas",
    ru: "Посудомоечная машина",
    fr: "Lave-vaisselle",
    it: "Lavastoviglie",
    de: "Spulmaschine",
    uk: "Посудомийна машина",
    pl: "Zmywarka",
  },
};

function getAmenityLabel(feature: string, lang: Lang): string {
  return (
    AMENITY_CHIP_TRANSLATIONS[feature]?.[lang] ??
    FEAT_LABELS[feature] ??
    feature
  );
}

function AmenityIcon({ feature }: { feature: string }) {
  const commonProps = {
    width: 12,
    height: 12,
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": "true" as const,
  };

  switch (feature) {
    case "wifi":
      return (
        <svg {...commonProps}>
          <path
            d="M2.5 6.5A8 8 0 0 1 13.5 6.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M4.75 9A5 5 0 0 1 11.25 9"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M7 11.5a2 2 0 0 1 2 0"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <circle cx="8" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case "ac":
    case "aire_acondicionado_individual":
      return (
        <svg {...commonProps}>
          <path
            d="M8 2.5v11"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M4.5 4.5 11.5 11.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M11.5 4.5 4.5 11.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "tv":
    case "tv_pantalla_plana":
      return (
        <svg {...commonProps}>
          <rect
            x="2.5"
            y="3"
            width="11"
            height="7.5"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M6.5 13h3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "parking_pago_solicitud":
      return (
        <svg {...commonProps}>
          <path
            d="M5 13V3h3.5a2.5 2.5 0 1 1 0 5H5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lavadora":
    case "lavavajillas":
      return (
        <svg {...commonProps}>
          <rect
            x="3"
            y="2.5"
            width="10"
            height="11"
            rx="1.3"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle
            cx="8"
            cy="8.5"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="5.2" cy="4.7" r=".6" fill="currentColor" />
          <circle cx="7.2" cy="4.7" r=".6" fill="currentColor" />
        </svg>
      );
    case "ascensor":
      return (
        <svg {...commonProps}>
          <rect
            x="4"
            y="2.5"
            width="8"
            height="11"
            rx="1.3"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M8 5V11"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="m6.5 6.5 1.5-1.5 1.5 1.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m6.5 9.5 1.5 1.5 1.5-1.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "vistas":
    case "vistas_ciudad":
      return (
        <svg {...commonProps}>
          <path
            d="M2.5 8s2-3 5.5-3 5.5 3 5.5 3-2 3-5.5 3-5.5-3-5.5-3Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle
            cx="8"
            cy="8"
            r="1.6"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "playa":
    case "cerca_mar":
      return (
        <svg {...commonProps}>
          <path
            d="M2.5 10.5c1 .8 2 .8 3 0s2-.8 3 0 2 .8 3 0 2-.8 2.5-.4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M5 7.5c.7-.8 1.4-1.2 2.2-1.2S8.8 6.7 9.5 7.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "piscina":
    case "piscina_compartida":
      return (
        <svg {...commonProps}>
          <path
            d="M2.5 11c1 .7 2 .7 3 0s2-.7 3 0 2 .7 3 0 2-.7 2.5-.3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M5 10V4.5a1 1 0 0 1 2 0V10"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M5 6h2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M8 5.5v5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M5.5 8h5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

const TOP_FEATS = [
  "wifi",
  "ac",
  "tv",
  "piscina",
  "piscina_compartida",
  "parking_pago_solicitud",
  "lavadora",
  "ascensor",
  "vistas",
  "playa",
  "cerca_mar",
  "centro_ciudad",
  "lavavajillas",
];

const modalTranslations = {
  visitActualPage: {
    eng: "Visit page",
    esp: "Visitar página",
    ru: "Открыть страницу",
    fr: "Voir la page",
    it: "Visita pagina",
    de: "Seite offnen",
    uk: "Відкрити сторінку",
    pl: "Otworz strone",
  },
  closeModal: {
    eng: "Close",
    esp: "Cerrar",
    ru: "Закрыть",
    fr: "Fermer",
    it: "Chiudi",
    de: "Schliessen",
    uk: "Закрити",
    pl: "Zamknij",
  },
  bookingProperty: {
    eng: "Booking property",
    esp: "Reserva de propiedad",
    ru: "Бронирование объекта",
    fr: "Reservation du logement",
    it: "Prenotazione proprieta",
    de: "Objektbuchung",
    uk: "Бронювання об'єкта",
    pl: "Rezerwacja obiektu",
  },
  loadingPage: {
    eng: "Loading page...",
    esp: "Cargando página...",
    ru: "Загрузка страницы...",
    fr: "Chargement de la page...",
    it: "Caricamento pagina...",
    de: "Seite wird geladen...",
    uk: "Завантаження сторінки...",
    pl: "Ladowanie strony...",
  },
} as const;

const bookingSearchTranslations = {
  checkIn: {
    eng: "Check-in",
    esp: "Llegada",
    ru: "Заезд",
    fr: "Arrivee",
    it: "Arrivo",
    de: "Anreise",
    uk: "Заїзд",
    pl: "Przyjazd",
  },
  checkOut: {
    eng: "Check-out",
    esp: "Salida",
    ru: "Выезд",
    fr: "Depart",
    it: "Partenza",
    de: "Abreise",
    uk: "Виїзд",
    pl: "Wyjazd",
  },
  guests: {
    eng: "Guests",
    esp: "Huespedes",
    ru: "Гости",
    fr: "Voyageurs",
    it: "Ospiti",
    de: "Gaste",
    uk: "Гості",
    pl: "Goscie",
  },
  search: {
    eng: "Search",
    esp: "Buscar",
    ru: "Найти",
    fr: "Rechercher",
    it: "Cerca",
    de: "Suchen",
    uk: "Шукати",
    pl: "Szukaj",
  },
  reset: {
    eng: "Reset",
    esp: "Reset",
    ru: "Сброс",
    fr: "Réinitialiser",
    it: "Reimposta",
    de: "Reset",
    uk: "Скинути",
    pl: "Reset",
  },
  missingDate: {
    eng: "Missing date",
    esp: "Falta fecha",
    ru: "Не выбрана дата",
    fr: "Date manquante",
    it: "Data mancante",
    de: "Datum fehlt",
    uk: "Дата не вибрана",
    pl: "Brak daty",
  },
  datePlaceholder: {
    eng: "dd/mm/yyyy",
    esp: "dd/mm/aaaa",
    ru: "дд/мм/гггг",
    fr: "jj/mm/aaaa",
    it: "gg/mm/aaaa",
    de: "tt/mm/jjjj",
    uk: "дд/мм/рррр",
    pl: "dd/mm/rrrr",
  },
  guestSingular: {
    eng: "guest",
    esp: "huesped",
    ru: "гость",
    fr: "voyageur",
    it: "ospite",
    de: "Gast",
    uk: "гість",
    pl: "gosc",
  },
  guestPlural: {
    eng: "guests",
    esp: "huespedes",
    ru: "гостей",
    fr: "voyageurs",
    it: "ospiti",
    de: "Gaste",
    uk: "гостей",
    pl: "gosci",
  },
} as const;

const bookingResultsTranslations = {
  staysInCalpe: {
    eng: "stays in Calpe",
    esp: "alojamientos en Calpe",
    ru: "вариантов размещения в Кальпе",
    fr: "hebergements a Calpe",
    it: "alloggi a Calpe",
    de: "Unterkunfte in Calpe",
    uk: "варіантів проживання в Кальпе",
    pl: "noclegow w Calpe",
  },
  loadingListings: {
    eng: "Loading stays...",
    esp: "Cargando alojamientos...",
    ru: "Загрузка вариантов размещения...",
    fr: "Chargement des hebergements...",
    it: "Caricamento alloggi...",
    de: "Unterkunfte werden geladen...",
    uk: "Завантаження варіантів проживання...",
    pl: "Ladowanie noclegow...",
  },
  loadingProperties: {
    eng: "Loading properties...",
    esp: "Cargando propiedades...",
    ru: "Загрузка объектов...",
    fr: "Chargement des logements...",
    it: "Caricamento proprieta...",
    de: "Unterkunfte werden geladen...",
    uk: "Завантаження об'єктів...",
    pl: "Ladowanie obiektow...",
  },
  loadingDetails: {
    eng: "loading details...",
    esp: "cargando detalles...",
    ru: "загрузка деталей...",
    fr: "chargement des details...",
    it: "caricamento dettagli...",
    de: "lade Details...",
    uk: "завантаження деталей...",
    pl: "ladowanie szczegolow...",
  },
  loadError: {
    eng: "Could not load stays.",
    esp: "No se pudieron cargar los alojamientos.",
    ru: "Не удалось загрузить варианты размещения.",
    fr: "Impossible de charger les hebergements.",
    it: "Impossibile caricare gli alloggi.",
    de: "Unterkunfte konnten nicht geladen werden.",
    uk: "Не вдалося завантажити варіанти проживання.",
    pl: "Nie udalo sie zaladowac noclegow.",
  },
  showingSearchResults: {
    eng: "Showing search results",
    esp: "Mostrando resultados de busqueda",
    ru: "Показаны результаты поиска",
    fr: "Affichage des resultats de recherche",
    it: "Visualizzazione dei risultati di ricerca",
    de: "Suchergebnisse werden angezeigt",
    uk: "Показані результати пошуку",
    pl: "Pokazywanie wynikow wyszukiwania",
  },
  viewAll: {
    eng: "View all",
    esp: "Ver todo",
    ru: "Показать все",
    fr: "Voir tout",
    it: "Vedi tutto",
    de: "Alle anzeigen",
    uk: "Показати все",
    pl: "Zobacz wszystko",
  },
  noSearchResults: {
    eng: "No stays available for {guests} on {dates}.",
    esp: "No hay alojamientos disponibles para {guests} en {dates}.",
    ru: "Нет доступных вариантов размещения для {guests} на даты {dates}.",
    fr: "Aucun logement disponible pour {guests} aux dates {dates}.",
    it: "Nessun alloggio disponibile per {guests} nelle date {dates}.",
    de: "Keine verfugbaren Unterkunfte fur {guests} an den Daten {dates}.",
    uk: "Немає доступних варіантів проживання для {guests} на дати {dates}.",
    pl: "Brak dostepnych noclegow dla {guests} w terminie {dates}.",
  },
  nightSingular: {
    eng: "night",
    esp: "noche",
    ru: "ночь",
    fr: "nuit",
    it: "notte",
    de: "Nacht",
    uk: "ніч",
    pl: "noc",
  },
  nightPlural: {
    eng: "nights",
    esp: "noches",
    ru: "ночей",
    fr: "nuits",
    it: "notti",
    de: "Nachte",
    uk: "ночей",
    pl: "nocy",
  },
  mapTitle: {
    eng: "Property map",
    esp: "Mapa de propiedades",
    ru: "Карта объектов",
    fr: "Carte des logements",
    it: "Mappa delle proprieta",
    de: "Karte der Unterkunfte",
    uk: "Карта об'єктів",
    pl: "Mapa obiektow",
  },
  mapHint: {
    eng: "Tap a marker to see the stay title and location.",
    esp: "Pulsa un marcador para ver el titulo y la ubicacion.",
    ru: "Нажмите на маркер, чтобы увидеть название и расположение.",
    fr: "Appuyez sur un marqueur pour voir le titre et l'emplacement.",
    it: "Tocca un indicatore per vedere titolo e posizione.",
    de: "Tippen Sie auf eine Markierung, um Titel und Lage zu sehen.",
    uk: "Натисніть на маркер, щоб побачити назву та розташування.",
    pl: "Kliknij znacznik, aby zobaczyc tytul i lokalizacje.",
  },
  mapRecenterCalpe: {
    eng: "Back to Calpe",
    esp: "Volver a Calpe",
    ru: "Вернуться к Кальпе",
    fr: "Revenir a Calpe",
    it: "Torna a Calpe",
    de: "Zuruck nach Calpe",
    uk: "Повернутись до Кальпе",
    pl: "Wroc do Calpe",
  },
  openInGoogleMaps: {
    eng: "Open in Google Maps",
    esp: "Abrir en Google Maps",
    ru: "Открыть в Google Maps",
    fr: "Ouvrir dans Google Maps",
    it: "Apri in Google Maps",
    de: "In Google Maps offnen",
    uk: "Відкрити у Google Maps",
    pl: "Otworz w Google Maps",
  },
  moreInfo: {
    eng: "More info",
    esp: "Mas info",
    ru: "Подробнее",
    fr: "Plus d'infos",
    it: "Piu info",
    de: "Mehr Infos",
    uk: "Бiльше iнфо",
    pl: "Wiecej info",
  },
} as const;

const LOAD_ERROR_FALLBACK_MESSAGE = "Error loading stay";

const propertyCardTranslations = {
  propertyFallback: {
    eng: "Property",
    esp: "Alojamiento",
    ru: "Объект",
    fr: "Logement",
    it: "Alloggio",
    de: "Unterkunft",
    uk: "Об'єкт",
    pl: "Obiekt",
  },
  loadingData: {
    eng: "Loading data...",
    esp: "Cargando datos...",
    ru: "Загрузка данных...",
    fr: "Chargement des donnees...",
    it: "Caricamento dati...",
    de: "Daten werden geladen...",
    uk: "Завантаження даних...",
    pl: "Ladowanie danych...",
  },
  calculatingPrice: {
    eng: "Calculating price...",
    esp: "Calculando precio...",
    ru: "Расчет стоимости...",
    fr: "Calcul du prix...",
    it: "Calcolo del prezzo...",
    de: "Preis wird berechnet...",
    uk: "Розрахунок ціни...",
    pl: "Obliczanie ceny...",
  },
  retryPrice: {
    eng: "Retry price",
    esp: "Reintentar precio",
    ru: "Повторить расчет",
    fr: "Reessayer le prix",
    it: "Riprova prezzo",
    de: "Preis erneut laden",
    uk: "Повторити розрахунок",
    pl: "Ponow cene",
  },
  retry: {
    eng: "Retry",
    esp: "Reintentar",
    ru: "Повторить",
    fr: "Reessayer",
    it: "Riprova",
    de: "Erneut versuchen",
    uk: "Спробувати знову",
    pl: "Sprobuj ponownie",
  },
  previousPhoto: {
    eng: "Previous photo",
    esp: "Foto anterior",
    ru: "Предыдущее фото",
    fr: "Photo precedente",
    it: "Foto precedente",
    de: "Vorheriges Foto",
    uk: "Попереднє фото",
    pl: "Poprzednie zdjecie",
  },
  nextPhoto: {
    eng: "Next photo",
    esp: "Foto siguiente",
    ru: "Следующее фото",
    fr: "Photo suivante",
    it: "Foto successiva",
    de: "Nachstes Foto",
    uk: "Наступне фото",
    pl: "Nastepne zdjecie",
  },
  bedroomsShort: {
    eng: "bedr.",
    esp: "hab.",
    ru: "комн.",
    fr: "ch.",
    it: "cam.",
    de: "Zi.",
    uk: "кімн.",
    pl: "pok.",
  },
  bathroomsShort: {
    eng: "bath",
    esp: "bano",
    ru: "ванн.",
    fr: "sdb",
    it: "bagno",
    de: "bad",
    uk: "ванн.",
    pl: "laz.",
  },
  beds: {
    eng: "beds",
    esp: "camas",
    ru: "кровати",
    fr: "lits",
    it: "letti",
    de: "Betten",
    uk: "ліжка",
    pl: "lozka",
  },
  bathrooms: {
    eng: "bathrooms",
    esp: "banos",
    ru: "ванные",
    fr: "salles de bain",
    it: "bagni",
    de: "Badezimmer",
    uk: "ванні",
    pl: "lazienki",
  },
  viewInfo: {
    eng: "View info",
    esp: "Ver información",
    ru: "Подробнее",
    fr: "Voir les infos",
    it: "Vedi informazioni",
    de: "Infos ansehen",
    uk: "Детальніше",
    pl: "Zobacz informacje",
  },
  totalPrice: {
    eng: "Total stay",
    esp: "Precio total",
    ru: "Полная стоимость",
    fr: "Prix total",
    it: "Prezzo totale",
    de: "Gesamtpreis",
    uk: "Загальна вартість",
    pl: "Cena laczna",
  },
  sharePropertyAria: {
    eng: "Share this property",
    esp: "Compartir esta propiedad",
    ru: "Поделиться объектом",
    fr: "Partager ce logement",
    it: "Condividi questa struttura",
    de: "Unterkunft teilen",
    uk: "Поділитися об’єктом",
    pl: "Udostepnij obiekt",
  },
  shareMenuHeading: {
    eng: "Share",
    esp: "Compartir",
    ru: "Поделиться",
    fr: "Partager",
    it: "Condividi",
    de: "Teilen",
    uk: "Поділитися",
    pl: "Udostepnij",
  },
  shareCopyLink: {
    eng: "Copy link",
    esp: "Copiar enlace",
    ru: "Скопировать ссылку",
    fr: "Copier le lien",
    it: "Copia link",
    de: "Link kopieren",
    uk: "Скопіювати посилання",
    pl: "Kopiuj link",
  },
  shareCopied: {
    eng: "Copied!",
    esp: "¡Copiado!",
    ru: "Скопировано!",
    fr: "Copié !",
    it: "Copiato!",
    de: "Kopiert!",
    uk: "Скопійовано!",
    pl: "Skopiowano!",
  },
  shareMessageLead: {
    eng: "Check out this stay in Calpe on INFTOUR:",
    esp: "Mira este alojamiento en Calpe (INFTOUR):",
    ru: "Посмотрите это жилье в Кальпе (INFTOUR):",
    fr: "Découvrez ce logement à Calpe (INFTOUR) :",
    it: "Scopri questa struttura a Calpe (INFTOUR):",
    de: "Diese Unterkunft in Calpe (INFTOUR):",
    uk: "Перегляньте це житло в Кальпе (INFTOUR):",
    pl: "Zobacz to nocleg w Calpe (INFTOUR):",
  },
} as const;

// Raw shape from AvaiBook API
interface RawProperty {
  id: number;
  name?: string;
  tradeName?: { es?: string; en?: string };
  accommodationType?: string;
  location?: {
    city?: string;
    region?: string;
    latitude?: number | string;
    longitude?: number | string;
    address?: string;
  };
  units?: Array<{
    id?: number;
    capacity?: number;
    name?: {
      es?: string;
      en?: string;
      ca?: string;
      de?: string;
      fr?: string;
      it?: string;
      pt?: string;
      nl?: string;
      ru?: string;
    };
  }>;
  features?: Record<string, string | boolean | number>;
  images?: Array<{ SMALL?: string; BIG?: string; ORIGINAL?: string }>;
  introduction?: { es?: string };
  description?: { es?: string };
  license?: string;
  entryTime?: string;
  departureTime?: string;
}

// Normalised shape used in the UI
interface Property {
  id: number;
  unitIds: number[];
  units: Array<{ id: number; name: string }>;
  name: string;
  type: string;
  city: string;
  region: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  sqm: number;
  features: Record<string, string | boolean | number>;
  images: Array<{ SMALL: string; BIG: string; ORIGINAL: string }>;
  introduction: string;
  description: string;
  license: string;
  entryTime: string | null;
  departureTime: string | null;
  bookingPriceTotal?: number | null;
  bookingPriceStatus?: string | null;
  loadError?: string | null;
}

type AccommodationListItem = {
  id: number;
  name?: string;
  tradeName?: { es?: string; en?: string };
  units?: Array<{
    id?: number;
    name?: {
      es?: string;
      en?: string;
      ca?: string;
      de?: string;
      fr?: string;
      it?: string;
      pt?: string;
      nl?: string;
      ru?: string;
    };
  }>;
};

type BookingPriceItem = {
  status?: string;
  total?: number;
  unit?: {
    id?: number;
    name?: {
      es?: string;
      en?: string;
      ca?: string;
      de?: string;
      fr?: string;
      it?: string;
      pt?: string;
      nl?: string;
      ru?: string;
    };
  };
};

function getAccommodationListName(item: AccommodationListItem): string {
  return stripInftourSuffix(item.tradeName?.es || item.name || "");
}

function stripInftourSuffix(name: string): string {
  return name
    .replace(/\binftour\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function createPlaceholderProperty(item: AccommodationListItem): Property {
  const units = (item.units ?? [])
    .map((unit) => {
      if (!Number.isFinite(unit.id)) return null;
      return {
        id: unit.id as number,
        name: stripInftourSuffix(
          unit.name?.es ||
            unit.name?.en ||
            item.tradeName?.es ||
            item.name ||
            "",
        ),
      };
    })
    .filter((unit): unit is { id: number; name: string } => unit !== null);

  return {
    id: item.id,
    unitIds: units.map((unit) => unit.id),
    units,
    name: getAccommodationListName(item),
    type: "",
    city: "",
    region: "",
    latitude: null,
    longitude: null,
    address: "",
    capacity: 0,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    sqm: 0,
    features: {},
    images: [],
    introduction: "",
    description: "",
    license: "",
    entryTime: null,
    departureTime: null,
    bookingPriceTotal: null,
    bookingPriceStatus: null,
    loadError: null,
  };
}

function normalize(a: RawProperty): Property {
  const units = (a.units ?? [])
    .map((unit) => {
      if (!Number.isFinite(unit.id)) return null;
      return {
        id: unit.id as number,
        name: stripInftourSuffix(
          unit.name?.es || unit.name?.en || a.tradeName?.es || a.name || "",
        ),
      };
    })
    .filter((unit): unit is { id: number; name: string } => unit !== null);

  return {
    id: a.id,
    unitIds: units.map((unit) => unit.id),
    units,
    name: stripInftourSuffix(a.tradeName?.es || a.name || ""),
    type: a.accommodationType || "",
    city: a.location?.city || "Calp",
    region: a.location?.region || "Alicante",
    latitude: Number.isFinite(Number(a.location?.latitude))
      ? Number(a.location?.latitude)
      : null,
    longitude: Number.isFinite(Number(a.location?.longitude))
      ? Number(a.location?.longitude)
      : null,
    address: a.location?.address || "",
    capacity: a.units?.[0]?.capacity ?? 0,
    bedrooms: Number(a.features?.n_hab) || 0,
    beds: Number(a.features?.n_camas) || 0,
    bathrooms: Number(a.features?.n_banos) || 0,
    sqm: parseFloat(String(a.features?.superficie ?? "0")) || 0,
    features: a.features ?? {},
    images: (a.images ?? []).map((img) => ({
      SMALL: img.SMALL || img.BIG || img.ORIGINAL || "",
      BIG: img.BIG || img.ORIGINAL || img.SMALL || "",
      ORIGINAL: img.ORIGINAL || img.BIG || img.SMALL || "",
    })),
    introduction: a.introduction?.es || "",
    description: a.description?.es || "",
    license: a.license || "",
    entryTime: a.entryTime || null,
    departureTime: a.departureTime || null,
    bookingPriceTotal: null,
    bookingPriceStatus: null,
    loadError: null,
  };
}

function formatCurrencyAmount(value: number, lang: Lang): string {
  const roundedValue = Math.round(value);

  return new Intl.NumberFormat(LANG_TO_LOCALE[lang] ?? "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedValue);
}

function clearPropertyBookingPrices(properties: Property[]): Property[] {
  return properties.map((prop) =>
    prop.bookingPriceTotal === null && prop.bookingPriceStatus === null
      ? prop
      : {
          ...prop,
          bookingPriceTotal: null,
          bookingPriceStatus: null,
        },
  );
}

function normalizeUnitNameForMatch(name: string): string {
  return stripInftourSuffix(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function mergeBookingPricesIntoProperties(
  properties: Property[],
  bookingPrices: BookingPriceItem[],
): Property[] {
  const propertyCandidatesByUnitId = new Map<
    number,
    Array<{ propertyId: number; normalizedUnitName: string }>
  >();
  properties.forEach((prop) => {
    prop.units.forEach((unit) => {
      const candidates = propertyCandidatesByUnitId.get(unit.id) ?? [];
      candidates.push({
        propertyId: prop.id,
        normalizedUnitName: normalizeUnitNameForMatch(unit.name),
      });
      propertyCandidatesByUnitId.set(unit.id, candidates);
    });
  });

  const bookingPriceByPropertyId = new Map<
    number,
    { total: number | null; status: string | null }
  >();

  bookingPrices.forEach((item) => {
    const unitId = item.unit?.id;
    if (typeof unitId !== "number" || !Number.isFinite(unitId)) return;

    const candidates = propertyCandidatesByUnitId.get(unitId);
    if (!candidates || candidates.length === 0) return;

    const bookingUnitName = item.unit?.name?.es || item.unit?.name?.en || "";
    const normalizedBookingUnitName =
      normalizeUnitNameForMatch(bookingUnitName);
    const propertyId =
      candidates.length === 1
        ? candidates[0].propertyId
        : candidates.find(
            (candidate) =>
              normalizedBookingUnitName.length > 0 &&
              candidate.normalizedUnitName === normalizedBookingUnitName,
          )?.propertyId;
    if (!propertyId) return;

    const total =
      typeof item.total === "number" &&
      Number.isFinite(item.total) &&
      item.total > 0
        ? item.total
        : null;
    const status = typeof item.status === "string" ? item.status : null;
    const existing = bookingPriceByPropertyId.get(propertyId);

    if (!existing) {
      bookingPriceByPropertyId.set(propertyId, { total, status });
      return;
    }

    if (total !== null && (existing.total === null || total < existing.total)) {
      bookingPriceByPropertyId.set(propertyId, { total, status });
    }
  });

  return properties.map((prop) => {
    const bookingPrice = bookingPriceByPropertyId.get(prop.id);
    if (!bookingPrice) {
      return {
        ...prop,
        bookingPriceTotal: null,
        bookingPriceStatus: null,
      };
    }

    return {
      ...prop,
      bookingPriceTotal: bookingPrice.total,
      bookingPriceStatus: bookingPrice.status,
    };
  });
}

function getTopFeats(
  features: Record<string, string | boolean | number>,
): string[] {
  return TOP_FEATS.filter(
    (k) =>
      features[k] === "1" ||
      features[k] === true ||
      (typeof features[k] === "number" && (features[k] as number) > 0),
  );
}

type MappedProperty = Property & {
  latitude: number;
  longitude: number;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildGoogleMapsUrl(property: MappedProperty): string {
  return (
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(`${property.latitude},${property.longitude}`)
  );
}

function buildMarkerHtml(params: {
  capacity: number;
  isVisited: boolean;
  formattedTotalPrice?: string | null;
  showPriceLoading?: boolean;
}): string {
  const { capacity, isVisited, formattedTotalPrice, showPriceLoading } = params;
  const safeCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : 0;
  const hasPriceRow =
    Boolean(formattedTotalPrice && formattedTotalPrice.length > 0) ||
    Boolean(showPriceLoading);
  return (
    `<div style="display:inline-flex;flex-direction:column;min-height:${hasPriceRow ? "34px" : "18px"};min-width:${hasPriceRow ? "48px" : "30px"};align-items:stretch;justify-content:center;overflow:hidden;` +
    `border-radius:999px;background:${isVisited ? "#7c3aed" : "#0f172a"};color:#fff;font-size:10px;font-weight:700;line-height:1;` +
    `box-shadow:0 4px 12px rgba(0,0,0,0.26);border:2px solid ${isVisited ? "#c4b5fd" : "#c2a457"};">` +
    `<div style="display:flex;align-items:center;justify-content:center;gap:3px;padding:${hasPriceRow ? "2px 6px 1px" : "0 6px"};">` +
    `<svg width="11" height="11" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
    `<circle cx="8" cy="5" r="2.5" stroke="currentColor" stroke-width="2"/>` +
    `<path d="M3.5 13c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>` +
    `</svg>` +
    `<span>${safeCapacity}</span>` +
    `</div>` +
    (formattedTotalPrice && formattedTotalPrice.length > 0
      ? `<div style="display:flex;align-items:center;justify-content:center;min-height:16px;padding:1px 6px;border-top:1px solid rgba(255,255,255,.18);font-size:10px;font-weight:800;line-height:1.1;white-space:nowrap;">${formattedTotalPrice}</div>`
      : showPriceLoading
        ? `<div style="display:flex;align-items:center;justify-content:center;min-height:16px;padding:1px 6px;border-top:1px solid rgba(255,255,255,.18);font-size:10px;font-weight:800;line-height:1;">...</div>`
        : "") +
    `</div>`
  );
}

function markBookingPriceErrorForProperties(
  properties: Property[],
  propertyIds: Set<number>,
): Property[] {
  return properties.map((prop) =>
    propertyIds.has(prop.id)
      ? {
          ...prop,
          bookingPriceTotal: null,
          bookingPriceStatus: "ERROR",
        }
      : prop,
  );
}

const CALPE_MAP_CENTER: [number, number] = [38.644, 0.044];
const CALPE_MAP_ZOOM = 12;

function PropertyMap({
  properties,
  title,
  hint,
  openInGoogleMapsLabel,
  moreInfoLabel,
  totalPriceLabel,
  calculatingPriceLabel,
  retryPriceLabel,
  guestSingularLabel,
  guestPluralLabel,
  nightSingularLabel,
  nightPluralLabel,
  bedroomsShortLabel,
  bathroomsShortLabel,
  lang,
  guestFilter,
  bookingStartDate,
  bookingEndDate,
  isLoadingProperties,
  isBookingPriceLoading,
  loadingPropertiesLabel,
  recenterCalpeLabel,
  onRetryPrice,
  onOpen,
}: {
  properties: MappedProperty[];
  title: string;
  hint: string;
  openInGoogleMapsLabel: string;
  moreInfoLabel: string;
  totalPriceLabel: string;
  calculatingPriceLabel: string;
  retryPriceLabel: string;
  guestSingularLabel: string;
  guestPluralLabel: string;
  nightSingularLabel: string;
  nightPluralLabel: string;
  bedroomsShortLabel: string;
  bathroomsShortLabel: string;
  lang: Lang;
  guestFilter: string;
  bookingStartDate?: string;
  bookingEndDate?: string;
  isLoadingProperties: boolean;
  isBookingPriceLoading: boolean;
  loadingPropertiesLabel: string;
  recenterCalpeLabel: string;
  onRetryPrice: () => void;
  onOpen: (url: string) => void;
}) {
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const userAdjustedViewRef = useRef(false);
  const autoFittingRef = useRef(false);
  const clickedPropertyIdsRef = useRef<Set<number>>(new Set());
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapVisibilityEpoch, setMapVisibilityEpoch] = useState(0);

  useEffect(() => {
    const bumpMapResync = () => {
      setMapVisibilityEpoch((n) => n + 1);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        bumpMapResync();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        bumpMapResync();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow as EventListener);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow as EventListener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function mountMap() {
      const leafletModule = await import("leaflet");
      if (cancelled || !mapNodeRef.current) return;

      const L = leafletModule.default;

      const existingLeafletCss = document.querySelector(
        'link[data-leaflet="inftour"]',
      );
      if (!existingLeafletCss) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.dataset.leaflet = "inftour";
        document.head.appendChild(link);
      }

      if (!mapRef.current) {
        mapRef.current = L.map(mapNodeRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
          mapRef.current,
        );

        layerRef.current = L.layerGroup().addTo(mapRef.current);

        const markUserAdjustedView = () => {
          if (autoFittingRef.current) return;
          userAdjustedViewRef.current = true;
        };

        mapRef.current.on("movestart", markUserAdjustedView);
        mapRef.current.on("zoomstart", markUserAdjustedView);
        mapRef.current.setView(CALPE_MAP_CENTER, CALPE_MAP_ZOOM);
        window.setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 50);
      }

      if (!cancelled && mapRef.current && layerRef.current) {
        setIsMapReady(true);
      }
    }

    void mountMap();

    return () => {
      cancelled = true;
      setIsMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !layerRef.current) return;

    let cancelled = false;

    async function syncMarkers() {
      const leafletModule = await import("leaflet");
      if (cancelled || !mapRef.current || !layerRef.current) return;

      const L = leafletModule.default;
      layerRef.current.clearLayers();

      const bounds = L.latLngBounds([]);

      const source: MappedProperty[] = properties;

      source.forEach((property) => {
        if (
          typeof property.latitude !== "number" ||
          typeof property.longitude !== "number"
        ) {
          return;
        }

        const latLng = L.latLng(property.latitude, property.longitude);
        bounds.extend(latLng);
        const isVisited = clickedPropertyIdsRef.current.has(property.id);
        const hasActivePriceContext = Boolean(
          bookingStartDate && bookingEndDate,
        );
        const markerFormattedTotalPrice =
          hasActivePriceContext &&
          typeof property.bookingPriceTotal === "number" &&
          property.bookingPriceTotal > 0
            ? formatCurrencyAmount(property.bookingPriceTotal, lang)
            : null;
        const showMarkerPricePending =
          hasActivePriceContext &&
          !markerFormattedTotalPrice &&
          property.bookingPriceStatus !== "ERROR";
        const showPopupPriceRetry =
          hasActivePriceContext &&
          property.bookingPriceStatus === "ERROR" &&
          !isBookingPriceLoading;
        const hasMarkerPriceState =
          Boolean(markerFormattedTotalPrice) || showMarkerPricePending;

        const marker = L.marker(latLng, {
          icon: L.divIcon({
            className: "inftour-map-marker",
            html: buildMarkerHtml({
              capacity: property.capacity,
              isVisited,
              formattedTotalPrice: markerFormattedTotalPrice,
              showPriceLoading: showMarkerPricePending,
            }),
            iconSize: hasMarkerPriceState ? [48, 34] : [30, 18],
            iconAnchor: hasMarkerPriceState ? [24, 17] : [15, 9],
          }),
        });

        const mapsUrl = buildGoogleMapsUrl(property);
        const bookingUrl = buildBookingUrl(property.id, {
          guests: guestFilter,
          startDate: bookingStartDate,
          endDate: bookingEndDate,
          lang,
        });
        const safeTitle = escapeHtml(property.name);
        const safeLinkLabel = escapeHtml(openInGoogleMapsLabel);
        const safeMoreInfoLabel = escapeHtml(moreInfoLabel);
        const safeTotalPriceLabel = escapeHtml(totalPriceLabel);
        const safeCalculatingPriceLabel = escapeHtml(calculatingPriceLabel);
        const safeRetryPriceLabel = escapeHtml(retryPriceLabel);
        const imageUrls = Array.from(
          new Set(
            (property.images ?? [])
              .map(
                (image) => image?.SMALL || image?.BIG || image?.ORIGINAL || "",
              )
              .filter((value): value is string => value.length > 0),
          ),
        );
        const hasImages = imageUrls.length > 0;
        const hasImageSlider = imageUrls.length > 1;
        const sliderImagesHtml = imageUrls
          .map(
            (url, index) =>
              `<img src="${escapeHtml(url)}" alt="${safeTitle}" style="display:block;width:100%;height:110px;object-fit:cover;flex:0 0 100%;" loading="${index === 0 ? "eager" : "lazy"}" />`,
          )
          .join("");
        const firstImageUrl = hasImages ? escapeHtml(imageUrls[0]) : "";
        const capacityLabel =
          property.capacity > 0
            ? `${property.capacity} ${property.capacity === 1 ? guestSingularLabel : guestPluralLabel}`
            : "";
        const safeCapacity = escapeHtml(capacityLabel);
        const safeMeta = escapeHtml(
          [
            property.bedrooms > 0
              ? `${property.bedrooms} ${bedroomsShortLabel}`
              : "",
            property.bathrooms > 0
              ? `${property.bathrooms} ${bathroomsShortLabel}`
              : "",
            property.sqm > 0 ? `${property.sqm} m²` : "",
          ]
            .filter(Boolean)
            .join(" · "),
        );
        const totalNights =
          bookingStartDate && bookingEndDate
            ? Math.max(
                0,
                Math.round(
                  (startOfDay(new Date(bookingEndDate)).getTime() -
                    startOfDay(new Date(bookingStartDate)).getTime()) /
                    (1000 * 60 * 60 * 24),
                ),
              )
            : 0;
        const totalNightsLabel =
          totalNights > 0
            ? `${totalNights} ${
                totalNights === 1 ? nightSingularLabel : nightPluralLabel
              }`
            : "";
        const safeTotalNightsLabel = escapeHtml(totalNightsLabel);
        const formattedTotalPrice =
          hasActivePriceContext &&
          typeof property.bookingPriceTotal === "number" &&
          property.bookingPriceTotal > 0
            ? escapeHtml(formatCurrencyAmount(property.bookingPriceTotal, lang))
            : "";
        const showPopupPricePending =
          hasActivePriceContext &&
          formattedTotalPrice.length === 0 &&
          property.bookingPriceStatus !== "ERROR";

        marker.bindPopup(
          `<div style="min-width:190px;max-width:230px;font-family:Arial,sans-serif;">` +
            (hasImageSlider
              ? `<div style="position:relative;border-radius:10px;overflow:hidden;margin-bottom:8px;">` +
                `<div data-slider-track style="display:flex;transform:translateX(0%);transition:transform .25s ease;touch-action:pan-y;">${sliderImagesHtml}</div>` +
                `<button type="button" data-slider-prev aria-label="Previous image" style="position:absolute;left:6px;top:50%;transform:translateY(-50%);width:24px;height:24px;border:0;border-radius:999px;background:rgba(15,23,42,.68);color:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;line-height:1;">‹</button>` +
                `<button type="button" data-slider-next aria-label="Next image" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);width:24px;height:24px;border:0;border-radius:999px;background:rgba(15,23,42,.68);color:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;line-height:1;">›</button>` +
                `<div data-slider-counter style="position:absolute;right:8px;bottom:8px;padding:2px 6px;border-radius:999px;background:rgba(15,23,42,.68);font-size:10px;font-weight:700;color:#fff;">1/${imageUrls.length}</div>` +
                `</div>`
              : firstImageUrl
                ? `<img src="${firstImageUrl}" alt="${safeTitle}" style="display:block;width:100%;height:110px;object-fit:cover;border-radius:10px;margin-bottom:8px;" />`
                : "") +
            `<div style="margin-bottom:4px;font-size:14px;font-weight:700;color:#222;">${safeTitle}</div>` +
            (safeCapacity
              ? `<div style="margin-bottom:4px;font-size:12px;font-weight:600;color:#8f7130;">${safeCapacity}</div>`
              : "") +
            (safeMeta
              ? `<div style="margin-bottom:6px;font-size:12px;line-height:1.45;color:#555;">${safeMeta}</div>`
              : "") +
            (formattedTotalPrice || showPopupPricePending || showPopupPriceRetry
              ? `<div style="margin-bottom:8px;border:1px solid #eadfbf;background:#fbf7eb;border-radius:10px;padding:8px 10px;">` +
                `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:2px;">` +
                `<span style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8f7130;">${safeTotalPriceLabel}</span>` +
                (safeTotalNightsLabel
                  ? `<span style="display:inline-flex;align-items:center;border:1px solid #e2cf96;background:#f3e7bf;border-radius:999px;padding:2px 8px;font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#7f6630;">${safeTotalNightsLabel}</span>`
                  : "") +
                `</div>` +
                (showPopupPricePending
                  ? `<div style="display:flex;align-items:center;justify-content:center;gap:8px;min-height:24px;color:#8f7130;font-size:13px;font-weight:600;">` +
                    `<span style="display:inline-flex;width:14px;height:14px;border:2px solid #e4d4a6;border-top-color:#c2a457;border-radius:999px;"></span>` +
                    `<span>${safeCalculatingPriceLabel}</span>` +
                    `</div>`
                  : showPopupPriceRetry
                    ? `<div style="display:flex;align-items:center;justify-content:center;min-height:24px;">` +
                      `<button type="button" data-retry-price="true" style="cursor:pointer;display:inline-flex;align-items:center;gap:8px;border:1px solid #b8d7f3;background:#e8f4ff;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;color:#4e86b7;">` +
                      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">` +
                      `<path d="M13 8a5 5 0 1 1-1.46-3.54" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>` +
                      `<path d="M13 3v3h-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>` +
                      `</svg>` +
                      `<span>${safeRetryPriceLabel}</span>` +
                      `</button>` +
                      `</div>`
                    : `<div style="text-align:center;font-size:20px;font-weight:700;color:#2d2d2d;">${formattedTotalPrice}</div>`) +
                `</div>`
              : "") +
            `<div style="display:flex;gap:10px;flex-wrap:wrap;">` +
            `<button type="button" data-booking-url="${escapeHtml(bookingUrl)}" style="cursor:pointer;border:0;display:inline-flex;width:100%;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:700;color:#fff;background:#2563eb;padding:9px 12px;border-radius:999px;">` +
            `<span aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;">` +
            `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">` +
            `<path d="M3 8a5 5 0 1 1 1.46 3.54" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>` +
            `<path d="M8 5.2v2.9l1.9 1.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>` +
            `</svg>` +
            `</span>` +
            `${safeMoreInfoLabel}` +
            `</button>` +
            `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;width:100%;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600;color:#8f7130;text-decoration:none;padding-top:2px;">` +
            `<span aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;">` +
            `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">` +
            `<path d="M8 14s4-4.03 4-7.2A4 4 0 1 0 4 6.8C4 9.97 8 14 8 14Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>` +
            `<circle cx="8" cy="6.8" r="1.6" stroke="currentColor" stroke-width="1.4"/>` +
            `</svg>` +
            `</span>` +
            `${safeLinkLabel}` +
            `</a>` +
            `</div>` +
            `</div>`,
        );

        marker.on("popupopen", (event: any) => {
          if (!clickedPropertyIdsRef.current.has(property.id)) {
            clickedPropertyIdsRef.current.add(property.id);
            marker.setIcon(
              L.divIcon({
                className: "inftour-map-marker",
                html: buildMarkerHtml({
                  capacity: property.capacity,
                  isVisited: true,
                  formattedTotalPrice: markerFormattedTotalPrice,
                  showPriceLoading: showMarkerPricePending,
                }),
                iconSize: hasMarkerPriceState ? [48, 34] : [30, 18],
                iconAnchor: hasMarkerPriceState ? [24, 17] : [15, 9],
              }),
            );
          }

          const popupElement = event.popup?.getElement() as HTMLElement | null;
          const button = popupElement?.querySelector(
            "[data-booking-url]",
          ) as HTMLButtonElement | null;
          if (button) {
            button.onclick = (clickEvent) => {
              clickEvent.preventDefault();
              clickEvent.stopPropagation();
              onOpen(bookingUrl);
              marker.closePopup();
            };
          }

          const retryPriceButton = popupElement?.querySelector(
            "[data-retry-price]",
          ) as HTMLButtonElement | null;
          if (retryPriceButton) {
            retryPriceButton.onclick = (clickEvent) => {
              clickEvent.preventDefault();
              clickEvent.stopPropagation();
              triggerLightTapHaptic();
              onRetryPrice();
            };
          }

          const sliderTrack = popupElement?.querySelector(
            "[data-slider-track]",
          ) as HTMLElement | null;
          const sliderPrevButton = popupElement?.querySelector(
            "[data-slider-prev]",
          ) as HTMLButtonElement | null;
          const sliderNextButton = popupElement?.querySelector(
            "[data-slider-next]",
          ) as HTMLButtonElement | null;
          const sliderCounter = popupElement?.querySelector(
            "[data-slider-counter]",
          ) as HTMLElement | null;

          if (
            !sliderTrack ||
            !sliderPrevButton ||
            !sliderNextButton ||
            !sliderCounter ||
            imageUrls.length < 2
          ) {
            return;
          }

          let activeSlide = 0;
          const totalSlides = imageUrls.length;
          const updateSliderUi = () => {
            sliderTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
            sliderCounter.textContent = `${activeSlide + 1}/${totalSlides}`;
          };

          sliderPrevButton.onclick = (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            activeSlide = (activeSlide - 1 + totalSlides) % totalSlides;
            updateSliderUi();
          };

          sliderNextButton.onclick = (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            activeSlide = (activeSlide + 1) % totalSlides;
            updateSliderUi();
          };

          let touchStartX = 0;
          let touchStartY = 0;
          let touchHandled = false;

          sliderTrack.ontouchstart = (touchEvent) => {
            const touch = touchEvent.touches[0];
            if (!touch) return;
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchHandled = false;
          };

          sliderTrack.ontouchmove = (touchEvent) => {
            const touch = touchEvent.touches[0];
            if (!touch) return;
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);
            if (deltaX > deltaY) {
              touchEvent.preventDefault();
              touchEvent.stopPropagation();
            }
          };

          sliderTrack.ontouchend = (touchEvent) => {
            const touch = touchEvent.changedTouches[0];
            if (!touch) return;
            const deltaX = touch.clientX - touchStartX;
            const deltaY = Math.abs(touch.clientY - touchStartY);
            if (Math.abs(deltaX) < 35 || deltaY > 70 || touchHandled) return;
            touchHandled = true;
            if (deltaX < 0) {
              activeSlide = (activeSlide + 1) % totalSlides;
            } else {
              activeSlide = (activeSlide - 1 + totalSlides) % totalSlides;
            }
            updateSliderUi();
          };
        });

        marker.addTo(layerRef.current);
      });

      const snapshot = source.slice();
      reservationMapMarkersCache.splice(
        0,
        reservationMapMarkersCache.length,
        ...snapshot,
      );

      if (!userAdjustedViewRef.current) {
        autoFittingRef.current = true;
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [30, 30] });
        } else {
          mapRef.current.setView(CALPE_MAP_CENTER, CALPE_MAP_ZOOM);
        }
      }

      window.requestAnimationFrame(() => {
        mapRef.current?.invalidateSize();
        window.setTimeout(() => {
          autoFittingRef.current = false;
          mapRef.current?.invalidateSize();
        }, 250);
      });
    }

    void syncMarkers();

    return () => {
      cancelled = true;
    };
  }, [
    guestFilter,
    bookingEndDate,
    bookingStartDate,
    calculatingPriceLabel,
    isBookingPriceLoading,
    lang,
    moreInfoLabel,
    totalPriceLabel,
    guestPluralLabel,
    guestSingularLabel,
    nightPluralLabel,
    nightSingularLabel,
    bedroomsShortLabel,
    bathroomsShortLabel,
    onOpen,
    openInGoogleMapsLabel,
    properties,
    isMapReady,
    mapVisibilityEpoch,
  ]);

  useEffect(() => {
    return () => {
      layerRef.current?.clearLayers();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isExpanded || !mapRef.current) return;

    const timeoutId = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 520);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isExpanded]);

  return (
    <section className="mb-5 overflow-hidden rounded-[18px] border border-[#e3e0d7] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between border-b border-[#efe9db] px-5 py-4 text-left transition-colors hover:bg-[#fcfbf7]"
        aria-expanded={isExpanded}
        aria-label={title}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <h2 className="text-[18px] font-semibold text-[#2d2d2d]">
              {title}
            </h2>
            {hint && (
              <p className="mt-0.5 text-[12px] text-[#8c8576]">{hint}</p>
            )}
          </div>
        </div>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dcc0] bg-[#faf6eb] text-[#8f7130] transition-transform duration-500 ${isExpanded ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6.5L8 10.5L12 6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isExpanded ? "max-h-[460px] lg:max-h-[580px]" : "max-h-0"}`}
      >
        <div className="relative h-[340px] w-full bg-[#f3f1eb] sm:h-[400px] lg:h-[500px]">
          <div ref={mapNodeRef} className="h-full w-full bg-[#f3f1eb]" />
          <button
            type="button"
            className="absolute right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] z-[870] inline-flex max-w-[min(160px,calc(100%-5rem))] items-center gap-1.5 rounded-full border border-[#e7dcc0] bg-white/95 px-2.5 py-1.5 text-left text-[11px] font-semibold leading-tight text-[#5c4d27] shadow-sm backdrop-blur-sm transition hover:bg-white sm:max-w-[200px] sm:px-3 sm:text-[12px]"
            aria-label={recenterCalpeLabel}
            onClick={() => {
              const map = mapRef.current;
              if (!map) return;
              if (typeof map.flyTo === "function") {
                map.flyTo(CALPE_MAP_CENTER, CALPE_MAP_ZOOM, { duration: 0.55 });
              } else {
                map.setView(CALPE_MAP_CENTER, CALPE_MAP_ZOOM);
              }
            }}
          >
            <svg
              className="h-4 w-4 shrink-0 text-[#8f7130]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10z" />
              <circle cx="12" cy="11" r="2.25" />
            </svg>
            <span className="min-w-0 truncate">{recenterCalpeLabel}</span>
          </button>
          {isLoadingProperties && (
            <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e7dcc0] bg-white/95 px-3 py-1.5 text-[12px] font-medium text-[#8f7130] shadow-sm">
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border border-[#d8c188] border-t-[#c2a457]"
                  aria-hidden="true"
                />
                {loadingPropertiesLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

async function apiFetch(path: string): Promise<unknown> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const r = await fetch(API + normalizedPath, {
    headers: { accept: "application/json" },
  });
  if (!r.ok) {
    const retryAfterHeader = r.headers.get("retry-after");
    const retryAfterSeconds = retryAfterHeader
      ? Number.parseFloat(retryAfterHeader)
      : Number.NaN;
    const retryAfterMs = Number.isFinite(retryAfterSeconds)
      ? Math.max(0, retryAfterSeconds * 1000)
      : undefined;
    const error = new Error(`API ${r.status}`) as Error & {
      status?: number;
      retryAfterMs?: number;
    };
    error.status = r.status;
    error.retryAfterMs = retryAfterMs;
    throw error;
  }
  return r.json();
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildBookingUrl(
  propertyId: number,
  options?: {
    lang?: Lang;
    guests?: string;
    startDate?: string;
    endDate?: string;
  },
): string {
  const params = new URLSearchParams();
  if (options?.guests) params.set("guests", options.guests);
  if (options?.startDate) params.set("startDate", options.startDate);
  if (options?.endDate) params.set("endDate", options.endDate);
  const query = params.toString();
  const bookLang = BOOK_LANG_TO_PATH[options?.lang ?? "esp"] ?? "es";
  const baseUrl = `${BOOK}/${bookLang}/property/${propertyId}`;
  return query ? `${baseUrl}?${query}` : baseUrl;
}

function formatApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getTimeZoneDateParts(
  date: Date,
  timeZone: string,
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number.parseInt(parts.find((part) => part.type === type)?.value ?? "0", 10);

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hour: getPart("hour"),
    minute: getPart("minute"),
    second: getPart("second"),
  };
}

function getMadridNowWallClockMs(): number {
  const nowInMadrid = getTimeZoneDateParts(new Date(), "Europe/Madrid");
  return Date.UTC(
    nowInMadrid.year,
    nowInMadrid.month - 1,
    nowInMadrid.day,
    nowInMadrid.hour,
    nowInMadrid.minute,
    nowInMadrid.second,
  );
}

function getCheckInWallClockMs(date: Date, entryTime: string | null): number {
  const match = (entryTime ?? "16:00").match(/^(\d{1,2}):(\d{2})/);
  const hours = match ? Number.parseInt(match[1], 10) : 16;
  const minutes = match ? Number.parseInt(match[2], 10) : 0;

  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
  );
}

function hasMinimumCheckInNotice(
  checkInDate: Date,
  entryTime: string | null,
  minimumHours = 24,
): boolean {
  const checkInMs = getCheckInWallClockMs(checkInDate, entryTime);
  const nowMadridMs = getMadridNowWallClockMs();
  return checkInMs - nowMadridMs >= minimumHours * 60 * 60 * 1000;
}

function datesEqual(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const value = startOfDay(date).getTime();
  const startValue = startOfDay(start).getTime();
  const endValue = startOfDay(end).getTime();
  return (
    value >= Math.min(startValue, endValue) &&
    value <= Math.max(startValue, endValue)
  );
}

function parseDateInput(value: string): Date | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10) - 1;
  const year = Number.parseInt(match[3], 10);
  const parsed = new Date(year, month, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function formatDateInput(date: Date, lang: Lang): string {
  void lang;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function getMonthLabel(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LANG_TO_LOCALE[lang], {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getWeekdayLabels(lang: Lang): string[] {
  const baseMonday = new Date(Date.UTC(2024, 0, 1));
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(LANG_TO_LOCALE[lang], {
      weekday: "short",
    }).format(new Date(baseMonday.getTime() + index * 86400000)),
  );
}

function buildCalendarDays(visibleMonth: Date): Array<{
  date: Date;
  inCurrentMonth: boolean;
}> {
  const monthStart = startOfMonth(visibleMonth);
  const monthEnd = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  );
  const startOffset = (monthStart.getDay() + 6) % 7;
  const calendarStart = addDays(monthStart, -startOffset);
  const days: Array<{ date: Date; inCurrentMonth: boolean }> = [];

  for (let index = 0; index < 42; index += 1) {
    const date = addDays(calendarStart, index);
    days.push({
      date,
      inCurrentMonth:
        date.getMonth() === visibleMonth.getMonth() &&
        date.getFullYear() === visibleMonth.getFullYear(),
    });
    if (date > monthEnd && days.length >= 35 && date.getDay() === 0) {
      break;
    }
  }

  return days;
}

function getRetryDelayMs(err: unknown, attempt: number, baseMs = 1200): number {
  const retryAfterMs =
    err && typeof err === "object"
      ? (err as { retryAfterMs?: number }).retryAfterMs
      : undefined;
  if (typeof retryAfterMs === "number" && retryAfterMs > 0) {
    return retryAfterMs;
  }

  const status =
    err && typeof err === "object"
      ? (err as { status?: number }).status
      : undefined;
  if (status === 429) {
    const jitter = Math.floor(Math.random() * 400);
    return Math.min(12000, baseMs * 2 ** attempt) + jitter;
  }

  return 300 * (attempt + 1);
}

async function apiFetchWithRetry(path: string, retries = 3): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiFetch(path);
    } catch (err) {
      lastError = err;
      const status =
        err && typeof err === "object"
          ? (err as { status?: number }).status
          : undefined;
      if (attempt < retries) {
        await wait(getRetryDelayMs(err, attempt));
      } else if (status !== 429) {
        break;
      }
    }
  }
  throw lastError;
}

async function fetchAccommodationBatch(
  ids: number[],
): Promise<BatchDetailResponseItem[]> {
  const params = new URLSearchParams();
  ids.forEach((id) => {
    params.append("id", String(id));
  });

  const response = await fetch(`${DETAIL_BATCH_API}?${params.toString()}`, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    const error = new Error(`API ${response.status}`) as Error & {
      status?: number;
      retryAfterMs?: number;
    };
    error.status = response.status;

    const retryAfterHeader = response.headers.get("retry-after");
    const retryAfterSeconds = retryAfterHeader
      ? Number.parseFloat(retryAfterHeader)
      : Number.NaN;
    if (Number.isFinite(retryAfterSeconds)) {
      error.retryAfterMs = Math.max(0, retryAfterSeconds * 1000);
    }

    throw error;
  }

  const payload = (await response.json()) as {
    results?: BatchDetailResponseItem[];
  };

  return Array.isArray(payload.results) ? payload.results : [];
}

async function fetchBookingPricesForAccommodation(
  accommodationId: number,
  params: {
    checkinDate: string;
    checkoutDate: string;
    travelers: number;
  },
): Promise<BookingPriceItem[]> {
  const searchParams = new URLSearchParams({
    checkinDate: params.checkinDate,
    checkoutDate: params.checkoutDate,
    travelers: String(params.travelers),
  });

  const response = await apiFetchWithRetry(
    `/accommodations/${accommodationId}/booking-price/?${searchParams.toString()}`,
  );

  if (Array.isArray(response)) return response as BookingPriceItem[];
  if (response && typeof response === "object") {
    return [response as BookingPriceItem];
  }
  return [];
}

type QueueItem = {
  id: number;
  attempt: number;
  readyAt: number;
};

type AvailabilityCacheEntry = {
  available: boolean;
  startDate: string;
  endDate: string;
  fetchedAt: number;
  expiresAt: number;
};

type AvailabilityInFlightEntry = {
  promise: Promise<AvailabilityCacheEntry>;
};

type BatchDetailResponseItem = {
  id: number;
  ok: boolean;
  status: number;
  data?: RawProperty;
  error?: string;
  retryAfterMs?: number;
};

const DETAIL_BATCH_SIZE = 12;
const DETAIL_QUEUE_GAP_MS = 40;
const DETAIL_MAX_RETRIES = 4;
const DETAIL_429_BASE_COOLDOWN_MS = 900;
const DETAIL_429_MAX_COOLDOWN_MS = 5000;
const SEARCH_BATCH_SIZE = 8;
const SEARCH_QUEUE_GAP_MS = 40;
const SEARCH_MAX_RETRIES = 4;
const SEARCH_429_BASE_COOLDOWN_MS = 900;
const SEARCH_429_MAX_COOLDOWN_MS = 5000;
const AVAILABILITY_CACHE_TTL_MS = 5 * 60 * 1000;
const AVAILABILITY_CACHE_MAX_ENTRIES = 3000;

const availabilityCache = new Map<string, AvailabilityCacheEntry>();
const availabilityInFlight = new Map<string, AvailabilityInFlightEntry>();

function getBatchCooldownMs(hitRateLimit: boolean, streak: number): number {
  if (!hitRateLimit) return DETAIL_QUEUE_GAP_MS;
  return Math.min(
    DETAIL_429_MAX_COOLDOWN_MS,
    DETAIL_429_BASE_COOLDOWN_MS * 2 ** Math.max(0, streak - 1),
  );
}

function getSearchCooldownMs(hitRateLimit: boolean, streak: number): number {
  if (!hitRateLimit) return SEARCH_QUEUE_GAP_MS;
  return Math.min(
    SEARCH_429_MAX_COOLDOWN_MS,
    SEARCH_429_BASE_COOLDOWN_MS * 2 ** Math.max(0, streak - 1),
  );
}

function buildAvailabilityCacheKey(
  propertyId: number,
  startDate: string,
  endDate: string,
): string {
  return `${propertyId}:${startDate}:${endDate}`;
}

function parseAvailabilityResponse(payload: unknown): boolean {
  if (typeof payload === "number") return payload === 1;
  if (typeof payload === "boolean") return payload;
  if (typeof payload === "string") {
    const normalized = payload.trim();
    if (normalized === "1") return true;
    if (normalized === "0") return false;
  }
  if (payload && typeof payload === "object") {
    const candidate = payload as Record<string, unknown>;
    if (typeof candidate.available === "boolean") return candidate.available;
    if (typeof candidate.isAvailable === "boolean") return candidate.isAvailable;
    if (typeof candidate.value === "number") return candidate.value === 1;
  }
  throw new Error("Unexpected availability payload");
}

function formatApiDateForDisplay(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function parseApiDate(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10) - 1;
  const day = Number.parseInt(match[3], 10);
  const parsed = new Date(year, month, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function pruneAvailabilityCache(now = Date.now()): void {
  availabilityCache.forEach((entry, cacheKey) => {
    if (entry.expiresAt <= now) {
      availabilityCache.delete(cacheKey);
    }
  });

  if (availabilityCache.size <= AVAILABILITY_CACHE_MAX_ENTRIES) return;

  const oldestFirst = [...availabilityCache.entries()].sort(
    (a, b) => a[1].fetchedAt - b[1].fetchedAt,
  );
  const excess = availabilityCache.size - AVAILABILITY_CACHE_MAX_ENTRIES;
  oldestFirst.slice(0, excess).forEach(([cacheKey]) => {
    availabilityCache.delete(cacheKey);
  });
}

function getFreshAvailabilityCacheForRange(
  propertyId: number,
  startDate: Date,
  endDate: Date,
  now = Date.now(),
): AvailabilityCacheEntry | null {
  const startKey = formatApiDate(startOfDay(startDate));
  const endKey = formatApiDate(startOfDay(endDate));
  const cacheKey = buildAvailabilityCacheKey(propertyId, startKey, endKey);
  const entry = availabilityCache.get(cacheKey);
  if (!entry) return null;
  if (entry.expiresAt <= now) {
    availabilityCache.delete(cacheKey);
    return null;
  }
  return entry;
}

async function fetchAvailabilityForProperty(
  propertyId: number,
  startDate: Date,
  endDate: Date,
): Promise<AvailabilityCacheEntry> {
  const startKey = formatApiDate(startOfDay(startDate));
  const endKey = formatApiDate(startOfDay(endDate));
  const cacheKey = buildAvailabilityCacheKey(propertyId, startKey, endKey);
  const now = Date.now();
  pruneAvailabilityCache(now);
  const cached = getFreshAvailabilityCacheForRange(propertyId, startDate, endDate, now);
  if (cached) return cached;

  const inFlight = availabilityInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight.promise;
  }

  const requestPromise = (async () => {
    const payload = await apiFetch(
      `/accommodations/${propertyId}/availability/?startDate=${startKey}&endDate=${endKey}`,
    );
    const available = parseAvailabilityResponse(payload);
    const fetchedAt = Date.now();
    const entry: AvailabilityCacheEntry = {
      available,
      startDate: startKey,
      endDate: endKey,
      fetchedAt,
      expiresAt: fetchedAt + AVAILABILITY_CACHE_TTL_MS,
    };
    availabilityCache.set(cacheKey, entry);
    pruneAvailabilityCache(fetchedAt);
    return entry;
  })();

  availabilityInFlight.set(cacheKey, { promise: requestPromise });
  try {
    return await requestPromise;
  } finally {
    const activeRequest = availabilityInFlight.get(cacheKey);
    if (activeRequest?.promise === requestPromise) {
      availabilityInFlight.delete(cacheKey);
    }
  }
}

function CardCarousel({
  images,
  name,
  previousPhotoLabel,
  nextPhotoLabel,
}: {
  images: Property["images"];
  name: string;
  previousPhotoLabel: string;
  nextPhotoLabel: string;
}) {
  const [idx, setIdx] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const gallery = (images ?? []).filter((img) => Boolean(img.SMALL));

  if (!gallery.length) return <div className="w-full h-full bg-gray-100" />;
  const safeIdx = idx % gallery.length;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + gallery.length) % gallery.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % gallery.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gallery.length <= 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gallery.length <= 1) return;
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    e.stopPropagation();
    if (dx < 0) {
      setIdx((i) => (i + 1) % gallery.length);
    } else {
      setIdx((i) => (i - 1 + gallery.length) % gallery.length);
    }
  };

  return (
    <div
      className="relative h-full w-full touch-pan-y group"
      data-idx={safeIdx}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => e.stopPropagation()}
    >
      {gallery.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${img.SMALL}-${i}`}
          src={img.SMALL}
          alt={name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${i === safeIdx ? "opacity-100 on" : "opacity-0"}`}
        />
      ))}
      <>
        <button
          onClick={prev}
          disabled={gallery.length <= 1}
          className="absolute z-30 left-3 top-1/2 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-md text-base font-bold text-gray-700 opacity-95 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ transform: "translateY(-50%)" }}
          aria-label={previousPhotoLabel}
        >
          &#8249;
        </button>
        <button
          onClick={next}
          disabled={gallery.length <= 1}
          className="absolute z-30 right-3 top-1/2 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-md text-base font-bold text-gray-700 opacity-95 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ transform: "translateY(-50%)" }}
          aria-label={nextPhotoLabel}
        >
          &#8250;
        </button>
        {gallery.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {gallery.map((_, i) => (
              <span
                key={i}
                className={`block w-1.5 h-1.5 rounded-full transition-colors ${i === safeIdx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </>
    </div>
  );
}

function StatItem({
  icon,
  text,
  loading = false,
}: {
  icon: React.ReactNode;
  text: string;
  loading?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "12px",
        color: "#555",
      }}
    >
      {icon}
      {loading ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "18px",
            height: "18px",
          }}
        >
          <span className="block h-3 w-3 animate-spin rounded-full border border-[#c2a457]/40 border-t-[#c2a457]" />
        </span>
      ) : (
        text
      )}
    </span>
  );
}

// â”€â”€â”€ PropertyCard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ShareGlyph({ className }: { className?: string }) {
  return (
    <Image
      src="/share.png"
      alt=""
      width={18}
      height={18}
      className={`object-contain ${className ?? ""}`.trim()}
      aria-hidden
    />
  );
}

function ShareMenuIconBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "wa" | "x" | "fb" | "link";
}) {
  const bg =
    tone === "wa"
      ? "bg-[#e6faf0]"
      : tone === "x"
        ? "bg-[#f0f0f0]"
        : tone === "fb"
          ? "bg-[#e8f2fe]"
          : "bg-[#eef5fc]";
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-black/6 ${bg}`}
      aria-hidden
    >
      {children}
    </span>
  );
}

function ShareMenuIconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path
        fill="#25D366"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.822 11.822 0 0020.885 3.353z"
      />
    </svg>
  );
}

function ShareMenuIconX() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path
        fill="#0f1419"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function ShareMenuIconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078V7.161h3.047V5.593c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function ShareMenuIconCopyLink() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px] text-[#2a5580]"
      aria-hidden
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      />
    </svg>
  );
}

function PropertyShareButton({
  bookingUrl,
  title,
  shareAria,
  menuHeading,
  copyLinkLabel,
  copiedLabel,
  messageLead,
}: {
  bookingUrl: string;
  title: string;
  shareAria: string;
  menuHeading: string;
  copyLinkLabel: string;
  copiedLabel: string;
  messageLead: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const shareText = `${messageLead}\n${title}\n${bookingUrl}`;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(bookingUrl);
  const waHref = `https://wa.me/?text=${encodedText}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodedText}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const shareMenuRowBaseClass =
    "flex w-full items-center justify-start gap-3 rounded-xl px-4 py-2.5 text-left text-[13px] font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b6d3f0]/90 focus-visible:ring-offset-1";
  const shareMenuRowXClass = `${shareMenuRowBaseClass} bg-[#f4f4f5] text-[#0f1419] hover:bg-[#e9e9eb] active:bg-[#dedee1]`;
  const shareMenuRowFbClass = `${shareMenuRowBaseClass} bg-[#eef5fe] text-[#1447a0] hover:bg-[#e2ecfc] active:bg-[#d5e3f8]`;
  const shareMenuRowWaClass = `${shareMenuRowBaseClass} bg-[#e8faf0] text-[#146b45] hover:bg-[#d9f5e6] active:bg-[#c9eedc]`;
  const shareMenuRowLinkClass = `${shareMenuRowBaseClass} bg-[#f0f6fc] text-[#2a5580] hover:bg-[#e2eef8] active:bg-[#d4e6f5]`;

  return (
    <div ref={wrapRef} className="relative shrink-0 self-stretch">
      <button
        type="button"
        aria-label={shareAria}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-full min-h-[42px] w-11 items-center justify-center rounded-[10px] border border-[#b6d3f0] bg-[#e8f2fc] text-[#2a5580] transition hover:bg-[#dbe9ff] active:bg-[#d0e4f8]"
        onClick={(e) => {
          e.stopPropagation();
          triggerLightTapHaptic();
          setOpen((v) => !v);
        }}
      >
        <ShareGlyph />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute bottom-full right-0 z-[80] mb-2 flex w-[min(268px,calc(100vw-2rem))] flex-col items-stretch gap-0.5 overflow-hidden rounded-2xl border border-[#d4e4f4] bg-white px-2 py-3 text-left shadow-[0_16px_48px_rgba(15,40,71,0.16)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-1 w-full px-4 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6a7f95]">
            {menuHeading}
          </div>
          <a
            role="menuitem"
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            className={shareMenuRowXClass}
            onClick={() => {
              triggerLightTapHaptic();
              setOpen(false);
            }}
          >
            <ShareMenuIconBadge tone="x">
              <ShareMenuIconX />
            </ShareMenuIconBadge>
            <span>X</span>
          </a>
          <a
            role="menuitem"
            href={fbHref}
            target="_blank"
            rel="noopener noreferrer"
            className={shareMenuRowFbClass}
            onClick={() => {
              triggerLightTapHaptic();
              setOpen(false);
            }}
          >
            <ShareMenuIconBadge tone="fb">
              <ShareMenuIconFacebook />
            </ShareMenuIconBadge>
            <span>Facebook</span>
          </a>
          <a
            role="menuitem"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={shareMenuRowWaClass}
            onClick={() => {
              triggerLightTapHaptic();
              setOpen(false);
            }}
          >
            <ShareMenuIconBadge tone="wa">
              <ShareMenuIconWhatsApp />
            </ShareMenuIconBadge>
            <span>WhatsApp</span>
          </a>
          <button
            type="button"
            role="menuitem"
            className={shareMenuRowLinkClass}
            onClick={async (e) => {
              e.stopPropagation();
              triggerLightTapHaptic();
              try {
                await navigator.clipboard.writeText(bookingUrl);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              } catch {
                /* ignore */
              }
            }}
          >
            <ShareMenuIconBadge tone="link">
              <ShareMenuIconCopyLink />
            </ShareMenuIconBadge>
            <span>{copied ? copiedLabel : copyLinkLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function PropertyCard({
  prop,
  bookingUrl,
  onRetry,
  onRetryPrice,
  onOpen,
  lang,
  propertyFallbackLabel,
  loadingDataLabel,
  retryLabel,
  previousPhotoLabel,
  nextPhotoLabel,
  bedroomsShortLabel,
  bedsLabel,
  bathroomsLabel,
  viewInfoLabel,
  totalPriceLabel,
  totalPriceNightsLabel,
  calculatingPriceLabel,
  retryPriceLabel,
  bookingPriceLoading,
  sharePropertyAriaLabel,
  shareMenuHeadingLabel,
  shareCopyLinkLabel,
  shareCopiedLabel,
  shareMessageLeadLabel,
}: {
  prop: Property;
  bookingUrl: string;
  onRetry: (id: number) => void;
  onRetryPrice: () => void;
  onOpen: (url: string) => void;
  lang: Lang;
  propertyFallbackLabel: string;
  loadingDataLabel: string;
  retryLabel: string;
  previousPhotoLabel: string;
  nextPhotoLabel: string;
  bedroomsShortLabel: string;
  bedsLabel: string;
  bathroomsLabel: string;
  viewInfoLabel: string;
  totalPriceLabel: string;
  totalPriceNightsLabel: string | null;
  calculatingPriceLabel: string;
  retryPriceLabel: string;
  bookingPriceLoading: boolean;
  sharePropertyAriaLabel: string;
  shareMenuHeadingLabel: string;
  shareCopyLinkLabel: string;
  shareCopiedLabel: string;
  shareMessageLeadLabel: string;
}) {
  const feats = getTopFeats(prop.features);
  const title = prop.name || `${propertyFallbackLabel} #${prop.id}`;
  const location =
    prop.city && prop.region
      ? `${prop.city} (${prop.region})`
      : loadingDataLabel;
  const isPending =
    !prop.images.length &&
    !prop.capacity &&
    !prop.bedrooms &&
    !prop.beds &&
    !prop.bathrooms &&
    !prop.sqm;
  const canRetry = isPending && prop.id > 0;
  const showStatsLoading = isPending;
  const hasBookingPrice =
    typeof prop.bookingPriceTotal === "number" && prop.bookingPriceTotal > 0;
  const showBookingPriceLoading = bookingPriceLoading && !hasBookingPrice;
  const showBookingPriceRetry =
    prop.bookingPriceStatus === "ERROR" && !bookingPriceLoading;
  const showBookingPricePending =
    totalPriceNightsLabel !== null &&
    !hasBookingPrice &&
    !showBookingPriceRetry;
  const shouldShowBookingPriceBox =
    totalPriceNightsLabel !== null ||
    showBookingPriceLoading ||
    showBookingPriceRetry ||
    showBookingPricePending ||
    hasBookingPrice;
  const [showRetryButton, setShowRetryButton] = useState(false);

  useEffect(() => {
    if (!canRetry) {
      setShowRetryButton(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowRetryButton(true);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canRetry, prop.id]);

  return (
    <div
      className="group overflow-hidden border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
      style={{ borderRadius: "12px" }}
    >
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ height: "180px" }}
      >
        <CardCarousel
          images={prop.images}
          name={prop.name}
          previousPhotoLabel={previousPhotoLabel}
          nextPhotoLabel={nextPhotoLabel}
        />
        {canRetry && showRetryButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRetry(prop.id);
            }}
            aria-label={retryLabel}
            className="absolute left-1/2 top-1/2 z-40 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#7f9cbe]/72 text-white shadow-lg backdrop-blur-sm hover:bg-[#738fb0]/80 active:bg-[#6883a4]/86"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8a5 5 0 1 1 1.46 3.54"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 5v3h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        tabIndex={0}
        onClick={() => onOpen(bookingUrl)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(bookingUrl);
          }
        }}
        className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2a457] focus-visible:ring-offset-2"
        style={{
          padding: "14px 16px 16px",
          minHeight: "168px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#111",
            margin: "0 0 2px",
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "13px", color: "#777", margin: "0 0 12px" }}>
          {location}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: "12px",
            color: "#555",
            marginBottom: "12px",
            alignItems: "center",
            minHeight: "18px",
          }}
        >
          {(showStatsLoading || prop.capacity > 0) && (
            <StatItem
              text={`${prop.capacity}`}
              loading={showStatsLoading}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="5"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          )}
          {(showStatsLoading || prop.bedrooms > 0) && (
            <StatItem
              text={`${prop.bedrooms} ${bedroomsShortLabel}`}
              loading={showStatsLoading}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="4"
                    width="12"
                    height="9"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              }
            />
          )}
          {(showStatsLoading || prop.beds > 0) && (
            <StatItem
              text={`${prop.beds} ${bedsLabel}`}
              loading={showStatsLoading}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="6"
                    width="10"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4 6V4a2 2 0 014 0v2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              }
            />
          )}
          {(showStatsLoading || prop.bathrooms > 0) && (
            <StatItem
              text={`${prop.bathrooms} ${bathroomsLabel}`}
              loading={showStatsLoading}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="12"
                    height="12"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M8 6v4M6 10h4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          )}
          {(showStatsLoading || prop.sqm > 0) && (
            <StatItem
              text={`${prop.sqm} m²`}
              loading={showStatsLoading}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="12"
                    height="12"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M2 6h12M6 2v12"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              }
            />
          )}
        </div>
        {(showStatsLoading || feats.length > 0) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              minHeight: "62px",
              alignContent: "flex-start",
            }}
          >
            {showStatsLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <span
                    key={`feat-placeholder-${index}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      minWidth: index === 5 ? "38px" : "64px",
                      height: "28px",
                      padding: "4px 10px",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      color: "#555",
                    }}
                  >
                    <span className="block h-3 w-3 rounded-full bg-[#ece7d8]" />
                    <span className="block h-3 w-8 animate-pulse rounded-full bg-[#ece7d8]" />
                  </span>
                ))
              : feats.slice(0, 6).map((f) => (
                  <span
                    key={f}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      padding: "4px 10px",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      color: "#555",
                    }}
                  >
                    <AmenityIcon feature={f} />
                    {getAmenityLabel(f, lang)}
                  </span>
                ))}
            {!showStatsLoading && feats.length > 6 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  padding: "4px 10px",
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  color: "#555",
                }}
              >
                +{feats.length - 6}
              </span>
            )}
          </div>
        )}
        {shouldShowBookingPriceBox && (
          <div className="mt-3 rounded-[10px] border border-[#eadfbf] bg-[#fbf7eb] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8f7130]">
                {totalPriceLabel}
              </p>
              {totalPriceNightsLabel && (
                <span className="inline-flex items-center rounded-full border border-[#e2cf96] bg-[#f3e7bf] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#7f6630]">
                  {totalPriceNightsLabel}
                </span>
              )}
            </div>
            {showBookingPriceLoading || showBookingPricePending ? (
              <div className="mt-1 flex items-center justify-center gap-2 text-[#8f7130]">
                {showBookingPriceLoading && (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-[#e4d4a6] border-t-[#c2a457]"
                    aria-hidden="true"
                  />
                )}
                <span className="text-[13px] font-medium">
                  {calculatingPriceLabel}
                </span>
              </div>
            ) : showBookingPriceRetry ? (
              <div className="mt-1 flex items-center justify-center">
                <button
                  type="button"
                  aria-label={retryPriceLabel}
                  className="inline-flex items-center gap-2 rounded-full border border-[#b8d7f3] bg-[#e8f4ff] px-3 py-1.5 text-[12px] font-semibold text-[#4e86b7] transition hover:bg-[#d9ecff]"
                  onClick={(event) => {
                    event.stopPropagation();
                    triggerLightTapHaptic();
                    onRetryPrice();
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M13 8a5 5 0 1 1-1.46-3.54"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 3v3h-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{retryPriceLabel}</span>
                </button>
              </div>
            ) : (
              <p className="mt-0.5 text-center text-[18px] font-semibold text-[#2d2d2d]">
                {formatCurrencyAmount(prop.bookingPriceTotal as number, lang)}
              </p>
            )}
          </div>
        )}
        <div className="mt-auto flex min-h-[42px] items-stretch gap-2 pt-2 md:hidden">
          <button
            type="button"
            className="min-w-0 flex-1 rounded-[10px] border border-[#b6d3f0] bg-[#e8f2fc] py-2.5 text-center text-[13px] font-semibold text-[#2a5580] transition hover:bg-[#dbe9ff] active:bg-[#d0e4f8]"
            onClick={(e) => {
              e.stopPropagation();
              triggerLightTapHaptic();
              onOpen(bookingUrl);
            }}
          >
            {viewInfoLabel}
          </button>
          <PropertyShareButton
            bookingUrl={bookingUrl}
            title={title}
            shareAria={sharePropertyAriaLabel}
            menuHeading={shareMenuHeadingLabel}
            copyLinkLabel={shareCopyLinkLabel}
            copiedLabel={shareCopiedLabel}
            messageLead={shareMessageLeadLabel}
          />
        </div>
      </div>
    </div>
  );
}

function DatePickerPopover({
  lang,
  visibleMonth,
  selectedDate,
  minDate,
  highlightToday = true,
  rangeStart,
  rangeEnd,
  previewRangeEnd,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onPreviewDate,
}: {
  lang: Lang;
  visibleMonth: Date;
  selectedDate: Date | null;
  minDate?: Date | null;
  highlightToday?: boolean;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  previewRangeEnd?: Date | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
  onPreviewDate?: (date: Date | null) => void;
}) {
  const days = buildCalendarDays(visibleMonth);
  const today = startOfDay(new Date());
  const weekdayLabels = getWeekdayLabels(lang);
  const min = minDate ? startOfDay(minDate) : null;

  return (
    <div className="absolute left-0 top-[calc(100%+10px)] z-[1200] w-[320px] max-w-[calc(100vw-2rem)] rounded-[24px] border border-[#e8e8e8] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ececec] text-[#2d2d2d] transition hover:border-[#d2d2d2] hover:bg-[#f7f7f7]"
          aria-label="Previous month"
        >
          <span aria-hidden>‹</span>
        </button>
        <div className="text-[15px] font-semibold capitalize text-[#2d2d2d]">
          {getMonthLabel(visibleMonth, lang)}
        </div>
        <button
          type="button"
          onClick={onNextMonth}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ececec] text-[#2d2d2d] transition hover:border-[#d2d2d2] hover:bg-[#f7f7f7]"
          aria-label="Next month"
        >
          <span aria-hidden>›</span>
        </button>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8e8e8e]">
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, inCurrentMonth }) => {
          const normalizedDate = startOfDay(date);
          const isSelected = selectedDate
            ? datesEqual(normalizedDate, selectedDate)
            : false;
          const isToday = highlightToday && datesEqual(normalizedDate, today);
          const isDisabled = min ? normalizedDate < min : false;
          const activeRangeEnd = previewRangeEnd || rangeEnd;
          const isInRange =
            rangeStart && activeRangeEnd
              ? isDateInRange(normalizedDate, rangeStart, activeRangeEnd)
              : false;
          const isRangeStart = rangeStart
            ? datesEqual(normalizedDate, rangeStart)
            : false;
          const isRangeEnd = activeRangeEnd
            ? datesEqual(normalizedDate, activeRangeEnd)
            : false;

          return (
            <button
              key={normalizedDate.toISOString()}
              type="button"
              onClick={() => onSelectDate(normalizedDate)}
              onMouseEnter={() => onPreviewDate?.(normalizedDate)}
              onFocus={() => onPreviewDate?.(normalizedDate)}
              onMouseLeave={() => onPreviewDate?.(null)}
              disabled={isDisabled}
              className={`h-10 rounded-full text-[14px] font-medium transition ${
                isSelected
                  ? "bg-[#1f1f1f] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                  : isRangeStart || isRangeEnd
                    ? "bg-[#82aee8] text-white"
                    : isInRange
                      ? "bg-[#dbe9ff] text-[#3f6ea8]"
                      : isToday
                        ? "border border-[#82aee8] bg-white text-[#3f6ea8] hover:bg-[#f3f8ff]"
                        : "text-[#2d2d2d] hover:bg-[#f3f3f3]"
              } ${inCurrentMonth ? "" : "text-[#c2c2c2]"} ${isDisabled ? "cursor-not-allowed opacity-35" : ""}`}
            >
              {normalizedDate.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// â”€â”€â”€ GalleryModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const reservationPropertiesCache: Property[] = [];

/** Last map markers shown; survives tab backgrounding so we can redraw if Leaflet drops layers. */
const reservationMapMarkersCache: MappedProperty[] = [];

function isPropertyDetailsPending(prop: Property): boolean {
  return (
    prop.id < 0 ||
    (!prop.images.length &&
      !prop.capacity &&
      !prop.bedrooms &&
      !prop.beds &&
      !prop.bathrooms &&
      !prop.sqm &&
      !prop.loadError)
  );
}

export default function ReservaDirectaV2Content() {
  const lang = useLangStore((s) => s.lang);
  const checkInLabel = bookingSearchTranslations.checkIn[lang];
  const checkOutLabel = bookingSearchTranslations.checkOut[lang];
  const guestsLabel = bookingSearchTranslations.guests[lang];
  const searchLabel = bookingSearchTranslations.search[lang];
  const resetLabel = bookingSearchTranslations.reset[lang];
  const missingDateLabel = bookingSearchTranslations.missingDate[lang];
  const datePlaceholderLabel = bookingSearchTranslations.datePlaceholder[lang];
  const guestSingularLabel = bookingSearchTranslations.guestSingular[lang];
  const guestPluralLabel = bookingSearchTranslations.guestPlural[lang];
  const staysInCalpeLabel = bookingResultsTranslations.staysInCalpe[lang];
  const loadingPropertiesLabel =
    bookingResultsTranslations.loadingProperties[lang];
  const loadErrorLabel = bookingResultsTranslations.loadError[lang];
  const showingSearchResultsLabel =
    bookingResultsTranslations.showingSearchResults[lang];
  const viewAllLabel = bookingResultsTranslations.viewAll[lang];
  const noSearchResultsTemplate =
    bookingResultsTranslations.noSearchResults[lang];
  const nightSingularLabel = bookingResultsTranslations.nightSingular[lang];
  const nightPluralLabel = bookingResultsTranslations.nightPlural[lang];
  const mapTitleLabel = bookingResultsTranslations.mapTitle[lang];
  const mapHintLabel = bookingResultsTranslations.mapHint[lang];
  const mapRecenterCalpeLabel =
    bookingResultsTranslations.mapRecenterCalpe[lang];
  const openInGoogleMapsLabel =
    bookingResultsTranslations.openInGoogleMaps[lang];
  const mapMoreInfoLabel = bookingResultsTranslations.moreInfo[lang];
  const propertyFallbackLabel = propertyCardTranslations.propertyFallback[lang];
  const cardLoadingDataLabel = propertyCardTranslations.loadingData[lang];
  const retryLabel = propertyCardTranslations.retry[lang];
  const previousPhotoLabel = propertyCardTranslations.previousPhoto[lang];
  const nextPhotoLabel = propertyCardTranslations.nextPhoto[lang];
  const bedroomsShortLabel = propertyCardTranslations.bedroomsShort[lang];
  const bathroomsShortLabel = propertyCardTranslations.bathroomsShort[lang];
  const bedsLabel = propertyCardTranslations.beds[lang];
  const bathroomsLabel = propertyCardTranslations.bathrooms[lang];
  const viewInfoLabel = propertyCardTranslations.viewInfo[lang];
  const totalPriceLabel = propertyCardTranslations.totalPrice[lang];
  const calculatingPriceLabel = propertyCardTranslations.calculatingPrice[lang];
  const retryPriceLabel = propertyCardTranslations.retryPrice[lang];
  const sharePropertyAriaLabel =
    propertyCardTranslations.sharePropertyAria[lang];
  const shareMenuHeadingLabel = propertyCardTranslations.shareMenuHeading[lang];
  const shareCopyLinkLabel = propertyCardTranslations.shareCopyLink[lang];
  const shareCopiedLabel = propertyCardTranslations.shareCopied[lang];
  const shareMessageLeadLabel = propertyCardTranslations.shareMessageLead[lang];
  const [propertiesState, setPropertiesState] = useState<Property[]>(() => [
    ...reservationPropertiesCache,
  ]);
  const [loading, setLoading] = useState(
    () => reservationPropertiesCache.length === 0,
  );
  const [error, setError] = useState(false);
  const [guestFilter, setGuestFilter] = useState("2");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState<
    "checkIn" | "checkOut" | null
  >(null);
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    startOfMonth(new Date()),
  );
  const [checkoutPreviewDate, setCheckoutPreviewDate] = useState<Date | null>(
    null,
  );
  const [searchGuestCount, setSearchGuestCount] = useState<number | null>(null);
  const [searchAvailableIds, setSearchAvailableIds] =
    useState<Set<number> | null>(null);
  const [searchDateRange, setSearchDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [isSearchRunning, setIsSearchRunning] = useState(false);
  const [isBookingPriceLoading, setIsBookingPriceLoading] = useState(false);
  const [searchButtonErrorFlash, setSearchButtonErrorFlash] = useState(false);
  const searchButtonErrorTimeoutRef = useRef<number | null>(null);
  const [showMissingCheckInError, setShowMissingCheckInError] = useState(false);
  const [showMissingCheckOutError, setShowMissingCheckOutError] =
    useState(false);
  const searchSequenceRef = useRef(0);
  const calendarRef = useRef<HTMLDivElement>(null);
  const guestMenuRef = useRef<HTMLDivElement>(null);
  const properties = propertiesState;
  const parsedCheckIn = parseDateInput(checkIn);
  const parsedCheckOut = parseDateInput(checkOut);
  function openBookingUrl(bookingUrl: string) {
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  }
  const selectedGuestCount = Number.parseInt(guestFilter, 10) || 2;
  const selectedGuestLabel = `${selectedGuestCount} ${
    selectedGuestCount === 1 ? guestSingularLabel : guestPluralLabel
  }`;

  function setProperties(
    value: Property[] | ((prev: Property[]) => Property[]),
  ) {
    setPropertiesState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      reservationPropertiesCache.splice(
        0,
        reservationPropertiesCache.length,
        ...next,
      );
      return next;
    });
  }

  async function loadBookingPricesForPropertyIds(
    propertyIds: Set<number>,
    params: {
      checkinDate: string;
      checkoutDate: string;
      travelers: number;
    },
    sequence: number,
  ) {
    if (propertyIds.size === 0) return;

    setIsBookingPriceLoading(true);
    try {
      const queue: QueueItem[] = Array.from(propertyIds).map((id) => ({
        id,
        attempt: 0,
        readyAt: Date.now(),
      }));
      let rateLimitStreak = 0;

      while (queue.length > 0) {
        if (searchSequenceRef.current !== sequence) return;

        queue.sort((a, b) => a.readyAt - b.readyAt);
        const firstReadyAt = queue[0]?.readyAt;
        if (typeof firstReadyAt !== "number") break;

        const delayUntilReady = firstReadyAt - Date.now();
        if (delayUntilReady > 0) {
          await wait(delayUntilReady);
          if (searchSequenceRef.current !== sequence) return;
        }

        const readyItems: QueueItem[] = [];
        const now = Date.now();
        while (
          queue.length > 0 &&
          readyItems.length < SEARCH_BATCH_SIZE &&
          queue[0] &&
          queue[0].readyAt <= now
        ) {
          const nextItem = queue.shift();
          if (nextItem) readyItems.push(nextItem);
        }

        if (readyItems.length === 0) continue;

        const results = await Promise.all(
          readyItems.map(async (item) => {
            try {
              const bookingPrices = await fetchBookingPricesForAccommodation(
                item.id,
                params,
              );
              return { item, bookingPrices };
            } catch (error) {
              return { item, error };
            }
          }),
        );

        if (searchSequenceRef.current !== sequence) return;

        let hitRateLimit = false;

        results.forEach(({ item, bookingPrices, error }) => {
          if (!error && bookingPrices) {
            setProperties((prev) =>
              prev.map((prop) => {
                if (prop.id !== item.id) return prop;
                const [merged] = mergeBookingPricesIntoProperties(
                  [prop],
                  bookingPrices,
                );
                return merged ?? prop;
              }),
            );
            return;
          }

          const status =
            error && typeof error === "object"
              ? (error as { status?: number }).status
              : undefined;
          if (status === 429) {
            hitRateLimit = true;
          }

          if (status === 429 && item.attempt < SEARCH_MAX_RETRIES) {
            queue.push({
              id: item.id,
              attempt: item.attempt + 1,
              readyAt: Date.now() + getRetryDelayMs(error, item.attempt),
            });
            return;
          }

          setProperties((prev) =>
            markBookingPriceErrorForProperties(prev, new Set([item.id])),
          );
        });

        if (queue.length > 0) {
          rateLimitStreak = hitRateLimit ? rateLimitStreak + 1 : 0;
          await wait(getSearchCooldownMs(hitRateLimit, rateLimitStreak));
        }
      }
    } catch {
      if (searchSequenceRef.current !== sequence) return;
      setProperties((prev) =>
        markBookingPriceErrorForProperties(prev, propertyIds),
      );
    } finally {
      if (searchSequenceRef.current === sequence) {
        setIsBookingPriceLoading(false);
      }
    }
  }

  function retryBookingPrices() {
    if (!searchDateRange) return;

    const propertyIds = new Set(filtered.map((prop) => prop.id));
    void loadBookingPricesForPropertyIds(
      propertyIds,
      {
        checkinDate: searchDateRange.startDate,
        checkoutDate: searchDateRange.endDate,
        travelers: Number.parseInt(activeGuestFilter, 10) || 2,
      },
      searchSequenceRef.current,
    );
  }

  function openCalendar(target: "checkIn" | "checkOut") {
    const selectedDate = target === "checkIn" ? parsedCheckIn : parsedCheckOut;
    const fallbackDate =
      target === "checkOut"
        ? parsedCheckOut || parsedCheckIn || new Date()
        : parsedCheckIn || new Date();
    setIsGuestMenuOpen(false);
    setVisibleMonth(startOfMonth(selectedDate || fallbackDate));
    setCheckoutPreviewDate(target === "checkOut" ? parsedCheckOut : null);
    setOpenDatePicker(target);
  }

  function toggleCalendar(target: "checkIn" | "checkOut") {
    if (openDatePicker === target) {
      setCheckoutPreviewDate(null);
      setOpenDatePicker(null);
      return;
    }
    openCalendar(target);
  }

  function toggleGuestMenu() {
    if (isGuestMenuOpen) {
      setIsGuestMenuOpen(false);
      return;
    }
    setCheckoutPreviewDate(null);
    setOpenDatePicker(null);
    setIsGuestMenuOpen(true);
  }

  function handleDateSelection(target: "checkIn" | "checkOut", date: Date) {
    const formatted = formatDateInput(date, lang);

    if (target === "checkIn") {
      setShowMissingCheckInError(false);
      setCheckIn(formatted);
      if (parsedCheckOut && date >= parsedCheckOut) {
        setCheckOut("");
      }
      setVisibleMonth(startOfMonth(date));
      setCheckoutPreviewDate(null);
      setOpenDatePicker(null);
      return;
    }

    setShowMissingCheckOutError(false);
    if (parsedCheckIn && date <= parsedCheckIn) {
      setCheckOut(formatDateInput(addDays(parsedCheckIn, 1), lang));
    } else {
      setCheckOut(formatted);
    }
    setCheckoutPreviewDate(null);
    setOpenDatePicker(null);
  }

  async function runSearch() {
    const isCheckInMissing = !parsedCheckIn;
    const isCheckOutMissing = !parsedCheckOut;
    setShowMissingCheckInError(isCheckInMissing);
    setShowMissingCheckOutError(isCheckOutMissing);
    if (isCheckInMissing || isCheckOutMissing) {
      setSearchButtonErrorFlash(true);
      if (searchButtonErrorTimeoutRef.current) {
        window.clearTimeout(searchButtonErrorTimeoutRef.current);
      }
      searchButtonErrorTimeoutRef.current = window.setTimeout(() => {
        setSearchButtonErrorFlash(false);
        searchButtonErrorTimeoutRef.current = null;
      }, 1000);
      return;
    }

    const sequence = searchSequenceRef.current + 1;
    searchSequenceRef.current = sequence;
    setIsSearchRunning(false);

    const guestCount = Number.parseInt(guestFilter, 10) || 2;
    setProperties((prev) => clearPropertyBookingPrices(prev));
    setIsBookingPriceLoading(false);
    const guestFilteredProperties = properties.filter((prop) => {
      if (isPropertyDetailsPending(prop)) return false;
      return prop.capacity >= guestCount;
    });
    const guestFilteredIds = guestFilteredProperties
      .map((prop) => prop.id)
      .filter((id) => id > 0);
    const guestFilteredPropertyById = new Map(
      guestFilteredProperties.map((prop) => [prop.id, prop]),
    );

    setSearchGuestCount(guestCount);
    setSearchDateRange(null);
    setCheckoutPreviewDate(null);
    setOpenDatePicker(null);
    setIsGuestMenuOpen(false);

    if (!parsedCheckIn || !parsedCheckOut) {
      setSearchAvailableIds(new Set<number>(guestFilteredIds));
      return;
    }

    const startDate = startOfDay(parsedCheckIn);
    const endDate = startOfDay(parsedCheckOut);
    if (endDate <= startDate) {
      setSearchAvailableIds(new Set<number>());
      return;
    }

    const startDateApi = formatApiDate(startDate);
    const endDateApi = formatApiDate(endDate);
    const priceParams = {
      checkinDate: startDateApi,
      checkoutDate: endDateApi,
      travelers: guestCount,
    };
    setSearchDateRange({ startDate: startDateApi, endDate: endDateApi });

    if (guestFilteredIds.length === 0) {
      setSearchAvailableIds(new Set<number>());
      return;
    }

    setIsSearchRunning(true);
    const availableIds = new Set<number>();
    const priceRequestedIds = new Set<number>();
    let activePriceRequests = 0;
    setSearchAvailableIds(new Set<number>());

    const queuePriceFetchForProperty = (propertyId: number) => {
      if (priceRequestedIds.has(propertyId)) return;
      priceRequestedIds.add(propertyId);
      activePriceRequests += 1;
      setIsBookingPriceLoading(true);

      void (async () => {
        try {
          const bookingPrices = await fetchBookingPricesForAccommodation(
            propertyId,
            priceParams,
          );
          if (searchSequenceRef.current !== sequence) return;
          setProperties((prev) =>
            prev.map((prop) => {
              if (prop.id !== propertyId) return prop;
              const [merged] = mergeBookingPricesIntoProperties(
                [prop],
                bookingPrices,
              );
              return merged ?? prop;
            }),
          );
        } catch {
          if (searchSequenceRef.current !== sequence) return;
          setProperties((prev) =>
            markBookingPriceErrorForProperties(prev, new Set([propertyId])),
          );
        } finally {
          if (searchSequenceRef.current !== sequence) return;
          activePriceRequests = Math.max(0, activePriceRequests - 1);
          if (activePriceRequests === 0) {
            setIsBookingPriceLoading(false);
          }
        }
      })();
    };

    try {
      const now = Date.now();
      pruneAvailabilityCache(now);
      const queue: QueueItem[] = [];
      guestFilteredIds.forEach((id) => {
        const cached = getFreshAvailabilityCacheForRange(
          id,
          startDate,
          endDate,
          now,
        );
        if (cached) {
          const property = guestFilteredPropertyById.get(id);
          const passesMinimumNotice = hasMinimumCheckInNotice(
            startDate,
            property?.entryTime ?? null,
          );
          if (
            passesMinimumNotice &&
            cached.available
          ) {
            availableIds.add(id);
            queuePriceFetchForProperty(id);
          }
          return;
        }
        queue.push({
          id,
          attempt: 0,
          readyAt: Date.now(),
        });
      });
      setSearchAvailableIds(new Set<number>(availableIds));
      let rateLimitStreak = 0;

      while (queue.length > 0) {
        if (searchSequenceRef.current !== sequence) return;

        queue.sort((a, b) => a.readyAt - b.readyAt);
        const firstReadyAt = queue[0]?.readyAt;
        if (typeof firstReadyAt !== "number") break;

        const delayUntilReady = firstReadyAt - Date.now();
        if (delayUntilReady > 0) {
          await wait(delayUntilReady);
          if (searchSequenceRef.current !== sequence) return;
        }

        const readyItems: QueueItem[] = [];
        const now = Date.now();
        while (
          queue.length > 0 &&
          readyItems.length < SEARCH_BATCH_SIZE &&
          queue[0] &&
          queue[0].readyAt <= now
        ) {
          const nextItem = queue.shift();
          if (nextItem) readyItems.push(nextItem);
        }

        if (readyItems.length === 0) {
          continue;
        }

        const batchResults = await Promise.all(
          readyItems.map(async (item) => {
            try {
              const cacheEntry = await fetchAvailabilityForProperty(
                item.id,
                startDate,
                endDate,
              );
              const property = guestFilteredPropertyById.get(item.id);

              return {
                item,
                available:
                  hasMinimumCheckInNotice(
                    startDate,
                    property?.entryTime ?? null,
                  ) && cacheEntry.available,
              };
            } catch (error) {
              return {
                item,
                error,
              };
            }
          }),
        );

        if (searchSequenceRef.current !== sequence) return;

        let hitRateLimit = false;

        batchResults.forEach(({ item, available, error }) => {
          if (!error) {
            if (available) {
              availableIds.add(item.id);
              queuePriceFetchForProperty(item.id);
              setSearchAvailableIds((prev) => {
                if (searchSequenceRef.current !== sequence) {
                  return prev ?? new Set<number>();
                }

                const next = new Set(prev ?? []);
                next.add(item.id);
                return next;
              });
            }
            return;
          }

          const status =
            error && typeof error === "object"
              ? (error as { status?: number }).status
              : undefined;

          if (status === 429) {
            hitRateLimit = true;
          }

          if (status === 429 && item.attempt < SEARCH_MAX_RETRIES) {
            queue.push({
              id: item.id,
              attempt: item.attempt + 1,
              readyAt: Date.now() + getRetryDelayMs(error, item.attempt),
            });
          }
        });

        if (queue.length > 0) {
          rateLimitStreak = hitRateLimit ? rateLimitStreak + 1 : 0;
          await wait(getSearchCooldownMs(hitRateLimit, rateLimitStreak));
        }
      }
    } finally {
      if (searchSequenceRef.current === sequence) {
        setIsSearchRunning(false);
      }
    }

    if (searchSequenceRef.current !== sequence) return;
    if (availableIds.size === 0 && activePriceRequests === 0) {
      setIsBookingPriceLoading(false);
    }

    setSearchAvailableIds(availableIds);
  }

  function resetSearchResults() {
    searchSequenceRef.current += 1;
    setIsSearchRunning(false);
    setSearchGuestCount(null);
    setSearchAvailableIds(null);
    setSearchDateRange(null);
    setCheckIn("");
    setCheckOut("");
    setIsBookingPriceLoading(false);
    setGuestFilter("2");
    setCheckoutPreviewDate(null);
    setOpenDatePicker(null);
    setIsGuestMenuOpen(false);
    setVisibleMonth(startOfMonth(new Date()));
    setShowMissingCheckInError(false);
    setShowMissingCheckOutError(false);
    setSearchButtonErrorFlash(false);
    setProperties((prev) => clearPropertyBookingPrices(prev));
    if (searchButtonErrorTimeoutRef.current) {
      window.clearTimeout(searchButtonErrorTimeoutRef.current);
      searchButtonErrorTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!openDatePicker) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!calendarRef.current?.contains(event.target as Node)) {
        setCheckoutPreviewDate(null);
        setOpenDatePicker(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [openDatePicker]);

  useEffect(() => {
    if (!isGuestMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!guestMenuRef.current?.contains(event.target as Node)) {
        setIsGuestMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isGuestMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let pendingIds: number[] = [];

        if (reservationPropertiesCache.length > 0) {
          pendingIds = reservationPropertiesCache
            .filter((prop) => prop.id > 0 && isPropertyDetailsPending(prop))
            .map((prop) => prop.id);
          setLoading(false);
        } else {
          const list = (await apiFetchWithRetry(
            "/accommodations/",
          )) as AccommodationListItem[];
          if (cancelled) return;

          const placeholders = list.map((item) =>
            createPlaceholderProperty(item),
          );
          setProperties(placeholders);
          setLoading(false);
          pendingIds = list.map((item) => item.id);
        }

        if (pendingIds.length === 0) return;

        const queue: QueueItem[] = pendingIds.map((id) => ({
          id,
          attempt: 0,
          readyAt: Date.now(),
        }));
        let rateLimitStreak = 0;

        while (queue.length > 0) {
          if (cancelled) return;

          queue.sort((a, b) => a.readyAt - b.readyAt);
          const firstReadyAt = queue[0]?.readyAt;
          if (typeof firstReadyAt !== "number") break;

          const delayUntilReady = firstReadyAt - Date.now();
          if (delayUntilReady > 0) {
            await wait(delayUntilReady);
            if (cancelled) return;
          }

          const readyItems = queue.splice(0, DETAIL_BATCH_SIZE);
          let batchResults: BatchDetailResponseItem[] = [];

          try {
            batchResults = await fetchAccommodationBatch(
              readyItems.map((item) => item.id),
            );
          } catch (err) {
            const retryAfterMs = getRetryDelayMs(err, rateLimitStreak);
            readyItems.forEach((current) => {
              queue.push({
                id: current.id,
                attempt: current.attempt + 1,
                readyAt: Date.now() + retryAfterMs,
              });
            });
            rateLimitStreak += 1;
            await wait(getBatchCooldownMs(true, rateLimitStreak));
            continue;
          }

          if (cancelled) return;

          let hitRateLimit = false;

          readyItems.forEach((current, index) => {
            const result = batchResults[index];
            if (!result) {
              setProperties((prev) =>
                prev.map((prop) =>
                  prop.id === current.id
                    ? { ...prop, loadError: LOAD_ERROR_FALLBACK_MESSAGE }
                    : prop,
                ),
              );
              return;
            }

            if (result.ok && result.data) {
              const normalized = normalize(result.data as RawProperty);
              setProperties((prev) =>
                prev.map((prop) =>
                  prop.id === normalized.id ? normalized : prop,
                ),
              );
              return;
            }

            const status = result.status;
            const message = result.error || LOAD_ERROR_FALLBACK_MESSAGE;

            setProperties((prev) =>
              prev.map((prop) =>
                prop.id === current.id ? { ...prop, loadError: message } : prop,
              ),
            );

            if (status === 429) {
              hitRateLimit = true;
            }

            if (status === 429 && current.attempt < DETAIL_MAX_RETRIES) {
              queue.push({
                id: current.id,
                attempt: current.attempt + 1,
                readyAt:
                  Date.now() +
                  (result.retryAfterMs ??
                    getRetryDelayMs(result, current.attempt)),
              });
            }
          });

          if (!cancelled && queue.length > 0) {
            rateLimitStreak = hitRateLimit ? rateLimitStreak + 1 : 0;
            await wait(getBatchCooldownMs(hitRateLimit, rateLimitStreak));
          }
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveGuestCount = searchGuestCount ?? selectedGuestCount;
  const baseFiltered = properties.filter((p) => {
    if (isPropertyDetailsPending(p)) {
      return searchGuestCount === null;
    }
    if (p.capacity < effectiveGuestCount) return false;
    return true;
  });
  const filtered =
    searchAvailableIds === null
      ? baseFiltered
      : baseFiltered.filter((prop) => searchAvailableIds.has(prop.id));
  const activeGuestFilter = String(effectiveGuestCount);
  const isSearchApplied = searchGuestCount !== null;
  const activeGuestCount = Number.parseInt(activeGuestFilter, 10) || 2;
  const activeGuestLabel = `${activeGuestCount} ${
    activeGuestCount === 1 ? guestSingularLabel : guestPluralLabel
  }`;
  const appliedDateRange = searchDateRange
    ? {
        startDate: formatApiDateForDisplay(searchDateRange.startDate),
        endDate: formatApiDateForDisplay(searchDateRange.endDate),
      }
    : null;
  const activeDateRangeLabel = appliedDateRange
    ? `${appliedDateRange.startDate} -> ${appliedDateRange.endDate}`
    : null;
  const appliedStartDate = searchDateRange
    ? parseApiDate(searchDateRange.startDate)
    : null;
  const appliedEndDate = searchDateRange
    ? parseApiDate(searchDateRange.endDate)
    : null;
  const activeNightsCount =
    appliedStartDate && appliedEndDate
      ? Math.max(
          0,
          Math.round(
            (startOfDay(appliedEndDate).getTime() -
              startOfDay(appliedStartDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : null;
  const activeNightsLabel =
    typeof activeNightsCount === "number" && activeNightsCount > 0
      ? `${activeNightsCount} ${activeNightsCount === 1 ? nightSingularLabel : nightPluralLabel}`
      : null;
  const noSearchResultsLabel =
    isSearchApplied && activeDateRangeLabel
      ? noSearchResultsTemplate
          .replace("{guests}", activeGuestLabel)
          .replace("{dates}", activeDateRangeLabel)
      : null;
  const mappedProperties = filtered.filter(
    (prop): prop is MappedProperty =>
      typeof prop.latitude === "number" && typeof prop.longitude === "number",
  );
  const loadingDetails = properties.some((prop) =>
    isPropertyDetailsPending(prop),
  );
  const showingInitialPlaceholders =
    loading && filtered.length > 0 && filtered.every((prop) => prop.id < 0);

  function retryProperty(id: number) {
    void (async () => {
      setProperties((prev) =>
        prev.map((prop) =>
          prop.id === id ? { ...prop, loadError: null } : prop,
        ),
      );

      try {
        const [result] = await fetchAccommodationBatch([id]);
        if (!result?.ok || !result.data) {
          throw new Error(result?.error || loadErrorLabel);
        }
        const normalized = normalize(result.data as RawProperty);
        setProperties((prev) =>
          prev.map((prop) => (prop.id === normalized.id ? normalized : prop)),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : loadErrorLabel;
        setProperties((prev) =>
          prev.map((prop) =>
            prop.id === id ? { ...prop, loadError: message } : prop,
          ),
        );
      }
    })();
  }

  useEffect(() => {
    return () => {
      if (searchButtonErrorTimeoutRef.current) {
        window.clearTimeout(searchButtonErrorTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#efefef]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Search bar */}
        <div className="relative z-[900] pt-3 pb-2">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 rounded-[8px] border border-[#d9d9d9] bg-white transition-colors duration-200 focus-within:border-[#c2a457] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_96px_96px]">
            <div
              ref={openDatePicker === "checkIn" ? calendarRef : null}
              className="relative border-b border-[#ececec] px-3 py-2 sm:border-r lg:border-b-0"
            >
              <button
                type="button"
                onClick={() => {
                  setShowMissingCheckInError(false);
                  toggleCalendar("checkIn");
                }}
                className={`block w-full rounded-[6px] border px-1 py-1 text-left transition-colors ${
                  showMissingCheckInError
                    ? "border-[#dc2626]"
                    : "border-transparent"
                }`}
                aria-label={checkInLabel}
              >
                <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">
                  {checkInLabel}
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[15px] font-medium ${
                      checkIn ? "text-[#2d2d2d]" : "text-[#2d2d2d]"
                    }`}
                  >
                    {checkIn || datePlaceholderLabel}
                  </span>
                  <span className="text-[#2d2d2d]" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="2.2"
                        y="3.2"
                        width="11.6"
                        height="10.6"
                        rx="1.6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M5 2.2v2.2M11 2.2v2.2M2.2 6.1h11.6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </button>
              {showMissingCheckInError && (
                <p
                  className="mt-1 inline-flex items-center gap-1 rounded-[6px] bg-[#fef2f2] px-2 py-1 text-[11px] font-semibold text-[#b91c1c]"
                  role="alert"
                  aria-live="polite"
                >
                  {missingDateLabel}
                </p>
              )}
              {openDatePicker === "checkIn" && (
                <DatePickerPopover
                  lang={lang}
                  visibleMonth={visibleMonth}
                  selectedDate={parsedCheckIn}
                  minDate={startOfDay(new Date())}
                  onPrevMonth={() =>
                    setVisibleMonth((prev) => addMonths(prev, -1))
                  }
                  onNextMonth={() =>
                    setVisibleMonth((prev) => addMonths(prev, 1))
                  }
                  onSelectDate={(date) => handleDateSelection("checkIn", date)}
                />
              )}
            </div>
            <div
              ref={openDatePicker === "checkOut" ? calendarRef : null}
              className="relative border-b border-[#ececec] px-3 py-2 sm:border-b sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r"
            >
              <button
                type="button"
                onClick={() => {
                  setShowMissingCheckOutError(false);
                  toggleCalendar("checkOut");
                }}
                className={`block w-full rounded-[6px] border px-1 py-1 text-left transition-colors ${
                  showMissingCheckOutError
                    ? "border-[#dc2626]"
                    : "border-transparent"
                }`}
                aria-label={checkOutLabel}
              >
                <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">
                  {checkOutLabel}
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-medium text-[#2d2d2d]">
                    {checkOut || datePlaceholderLabel}
                  </span>
                  <span className="text-[#2d2d2d]" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="2.2"
                        y="3.2"
                        width="11.6"
                        height="10.6"
                        rx="1.6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M5 2.2v2.2M11 2.2v2.2M2.2 6.1h11.6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </button>
              {showMissingCheckOutError && (
                <p
                  className="mt-1 inline-flex items-center gap-1 rounded-[6px] bg-[#fef2f2] px-2 py-1 text-[11px] font-semibold text-[#b91c1c]"
                  role="alert"
                  aria-live="polite"
                >
                  {missingDateLabel}
                </p>
              )}
              {openDatePicker === "checkOut" && (
                <DatePickerPopover
                  lang={lang}
                  visibleMonth={visibleMonth}
                  selectedDate={parsedCheckOut}
                  highlightToday={false}
                  minDate={
                    parsedCheckIn
                      ? addDays(parsedCheckIn, 1)
                      : startOfDay(new Date())
                  }
                  rangeStart={parsedCheckIn}
                  rangeEnd={parsedCheckOut}
                  previewRangeEnd={checkoutPreviewDate}
                  onPrevMonth={() =>
                    setVisibleMonth((prev) => addMonths(prev, -1))
                  }
                  onNextMonth={() =>
                    setVisibleMonth((prev) => addMonths(prev, 1))
                  }
                  onSelectDate={(date) => handleDateSelection("checkOut", date)}
                  onPreviewDate={setCheckoutPreviewDate}
                />
              )}
            </div>
            <div
              ref={guestMenuRef}
              className="relative border-b border-[#ececec] px-3 py-2 sm:border-r sm:border-b-0 lg:border-b-0"
            >
              <button
                type="button"
                onClick={toggleGuestMenu}
                aria-haspopup="listbox"
                aria-expanded={isGuestMenuOpen}
                className="block w-full border-0 bg-transparent text-left outline-0"
              >
                <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">
                  {guestsLabel}
                </span>
                <span className="flex items-center justify-between gap-2 text-[15px] font-medium text-[#2d2d2d]">
                  <span>{selectedGuestLabel}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`shrink-0 transition-transform duration-200 ${isGuestMenuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path
                      d="M4 6.5L8 10.5L12 6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              {isGuestMenuOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-full min-w-[220px] rounded-[12px] border border-[#e6e6e6] bg-white p-1 shadow-[0_14px_36px_rgba(15,23,42,0.16)]">
                  <div className="max-h-[300px] overflow-y-auto py-1">
                    {[
                      { value: "2", count: 2 },
                      ...[1, 2, 3, 4, 5, 6, 7, 8, 9]
                        .filter((n) => n !== 2)
                        .map((n) => ({ value: String(n), count: n })),
                    ].map(({ value, count }, index) => {
                      const isSelected = guestFilter === value;
                      const isStripedRow = index % 2 === 0;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setGuestFilter(value);
                            setIsGuestMenuOpen(false);
                          }}
                          role="option"
                          aria-selected={isSelected}
                          className={`flex w-full items-center rounded-[8px] px-3 py-2 text-left text-[14px] transition-colors ${
                            isSelected
                              ? "bg-[#f2ead6] font-semibold text-[#8f7130]"
                              : isStripedRow
                                ? "bg-[#f7f7f7] text-[#2d2d2d] hover:bg-[#efefef]"
                                : "text-[#2d2d2d] hover:bg-[#f7f7f7]"
                          }`}
                        >
                          {count}{" "}
                          {count === 1 ? guestSingularLabel : guestPluralLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={resetSearchResults}
              className="min-h-[50px] w-full border-l border-[#d9d9d9] bg-[#eef4fb] px-2 sm:px-3 text-center text-[10px] sm:text-[11px] leading-[1.15] whitespace-normal wrap-break-word font-bold uppercase tracking-[0.04em] sm:tracking-[0.08em] text-[#4c6785] transition-colors hover:bg-[#e3edf8] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSearchRunning}
            >
              {resetLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                void runSearch();
              }}
              className={`min-h-[50px] w-full px-2 sm:px-4 text-center text-[10px] sm:text-[11px] leading-[1.15] whitespace-normal wrap-break-word font-bold uppercase tracking-[0.04em] sm:tracking-[0.08em] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                searchButtonErrorFlash
                  ? "bg-[#dc2626] hover:bg-[#dc2626]"
                  : "bg-[#c2a457] hover:bg-[#af944f]"
              }`}
              disabled={isSearchRunning}
            >
              {searchLabel}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[1240px] mx-auto py-4">
          {error && (
            <p className="text-center text-sm text-red-500 py-20">
              {loadErrorLabel}
            </p>
          )}
          <>
            {isSearchApplied && (
              <div className="mb-2 flex flex-wrap items-center gap-2 rounded-[10px] border border-[#d9e6f7] bg-[#eef4fb] px-3 py-2">
                <span className="text-[12px] font-semibold text-[#3d5f86]">
                  {showingSearchResultsLabel}
                </span>
                <span className="text-[12px] text-[#4f6781]">
                  {activeGuestLabel}
                  {activeDateRangeLabel ? ` · ${activeDateRangeLabel}` : ""}
                  {activeNightsLabel ? ` · ${activeNightsLabel}` : ""}
                </span>
                <button
                  type="button"
                  onClick={resetSearchResults}
                  className="ml-auto inline-flex items-center rounded-full border border-[#c8daef] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#496788] transition-colors hover:bg-[#f4f8fd]"
                >
                  {viewAllLabel}
                </button>
              </div>
            )}
            <p className="text-[22px] text-[#5f5f5f] mb-3 font-light">
              <strong className="inline-flex min-w-[28px] items-center justify-center text-[#2d2d2d] font-bold">
                {showingInitialPlaceholders ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d8c188] border-t-[#c2a457]" />
                ) : (
                  filtered.length
                )}
              </strong>{" "}
              {staysInCalpeLabel}
              {(loading || loadingDetails || isSearchRunning) && (
                <span className="ml-2 inline-flex items-center gap-1 text-[#c2a457] text-sm font-medium">
                  <span
                    className="h-3.5 w-3.5 animate-spin rounded-full border border-[#d8c188] border-t-[#c2a457]"
                    aria-hidden="true"
                  />
                  {loadingPropertiesLabel}
                </span>
              )}
            </p>
            {isSearchApplied &&
              !isSearchRunning &&
              filtered.length === 0 &&
              noSearchResultsLabel && (
                <div className="mb-4 rounded-[12px] border border-[#ecd9d9] bg-[#fff7f7] px-4 py-3 text-[14px] text-[#8f3d3d]">
                  {noSearchResultsLabel}
                </div>
              )}
            <PropertyMap
              properties={mappedProperties}
              title={mapTitleLabel}
              hint={mapHintLabel}
              openInGoogleMapsLabel={openInGoogleMapsLabel}
              moreInfoLabel={mapMoreInfoLabel}
              totalPriceLabel={totalPriceLabel}
              calculatingPriceLabel={calculatingPriceLabel}
              retryPriceLabel={retryPriceLabel}
              guestSingularLabel={guestSingularLabel}
              guestPluralLabel={guestPluralLabel}
              nightSingularLabel={nightSingularLabel}
              nightPluralLabel={nightPluralLabel}
              bedroomsShortLabel={bedroomsShortLabel}
              bathroomsShortLabel={bathroomsShortLabel}
              lang={lang}
              guestFilter={activeGuestFilter}
              bookingStartDate={searchDateRange?.startDate}
              bookingEndDate={searchDateRange?.endDate}
              isLoadingProperties={loading || loadingDetails || isSearchRunning}
              isBookingPriceLoading={isBookingPriceLoading}
              loadingPropertiesLabel={loadingPropertiesLabel}
              recenterCalpeLabel={mapRecenterCalpeLabel}
              onRetryPrice={retryBookingPrices}
              onOpen={openBookingUrl}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  prop={prop}
                  onRetry={retryProperty}
                  onRetryPrice={retryBookingPrices}
                  onOpen={openBookingUrl}
                  lang={lang}
                  propertyFallbackLabel={propertyFallbackLabel}
                  loadingDataLabel={cardLoadingDataLabel}
                  retryLabel={retryLabel}
                  previousPhotoLabel={previousPhotoLabel}
                  nextPhotoLabel={nextPhotoLabel}
                  bedroomsShortLabel={bedroomsShortLabel}
                  bedsLabel={bedsLabel}
                  bathroomsLabel={bathroomsLabel}
                  viewInfoLabel={viewInfoLabel}
                  totalPriceLabel={totalPriceLabel}
                  totalPriceNightsLabel={activeNightsLabel}
                  calculatingPriceLabel={calculatingPriceLabel}
                  retryPriceLabel={retryPriceLabel}
                  bookingPriceLoading={isBookingPriceLoading}
                  sharePropertyAriaLabel={sharePropertyAriaLabel}
                  shareMenuHeadingLabel={shareMenuHeadingLabel}
                  shareCopyLinkLabel={shareCopyLinkLabel}
                  shareCopiedLabel={shareCopiedLabel}
                  shareMessageLeadLabel={shareMessageLeadLabel}
                  bookingUrl={buildBookingUrl(prop.id, {
                    guests: activeGuestFilter,
                    startDate: searchDateRange?.startDate,
                    endDate: searchDateRange?.endDate,
                  })}
                />
              ))}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
