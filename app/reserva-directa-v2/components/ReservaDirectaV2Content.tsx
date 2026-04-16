"use client";

import { useState, useEffect } from "react";
import { useLangStore } from "@/app/lib/langStore";
import type { Lang } from "@/app/lib/langStore";

const API = "/api/avaibook";
const BOOK = "https://inftour.bookonline.pro";
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
          <path d="M2.5 6.5A8 8 0 0 1 13.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M4.75 9A5 5 0 0 1 11.25 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M7 11.5a2 2 0 0 1 2 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case "ac":
    case "aire_acondicionado_individual":
      return (
        <svg {...commonProps}>
          <path d="M8 2.5v11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M4.5 4.5 11.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M11.5 4.5 4.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "tv":
    case "tv_pantalla_plana":
      return (
        <svg {...commonProps}>
          <rect x="2.5" y="3" width="11" height="7.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M6.5 13h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "parking_pago_solicitud":
      return (
        <svg {...commonProps}>
          <path d="M5 13V3h3.5a2.5 2.5 0 1 1 0 5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "lavadora":
    case "lavavajillas":
      return (
        <svg {...commonProps}>
          <rect x="3" y="2.5" width="10" height="11" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="8" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="5.2" cy="4.7" r=".6" fill="currentColor" />
          <circle cx="7.2" cy="4.7" r=".6" fill="currentColor" />
        </svg>
      );
    case "ascensor":
      return (
        <svg {...commonProps}>
          <rect x="4" y="2.5" width="8" height="11" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 5V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="m6.5 6.5 1.5-1.5 1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m6.5 9.5 1.5 1.5 1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "vistas":
    case "vistas_ciudad":
      return (
        <svg {...commonProps}>
          <path d="M2.5 8s2-3 5.5-3 5.5 3 5.5 3-2 3-5.5 3-5.5-3-5.5-3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "playa":
    case "cerca_mar":
      return (
        <svg {...commonProps}>
          <path d="M2.5 10.5c1 .8 2 .8 3 0s2-.8 3 0 2 .8 3 0 2-.8 2.5-.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M5 7.5c.7-.8 1.4-1.2 2.2-1.2S8.8 6.7 9.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "piscina":
    case "piscina_compartida":
      return (
        <svg {...commonProps}>
          <path d="M2.5 11c1 .7 2 .7 3 0s2-.7 3 0 2 .7 3 0 2-.7 2.5-.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M5 10V4.5a1 1 0 0 1 2 0V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M5 6h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 5.5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M5.5 8h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
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
    esp: "Visitar pagina",
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
    esp: "Cargando pagina...",
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
    esp: "{staysInCalpeLabel}",
    ru: "вариантов размещения в Кальпе",
    fr: "hebergements a Calpe",
    it: "alloggi a Calpe",
    de: "Unterkunfte in Calpe",
    uk: "варіантів проживання в Кальпе",
    pl: "noclegow w Calpe",
  },
  loadingListings: {
    eng: "Loading stays...",
    esp: "{loadingListingsLabel}",
    ru: "Загрузка вариантов размещения...",
    fr: "Chargement des hebergements...",
    it: "Caricamento alloggi...",
    de: "Unterkunfte werden geladen...",
    uk: "Завантаження варіантів проживання...",
    pl: "Ladowanie noclegow...",
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
} as const;

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
} as const;

// Raw shape from AvaiBook API
interface RawProperty {
  id: number;
  name?: string;
  tradeName?: { es?: string; en?: string };
  accommodationType?: string;
  location?: { city?: string; region?: string };
  units?: Array<{ capacity?: number }>;
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
  name: string;
  type: string;
  city: string;
  region: string;
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
  loadError?: string | null;
}

type AccommodationListItem = {
  id: number;
  name?: string;
  tradeName?: { es?: string; en?: string };
};

function getAccommodationListName(item: AccommodationListItem): string {
  return stripInftourSuffix(item.tradeName?.es || item.name || "");
}

function stripInftourSuffix(name: string): string {
  return name.replace(/\binftour\b/gi, "").replace(/\s{2,}/g, " ").trim();
}

function createPlaceholderProperty(item: AccommodationListItem): Property {
  return {
    id: item.id,
    name: getAccommodationListName(item),
    type: "",
    city: "",
    region: "",
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
    loadError: null,
  };
}

function createInitialGridPlaceholders(count: number): Property[] {
  return Array.from({ length: count }, (_, index) => ({
    id: -(index + 1),
    name: `Propiedad ${index + 1}`,
    type: "",
    city: "",
    region: "",
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
    loadError: null,
  }));
}

function normalize(a: RawProperty): Property {
  return {
    id: a.id,
    name: stripInftourSuffix(a.tradeName?.es || a.name || ""),
    type: a.accommodationType || "",
    city: a.location?.city || "Calp",
    region: a.location?.region || "Alicante",
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
    loadError: null,
  };
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

async function apiFetch(path: string): Promise<unknown> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const r = await fetch(API + normalizedPath, {
    headers: { accept: "application/json" },
  });
  if (!r.ok) {
    const error = new Error(`API ${r.status}`) as Error & { status?: number };
    error.status = r.status;
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

async function apiFetchWithRetry(path: string, retries = 1): Promise<unknown> {
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
        await wait(status === 429 ? 2000 : 300 * (attempt + 1));
      }
    }
  }
  throw lastError;
}

// â”€â”€â”€ CardCarousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  const gallery = (images ?? [])
    .filter((img) => Boolean(img.SMALL));

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

  return (
    <div className="relative w-full h-full group" data-idx={safeIdx}>
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

function PropertyCard({
  prop,
  bookingUrl,
  onRetry,
  onOpen,
  propertyFallbackLabel,
  loadingDataLabel,
  retryLabel,
  previousPhotoLabel,
  nextPhotoLabel,
  bedroomsShortLabel,
  bedsLabel,
  bathroomsLabel,
}: {
  prop: Property;
  bookingUrl: string;
  onRetry: (id: number) => void;
  onOpen: (url: string) => void;
  propertyFallbackLabel: string;
  loadingDataLabel: string;
  retryLabel: string;
  previousPhotoLabel: string;
  nextPhotoLabel: string;
  bedroomsShortLabel: string;
  bedsLabel: string;
  bathroomsLabel: string;
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
  const canRetry =
    isPending &&
    prop.id > 0 &&
    typeof prop.loadError === "string" &&
    prop.loadError.includes("429");
  const showStatsLoading = isPending;

  return (
    <div
      onClick={() => onOpen(bookingUrl)}
      role="button"
      tabIndex={0}
      onFocus={(e) => {
        if (e.target !== e.currentTarget) return;
        if (canRetry) onRetry(prop.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(bookingUrl);
        }
      }}
      className="group bg-white overflow-hidden border border-[#e0e0e0] cursor-pointer transition-all duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] focus-visible:shadow-[0_8px_20px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2a457] focus-visible:ring-offset-2"
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
        {canRetry && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRetry(prop.id);
            }}
            aria-label={retryLabel}
            className="absolute left-1/2 top-1/2 z-40 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#4f8ecf]/75 text-white shadow-lg backdrop-blur-sm hover:bg-[#3f7fbe]/82 active:bg-[#346fa9]/88"
          >
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
              text={`${prop.sqm} mÂ²`}
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
                    {FEAT_LABELS[f]}
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
      </div>
    </div>
  );
}

// â”€â”€â”€ GalleryModal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ReservaDirectaV2Content() {
  const lang = useLangStore((s) => s.lang);
  const visitActualPageLabel = modalTranslations.visitActualPage[lang];
  const closeModalLabel = modalTranslations.closeModal[lang];
  const bookingPropertyLabel = modalTranslations.bookingProperty[lang];
  const loadingPageLabel = modalTranslations.loadingPage[lang];
  const checkInLabel = bookingSearchTranslations.checkIn[lang];
  const checkOutLabel = bookingSearchTranslations.checkOut[lang];
  const guestsLabel = bookingSearchTranslations.guests[lang];
  const searchLabel = bookingSearchTranslations.search[lang];
  const datePlaceholderLabel = bookingSearchTranslations.datePlaceholder[lang];
  const guestSingularLabel = bookingSearchTranslations.guestSingular[lang];
  const guestPluralLabel = bookingSearchTranslations.guestPlural[lang];
  const staysInCalpeLabel = bookingResultsTranslations.staysInCalpe[lang];
  const loadingListingsLabel = bookingResultsTranslations.loadingListings[lang];
  const loadingDetailsLabel = bookingResultsTranslations.loadingDetails[lang];
  const loadErrorLabel = bookingResultsTranslations.loadError[lang];
  const propertyFallbackLabel = propertyCardTranslations.propertyFallback[lang];
  const cardLoadingDataLabel = propertyCardTranslations.loadingData[lang];
  const retryLabel = propertyCardTranslations.retry[lang];
  const previousPhotoLabel = propertyCardTranslations.previousPhoto[lang];
  const nextPhotoLabel = propertyCardTranslations.nextPhoto[lang];
  const bedroomsShortLabel = propertyCardTranslations.bedroomsShort[lang];
  const bedsLabel = propertyCardTranslations.beds[lang];
  const bathroomsLabel = propertyCardTranslations.bathrooms[lang];
  const [properties, setProperties] = useState<Property[]>(() =>
    createInitialGridPlaceholders(9),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestFilter, setGuestFilter] = useState("0");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedBookingUrl, setSelectedBookingUrl] = useState<string | null>(null);
  const [isBookingModalLoading, setIsBookingModalLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const list = (await apiFetchWithRetry(
          "/accommodations/",
        )) as AccommodationListItem[];
        if (cancelled) return;

        const placeholders = list.map((item) =>
          createPlaceholderProperty(item),
        );
        setProperties(placeholders);
        setLoading(false);

        for (let i = 0; i < list.length; i += 3) {
          if (cancelled) return;

          const chunk = list.slice(i, i + 3);
          const results = await Promise.allSettled(
            chunk.map((item) =>
              apiFetchWithRetry(`/accommodations/${item.id}/`),
            ),
          );

          if (cancelled) return;

          results.forEach((result, index) => {
            if (result.status !== "fulfilled") {
              const message =
                result.reason instanceof Error
                  ? result.reason.message
                  : loadErrorLabel;
              const failedId = chunk[index]?.id;
              if (!failedId) return;
              setProperties((prev) =>
                prev.map((prop) =>
                  prop.id === failedId ? { ...prop, loadError: message } : prop,
                ),
              );
              return;
            }
            if (!result.value) return;
            const normalized = normalize(result.value as RawProperty);
            setProperties((prev) =>
              prev.map((prop) =>
                prop.id === normalized.id ? normalized : prop,
              ),
            );
          });

          if (!cancelled) {
            await wait(250);
          }
        }
      } catch {
        if (!cancelled) setError(loadErrorLabel);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [loadErrorLabel]);

  const filtered = properties.filter((p) => {
    if (guestFilter !== "0" && p.capacity < parseInt(guestFilter)) return false;
    return true;
  });
  const loadingDetails = properties.some((prop) => !prop.name);
  const showingInitialPlaceholders =
    loading && filtered.length > 0 && filtered.every((prop) => prop.id < 0);

  function retryProperty(id: number) {
    void (async () => {
      try {
        const detail = await apiFetchWithRetry(`/accommodations/${id}/`);
        const normalized = normalize(detail as RawProperty);
        setProperties((prev) =>
          prev.map((prop) => (prop.id === normalized.id ? normalized : prop)),
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : loadErrorLabel;
        setProperties((prev) =>
          prev.map((prop) =>
            prop.id === id ? { ...prop, loadError: message } : prop,
          ),
        );
      }
    })();
  }

  useEffect(() => {
    if (!selectedBookingUrl) return;

    setIsBookingModalLoading(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedBookingUrl(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedBookingUrl]);

  return (
    <div className="min-h-screen bg-[#efefef]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Search bar */}
        <div className="pt-3 pb-2">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 overflow-hidden rounded-[8px] border border-[#d9d9d9] bg-white sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_96px]">
            <div className="border-b border-[#ececec] px-3 py-2 sm:border-r lg:border-b-0">
              <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">{checkInLabel}</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={datePlaceholderLabel}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border-0 bg-transparent text-[15px] font-medium text-[#2d2d2d] outline-0 placeholder:text-[#2d2d2d]"
                />
                <span className="text-[#2d2d2d]" aria-hidden>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.6" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 2.2v2.2M11 2.2v2.2M2.2 6.1h11.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="border-b border-[#ececec] px-3 py-2 sm:border-b sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r">
              <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">{checkOutLabel}</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={datePlaceholderLabel}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border-0 bg-transparent text-[15px] font-medium text-[#2d2d2d] outline-0 placeholder:text-[#2d2d2d]"
                />
                <span className="text-[#2d2d2d]" aria-hidden>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.6" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 2.2v2.2M11 2.2v2.2M2.2 6.1h11.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="border-b border-[#ececec] px-3 py-2 sm:border-r sm:border-b-0 lg:border-b-0">
              <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">{guestsLabel}</label>
              <select
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
                className="w-full border-0 bg-transparent text-[15px] font-medium text-[#2d2d2d] outline-0"
              >
                <option value="0">2 {guestPluralLabel}</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? guestSingularLabel : guestPluralLabel}
                  </option>
                ))}
              </select>
            </div>
            <button className="min-h-[50px] w-full bg-[#c2a457] px-4 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#af944f]">
              {searchLabel}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[1240px] mx-auto py-4">
          {loading && properties.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-[#C5A85F] rounded-full animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {loadingListingsLabel}
              </span>
            </div>
          )}
          {error && (
            <p className="text-center text-sm text-red-500 py-20">{error}</p>
          )}
          {filtered.length > 0 && (
            <>
              <p className="text-[22px] text-[#5f5f5f] mb-3 font-light">
                <strong className="inline-flex min-w-[28px] items-center justify-center text-[#2d2d2d] font-bold">
                  {showingInitialPlaceholders ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d8c188] border-t-[#c2a457]" />
                  ) : (
                    filtered.length
                  )}
                </strong>{" "}
                {staysInCalpeLabel}
                {(loading || loadingDetails) && (
                  <span className="ml-2 text-[#c2a457] text-sm font-medium">
                    · {loadingDetailsLabel}
                  </span>
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    prop={prop}
                    onRetry={retryProperty}
                    onOpen={setSelectedBookingUrl}
                    propertyFallbackLabel={propertyFallbackLabel}
                    loadingDataLabel={cardLoadingDataLabel}
                    retryLabel={retryLabel}
                    previousPhotoLabel={previousPhotoLabel}
                    nextPhotoLabel={nextPhotoLabel}
                    bedroomsShortLabel={bedroomsShortLabel}
                    bedsLabel={bedsLabel}
                    bathroomsLabel={bathroomsLabel}
                    bookingUrl={buildBookingUrl(prop.id, {
                      guests: guestFilter !== "0" ? guestFilter : undefined,
                    })}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {selectedBookingUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 p-3 sm:p-5"
          onClick={() => setSelectedBookingUrl(null)}
        >
          <div
            className="relative mx-auto flex h-full w-full max-w-[1280px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isBookingModalLoading && (
              <div className="absolute inset-x-0 top-0 bottom-[57px] z-10 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3 text-[#6b6b6b]">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8c188] border-t-[#c2a457]" />
                  <span className="text-sm font-medium">{loadingPageLabel}</span>
                </div>
              </div>
            )}
            <iframe
              src={selectedBookingUrl}
              title={bookingPropertyLabel}
              className="min-h-0 flex-1 border-0"
              onLoad={() => setIsBookingModalLoading(false)}
            />
            <div className="flex items-center justify-start gap-3 border-t border-[#e7e7e7] bg-white px-4 py-3 sm:justify-center">
              <a
                href={selectedBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-[#d7d7d7] px-4 py-2 text-sm font-medium text-[#444] transition-colors hover:bg-[#f6f6f6]"
              >
                {visitActualPageLabel}
              </a>
              <button
                type="button"
                onClick={() => setSelectedBookingUrl(null)}
                className="inline-flex items-center rounded-full bg-[#2d2d2d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                {closeModalLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




