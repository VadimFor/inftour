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
      const status = err && typeof err === "object" ? (err as { status?: number }).status : undefined;
      if (attempt < retries) {
        await wait(status === 429 ? 1000 * (attempt + 1) : 300 * (attempt + 1));
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

function StatItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#555" }}>
      {icon}
      {text}
    </span>
  );
}

// ─── PropertyCard ────────────────────────────────────────────────────────────

function PropertyCard({
  prop,
  bookingUrl,
}: {
  prop: Property;
  bookingUrl: string;
}) {
  const feats = getTopFeats(prop.features);
  const title = prop.name || `Alojamiento #${prop.id}`;
  const location = prop.city && prop.region
    ? `${prop.city} (${prop.region})`
    : "Cargando datos...";

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
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#111", margin: "0 0 2px", lineHeight: 1.25 }}>
          {title}
        </h3>
        <p style={{ fontSize: "13px", color: "#777", margin: "0 0 12px" }}>
          {location}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "12px", color: "#555", marginBottom: "12px", alignItems: "center" }}>
          {prop.capacity > 0 && (
            <StatItem
              text={`${prop.capacity}`}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              }
            />
          )}
          {prop.bedrooms > 0 && (
            <StatItem
              text={`${prop.bedrooms} hab.`}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              }
            />
          )}
          {prop.beds > 0 && (
            <StatItem
              text={`${prop.beds} camas`}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="6" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 6V4a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              }
            />
          )}
          {prop.bathrooms > 0 && (
            <StatItem
              text={`${prop.bathrooms} baños`}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="6" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 6v4M6 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              }
            />
          )}
          {prop.sqm > 0 && (
            <StatItem
              text={`${prop.sqm} m²`}
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 6h12M6 2v12" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              }
            />
          )}
        </div>
        {feats.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {feats.slice(0, 6).map((f) => (
              <span
                key={f}
                style={{ fontSize: "12px", padding: "4px 10px", border: "1px solid #ddd", borderRadius: "20px", color: "#555" }}
              >
                {FEAT_LABELS[f]}
              </span>
            ))}
            {feats.length > 6 && (
              <span
                style={{ fontSize: "12px", padding: "4px 10px", border: "1px solid #ddd", borderRadius: "20px", color: "#555" }}
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestFilter, setGuestFilter] = useState("0");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const list = (await apiFetchWithRetry("/accommodations/")) as AccommodationListItem[];
        if (cancelled) return;

        const placeholders = list.map((item) => createPlaceholderProperty(item));
        setProperties(placeholders);
        setLoading(false);

        for (const item of list) {
          if (cancelled) return;
          try {
            const detail = await apiFetchWithRetry(
              `/accommodations/${item.id}/`,
            );
            const normalized = normalize(detail as RawProperty);
            if (!cancelled) {
              setProperties((prev) =>
                prev.map((prop) => (prop.id === normalized.id ? normalized : prop)),
              );
            }
          } catch {
            // Keep the placeholder if the upstream still rate-limits it.
          }
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

  return (
    <div className="min-h-screen bg-[#efefef]">
      <style jsx>{`
        .search-row {
          display: grid;
          grid-template-columns: 1fr;
          background: #fff;
          border: 1px solid #d9d9d9;
          overflow: hidden;
          min-height: 50px;
        }
        .search-cell {
          padding: 8px 12px;
          border-bottom: 1px solid #ececec;
        }
        .search-label {
          display: block;
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #8e8e8e;
          margin-bottom: 4px;
        }
        .search-control {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #2d2d2d;
          font-size: 15px;
          font-weight: 500;
        }
        .search-btn {
          border: 0;
          background: #c2a457;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          min-height: 50px;
        }
        @media (min-width: 640px) {
          .search-row {
            grid-template-columns: 1fr 1fr;
          }
          .search-cell {
            border-right: 1px solid #ececec;
          }
          .search-cell:nth-child(2n) {
            border-right: 0;
          }
        }
        @media (min-width: 960px) {
          .search-row {
            grid-template-columns: 1fr 1fr 1fr 96px;
          }
          .search-cell {
            border-bottom: 0;
          }
          .search-cell:nth-child(1),
          .search-cell:nth-child(2),
          .search-cell:nth-child(3) {
            border-right: 1px solid #ececec;
          }
          .search-cell:nth-child(2n) {
            border-right: 1px solid #ececec;
          }
        }
      `}</style>
      <div className="container mx-auto px-4 md:px-6">
        {/* Search bar */}
        <div className="pt-3 pb-2">
          <div className="max-w-[1240px] mx-auto search-row">
            <div className="search-cell">
              <label className="search-label">Llegada</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/aaaa"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="search-control placeholder:text-[#2d2d2d]"
                />
                <span className="text-[12px] text-[#2d2d2d]" aria-hidden>
                  ◴
                </span>
              </div>
            </div>
            <div className="search-cell">
              <label className="search-label">Salida</label>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="dd/mm/aaaa"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="search-control placeholder:text-[#2d2d2d]"
                />
                <span className="text-[12px] text-[#2d2d2d]" aria-hidden>
                  ◴
                </span>
              </div>
            </div>
            <div className="search-cell">
              <label className="search-label">Huéspedes</label>
              <select
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
                className="search-control"
              >
                <option value="0">2 huéspedes</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "huésped" : "huéspedes"}
                  </option>
                ))}
              </select>
            </div>
            <button className="search-btn hover:bg-[#af944f] transition-colors">
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
                <strong className="text-[#2d2d2d] font-bold">
                  {filtered.length}
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
