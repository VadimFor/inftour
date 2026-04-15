"use client";

import { useState, useEffect } from "react";

const API = "/api/avaibook";
const BOOK = "https://inftour.bookonline.pro/es/property";

const FEAT_LABELS: Record<string, string> = {
  wifi: "WiFi",
  ac: "A/C",
  tv: "TV",
  parking_pago_solicitud: "Parking",
  lavadora: "Lavadora",
  lavavajillas: "Lavavajillas",
  ascensor: "Ascensor",
  calefaccion: "Calefacción",
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
  sofa: "Sofá",
  sistema_antimosquitos: "Antimosquitos",
  cortinas_opacas: "Cortinas opacas",
  piscina: "Piscina",
  piscina_compartida: "Piscina compart.",
};

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
}

type AccommodationListItem = {
  id: number;
  name?: string;
  tradeName?: { es?: string; en?: string };
};

function getAccommodationListName(item: AccommodationListItem): string {
  return item.tradeName?.es || item.name || "";
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
  }));
}

function normalize(a: RawProperty): Property {
  return {
    id: a.id,
    name: a.tradeName?.es || a.name || "",
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
  options?: { guests?: string; startDate?: string; endDate?: string },
): string {
  const params = new URLSearchParams();
  if (options?.guests) params.set("guests", options.guests);
  if (options?.startDate) params.set("startDate", options.startDate);
  if (options?.endDate) params.set("endDate", options.endDate);
  const query = params.toString();
  return query ? `${BOOK}/${propertyId}?${query}` : `${BOOK}/${propertyId}`;
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

// ─── CardCarousel ────────────────────────────────────────────────────────────

function CardCarousel({
  images,
  name,
}: {
  images: Property["images"];
  name: string;
}) {
  const [idx, setIdx] = useState(0);
  const gallery = (images ?? [])
    .filter((img) => Boolean(img.SMALL))
    .slice(0, 5);

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
          aria-label="Foto anterior"
        >
          ‹
        </button>
        <button
          onClick={next}
          disabled={gallery.length <= 1}
          className="absolute z-30 right-3 top-1/2 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-md text-base font-bold text-gray-700 opacity-95 hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ transform: "translateY(-50%)" }}
          aria-label="Foto siguiente"
        >
          ›
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

// ─── PropertyCard ────────────────────────────────────────────────────────────

function PropertyCard({
  prop,
  bookingUrl,
  onRetry,
}: {
  prop: Property;
  bookingUrl: string;
  onRetry: (id: number) => void;
}) {
  const feats = getTopFeats(prop.features);
  const title = prop.name || `Alojamiento #${prop.id}`;
  const location =
    prop.city && prop.region
      ? `${prop.city} (${prop.region})`
      : "Cargando datos...";
  const isPending =
    !prop.images.length &&
    !prop.capacity &&
    !prop.bedrooms &&
    !prop.beds &&
    !prop.bathrooms &&
    !prop.sqm;
  const canRetry = isPending && prop.id > 0;
  const showStatsLoading = isPending;

  return (
    <div
      onClick={() => window.open(bookingUrl, "_blank", "noopener,noreferrer")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(bookingUrl, "_blank", "noopener,noreferrer");
        }
      }}
      className="group bg-white overflow-hidden border border-[#e0e0e0] cursor-pointer transition-all duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] focus-visible:shadow-[0_8px_20px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2a457] focus-visible:ring-offset-2"
      style={{ borderRadius: "12px" }}
    >
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ height: "180px" }}
      >
        <CardCarousel images={prop.images} name={prop.name} />
        {canRetry && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRetry(prop.id);
            }}
            className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full bg-red-600/80 px-5 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm hover:bg-red-600/90 active:bg-red-700/90"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
            Reintentar
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
              text={`${prop.bedrooms} hab.`}
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
              text={`${prop.beds} camas`}
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
              text={`${prop.bathrooms} baños`}
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
                      justifyContent: "center",
                      minWidth: index === 5 ? "38px" : "64px",
                      height: "28px",
                      padding: "4px 10px",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      color: "#555",
                    }}
                  >
                    <span className="block h-3 w-8 animate-pulse rounded-full bg-[#ece7d8]" />
                  </span>
                ))
              : feats.slice(0, 6).map((f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: "12px",
                      padding: "4px 10px",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      color: "#555",
                    }}
                  >
                    {FEAT_LABELS[f]}
                  </span>
                ))}
            {!showStatsLoading && feats.length > 6 && (
              <span
                style={{
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

// ─── GalleryModal ─────────────────────────────────────────────────────────────

export default function ReservaDirectaV2Content() {
  const [properties, setProperties] = useState<Property[]>(() =>
    createInitialGridPlaceholders(9),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestFilter, setGuestFilter] = useState("0");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

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

          results.forEach((result) => {
            if (result.status !== "fulfilled" || !result.value) return;
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
        if (!cancelled) setError("No se pudieron cargar los alojamientos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

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
      } catch {
        // Leave the placeholder and allow another manual retry.
      }
    })();
  }

  return (
    <div className="min-h-screen bg-[#efefef]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Search bar */}
        <div className="pt-3 pb-2">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 overflow-hidden border border-[#d9d9d9] bg-white sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_96px]">
            <div className="border-b border-[#ececec] px-3 py-2 sm:border-r lg:border-b-0">
              <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">Llegada</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/aaaa"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border-0 bg-transparent text-[15px] font-medium text-[#2d2d2d] outline-0 placeholder:text-[#2d2d2d]"
                />
                <span className="text-[12px] text-[#2d2d2d]" aria-hidden>
                  ◴
                </span>
              </div>
            </div>
            <div className="border-b border-[#ececec] px-3 py-2 sm:border-b sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r">
              <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">Salida</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/aaaa"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border-0 bg-transparent text-[15px] font-medium text-[#2d2d2d] outline-0 placeholder:text-[#2d2d2d]"
                />
                <span className="text-[12px] text-[#2d2d2d]" aria-hidden>
                  ◴
                </span>
              </div>
            </div>
            <div className="border-b border-[#ececec] px-3 py-2 sm:border-r sm:border-b-0 lg:border-b-0">
              <label className="mb-1 block text-[8px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e]">Huéspedes</label>
              <select
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
                className="w-full border-0 bg-transparent text-[15px] font-medium text-[#2d2d2d] outline-0"
              >
                <option value="0">2 huéspedes</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "huésped" : "huéspedes"}
                  </option>
                ))}
              </select>
            </div>
            <button className="min-h-[50px] w-full bg-[#c2a457] px-4 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#af944f]">
              Buscar
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[1240px] mx-auto py-4">
          {loading && properties.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-[#C5A85F] rounded-full animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Cargando alojamientos...
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
                alojamientos en Calpe
                {(loading || loadingDetails) && (
                  <span className="ml-2 text-[#c2a457] text-sm font-medium">
                    · cargando detalles...
                  </span>
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    prop={prop}
                    onRetry={retryProperty}
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
    </div>
  );
}
