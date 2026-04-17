/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * API de prueba de alojamientos AvaiBook.
 * Al arrancar, hace un prefetch automático para validar token y conexión.
 */

const express = require("express");
const fs = require("fs");
const path = require("path");

function loadEnvLocalFile() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) return;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadEnvLocalFile();

const app = express();
const PORT = 3001;
const AVAIBOOK_API = "https://api.avaibook.com/api/owner";
const NEXT_APP_BASE_URL = process.env.NEXT_APP_BASE_URL || "http://localhost:3000";
let prefetchCount = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function kv(label, value) {
  if (value === undefined || value === null || value === "") return "";
  return `<div class="kv"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function formatApiDate(date) {
  return date.toISOString().slice(0, 10);
}

function isIsoDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function looksUnavailable(value) {
  if (typeof value === "number") return value !== 0;
  if (typeof value === "boolean") return !value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    const parsed = Number.parseFloat(normalized);
    if (Number.isFinite(parsed)) return parsed !== 0;
    return (
      normalized.includes("unavailable") ||
      normalized.includes("occupied") ||
      normalized.includes("booked") ||
      normalized.includes("reserved") ||
      normalized.includes("no disponible")
    );
  }
  if (!value || typeof value !== "object") return false;
  if (typeof value.available === "boolean") return !value.available;
  if (typeof value.isAvailable === "boolean") return !value.isAvailable;
  if (typeof value.booked === "boolean") return value.booked;
  if (typeof value.value === "number") return value.value !== 0;
  return false;
}

function isUnavailableCalendarRange(record, normalizedType) {
  if (
    normalizedType.includes("BLOCKED") ||
    normalizedType.includes("BOOKED") ||
    normalizedType.includes("RESERVED") ||
    normalizedType.includes("PAID") ||
    normalizedType.includes("UNAVAILABLE") ||
    normalizedType.includes("OCCUPIED")
  ) {
    return true;
  }

  return typeof record.booking === "string" && record.booking.trim().length > 0;
}

function extractUnavailableDates(payload, unavailableDates, depth = 0) {
  if (!payload || depth > 6) return;
  if (Array.isArray(payload)) {
    payload.forEach((item) => extractUnavailableDates(item, unavailableDates, depth + 1));
    return;
  }
  if (typeof payload !== "object") return;

  const record = payload;
  if (
    typeof record.startDate === "string" &&
    typeof record.endDate === "string" &&
    isIsoDateKey(record.startDate) &&
    isIsoDateKey(record.endDate)
  ) {
    const type = typeof record.type === "string" ? record.type.trim().toUpperCase() : "";
    const isBlockedRange = isUnavailableCalendarRange(record, type);
    if (isBlockedRange) {
      const cursor = new Date(record.startDate);
      const end = new Date(record.endDate);
      while (cursor <= end) {
        unavailableDates.add(formatApiDate(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    }
  }

  const dateCandidate =
    typeof record.date === "string"
      ? record.date
      : typeof record.day === "string"
        ? record.day
        : typeof record.dt === "string"
          ? record.dt
          : null;
  if (dateCandidate && isIsoDateKey(dateCandidate) && looksUnavailable(record)) {
    unavailableDates.add(dateCandidate);
  }

  Object.entries(record).forEach(([key, value]) => {
    if (isIsoDateKey(key) && looksUnavailable(value)) {
      unavailableDates.add(key);
      return;
    }
    extractUnavailableDates(value, unavailableDates, depth + 1);
  });
}

function buildAvailabilityCalendars(unavailableDates, startDate, monthsToRender = 3) {
  const today = new Date();
  const weekdays = ["L", "M", "X", "J", "V", "S", "D"];
  const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
  const cards = [];
  const todayIso = formatApiDate(today);
  const unavailableSet = unavailableDates instanceof Set ? unavailableDates : new Set();

  for (let monthOffset = 0; monthOffset < monthsToRender; monthOffset += 1) {
    const monthAnchor = new Date(startDate.getFullYear(), startDate.getMonth() + monthOffset, 1);
    const year = monthAnchor.getFullYear();
    const month = monthAnchor.getMonth();
    const firstWeekdayMonBased = (new Date(year, month, 1).getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstWeekdayMonBased; i += 1) {
      cells.push('<span class="cal-day cal-day--empty" aria-hidden="true"></span>');
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const isoDate = formatApiDate(new Date(year, month, day));
      const isPast = isoDate < todayIso;
      const unavailable = !isPast && unavailableSet.has(isoDate);
      const isToday = isoDate === todayIso;
      const classes = [
        "cal-day",
        isPast ? "cal-day--past" : "",
        unavailable ? "cal-day--unavailable" : "",
        isToday ? "cal-day--today" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const title = unavailable
        ? `${isoDate} · no disponible`
        : `${isoDate} · disponible`;
      cells.push(`<span class="${classes}" title="${escapeHtml(title)}">${day}</span>`);
    }

    cards.push(`
      <article class="cal-card">
        <h3>${escapeHtml(monthFormatter.format(monthAnchor))}</h3>
        <div class="cal-weekdays">${weekdays.map((d) => `<span>${d}</span>`).join("")}</div>
        <div class="cal-grid">${cells.join("")}</div>
      </article>
    `);
  }

  return cards.join("");
}

async function avaibookFetch(path, token) {
  const response = await fetch(`${AVAIBOOK_API}${path}`, {
    headers: {
      "X-AUTH-TOKEN": token,
      accept: "application/json",
    },
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const error = new Error(`Avaibook ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function avaibookBatchFetch(ids) {
  const params = new URLSearchParams();
  ids.forEach((id) => {
    params.append("id", String(id));
  });

  const response = await fetch(`${NEXT_APP_BASE_URL}/api/avaibook-batch?${params.toString()}`, {
    headers: {
      accept: "application/json",
    },
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const error = new Error(`Batch ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return Array.isArray(data?.results) ? data.results : [];
}

function getTokenOrFail(res) {
  const token = process.env.AVAIBOOK_TOKEN;
  if (!token) {
    res.status(400).json({
      error: "Falta AVAIBOOK_TOKEN en variables de entorno.",
    });
    return null;
  }
  return token;
}

// Vista rápida en "/" con lista simple (ID + título)
app.get("/", async (req, res) => {
  try {
    const token = getTokenOrFail(res);
    if (!token) return;

    const data = await avaibookFetch("/accommodations/", token);
    const listApiUrl = `${AVAIBOOK_API}/accommodations/`;
    const items = Array.isArray(data) ? data : [];
    const listHtml = items
      .map((item) => {
        const id = item?.id;
        const title =
          item?.tradeName?.es ||
          item?.tradeName?.en ||
          item?.name ||
          (Number.isFinite(id) ? `Alojamiento ${id}` : "Alojamiento sin ID");
        if (!Number.isFinite(id)) {
          return `<li><span class="id">—</span><span>${escapeHtml(title)}</span></li>`;
        }
        return `<li>
          <span class="id">${escapeHtml(id)}</span>
          <a href="/api/accommodations/${escapeHtml(id)}">${escapeHtml(title)}</a>
        </li>`;
      })
      .join("");

    return res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Alojamientos AvaiBook</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; background: #f4f4f4; color: #232323; }
      h1 { margin: 0 0 8px; }
      p { color: #555; }
      a { color: #0b63ce; text-decoration: none; }
      a:hover { text-decoration: underline; }
      .meta { margin-top: 18px; font-size: 13px; color: #666; }
      .list-api {
        margin: 10px 0 12px;
        font-size: 12px;
        color: #0f2a5a;
        word-break: break-all;
        background: linear-gradient(180deg, #dbeafe 0%, #cfe4ff 100%);
        border: 1px solid #93c5fd;
        border-radius: 12px;
        padding: 10px 12px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .api-info-icon {
        width: 18px;
        height: 18px;
        min-width: 18px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 1;
        font-weight: 700;
        color: #ffffff;
        background: #2563eb;
        margin-top: 1px;
      }
      .api-call-content { min-width: 0; }
      .api-call-label {
        display: block;
        font-weight: 700;
        color: #1d4ed8;
        margin-bottom: 2px;
      }
      .list-api code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 12px;
        color: #0b1220;
      }
      .list { margin-top: 16px; background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 10px 14px; }
      .list ul { list-style: none; margin: 0; padding: 0; }
      .list li { display: flex; gap: 12px; align-items: baseline; padding: 8px 2px; border-bottom: 1px solid #f0f0f0; }
      .list li:last-child { border-bottom: none; }
      .id { min-width: 56px; font-weight: 700; color: #555; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    </style>
  </head>
  <body>
    <h1>Alojamientos</h1>
    <p>Prefetch al iniciar: ${prefetchCount === null ? "en curso" : prefetchCount === -1 ? "error" : `${prefetchCount} alojamientos`}</p>
    <p>Total: ${items.length}</p>
    <p>Haz click en el título para abrir el detalle completo del alojamiento.</p>
    <p class="list-api">
      <span class="api-info-icon" aria-hidden="true">i</span>
      <span class="api-call-content">
        <span class="api-call-label">API listado</span>
        <code>${escapeHtml(listApiUrl)}</code>
      </span>
    </p>
    <section class="list">
      <ul>${listHtml || "<li><span>No se recibieron alojamientos</span></li>"}</ul>
    </section>
    <p class="meta">
      JSON completo:
      <a href="/api/accommodations" target="_blank" rel="noopener noreferrer">/api/accommodations</a>
    </p>
  </body>
</html>`);
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      return res.status(error.status).send(
        `<h1>Error ${error.status}</h1><pre>${JSON.stringify(error.data, null, 2)}</pre>`,
      );
    }

    return res.status(500).send(
      `<h1>Error interno</h1><pre>${error instanceof Error ? error.message : String(error)}</pre>`,
    );
  }
});

// Lista de alojamientos
app.get("/api/accommodations", async (req, res) => {
  try {
    const token = getTokenOrFail(res);
    if (!token) return;
    const data = await avaibookFetch("/accommodations/", token);
    return res.json(data);
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      return res.status(error.status).json({
        error: "Error al consultar Avaibook",
        status: error.status,
        data: error.data,
      });
    }

    return res.status(500).json({
      error: "Error interno en la prueba",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Detalle de un alojamiento por ID
app.get("/api/accommodations/:id", async (req, res) => {
  try {
    const token = getTokenOrFail(res);
    if (!token) return;

    const { id } = req.params;
    const detailPath = `/accommodations/${id}/`;
    const detailApiUrl = `${AVAIBOOK_API}${detailPath}`;
    const data = await avaibookFetch(detailPath, token);
    if (req.query.format === "json") {
      return res.json(data);
    }

    const images = Array.isArray(data?.images) ? data.images : [];
    const features = data?.features && typeof data.features === "object"
      ? Object.entries(data.features).filter(([, v]) => v === "1" || v === 1 || v === true)
      : [];
    const location = data?.location ?? {};
    const unit = Array.isArray(data?.units) ? data.units[0] : null;
    const unitSeasons = Array.isArray(unit?.unitSeasons) ? unit.unitSeasons : [];
    const availabilityStartDate = new Date();
    const availabilityEndDate = new Date(
      availabilityStartDate.getFullYear(),
      availabilityStartDate.getMonth() + 3,
      0,
    );
    const availabilityPath = `/accommodations/${id}/calendar?startDate=${formatApiDate(availabilityStartDate)}&endDate=${formatApiDate(availabilityEndDate)}`;
    const calendarApiUrl = `${AVAIBOOK_API}${availabilityPath}`;
    const unavailableDates = new Set();
    let availabilityError = "";

    try {
      const availabilityRaw = await avaibookFetch(availabilityPath, token);
      extractUnavailableDates(availabilityRaw, unavailableDates);
    } catch (availabilityErr) {
      availabilityError =
        availabilityErr instanceof Error
          ? availabilityErr.message
          : "No se pudo cargar disponibilidad";
    }

    const imagesHtml = images.length
      ? images
          .slice(0, 24)
          .map((img) => {
            const src = img?.SMALL || img?.BIG || img?.ORIGINAL || "";
            const href = img?.ORIGINAL || img?.BIG || src;
            return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(src)}" loading="lazy" alt="Foto alojamiento" /></a>`;
          })
          .join("")
      : "<p>Sin imágenes</p>";

    const featsHtml = features.length
      ? features
          .slice(0, 80)
          .map(([k]) => `<li>${escapeHtml(k)}</li>`)
          .join("")
      : "<li>Sin características</li>";

    const seasonsHtml = unitSeasons.length
      ? unitSeasons
          .slice(0, 16)
          .map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.dateIni)}</td><td>${escapeHtml(s.dateEnd)}</td><td>${escapeHtml(s.minimumStay)}</td><td>${escapeHtml(s.weekPrice)}</td></tr>`)
          .join("")
      : "<tr><td colspan=\"5\">Sin temporadas</td></tr>";
    const availabilityCalendarHtml = buildAvailabilityCalendars(
      unavailableDates,
      new Date(availabilityStartDate.getFullYear(), availabilityStartDate.getMonth(), 1),
      3,
    );

    return res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(data?.tradeName?.es || data?.name || `Alojamiento ${id}`)}</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; margin: 24px; color: #232323; background: #f3f7ff; }
      .wrap { max-width: 1200px; margin: 0 auto; }
      .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
      .links a { margin-left: 10px; color: #0b63ce; text-decoration: none; }
      .card { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 16px; margin-bottom: 14px; }
      .card--calendar { background: #f6f9ff; }
      h1 { margin: 0 0 6px; font-size: 27px; }
      h2 { margin: 0 0 12px; font-size: 18px; }
      p { margin: 6px 0; line-height: 1.5; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 20px; }
      .kv { display: flex; justify-content: space-between; gap: 10px; border-bottom: 1px dashed #eee; padding: 7px 0; }
      .kv span { color: #666; }
      .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; }
      .gallery img { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; }
      .features { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 6px 12px; margin: 0; padding-left: 18px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th, td { border-bottom: 1px solid #eee; text-align: left; padding: 8px 6px; }
      th { color: #666; font-weight: 600; }
      .cal-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
      .cal-title {
        border-left: 4px solid #0071e3;
        padding-left: 10px;
      }
      .cal-head p { margin: 0; color: #6a6a6a; font-size: 13px; }
      .cal-api, .detail-api {
        margin: 10px 0 12px;
        font-size: 12px;
        color: #0f2a5a;
        word-break: break-all;
        background: linear-gradient(180deg, #dbeafe 0%, #cfe4ff 100%);
        border: 1px solid #93c5fd;
        border-radius: 12px;
        padding: 10px 12px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .detail-api { margin-top: 6px; }
      .api-info-icon {
        width: 18px;
        height: 18px;
        min-width: 18px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 1;
        font-weight: 700;
        color: #ffffff;
        background: #2563eb;
        margin-top: 1px;
      }
      .api-call-content { min-width: 0; }
      .api-call-label {
        display: block;
        font-weight: 700;
        color: #1d4ed8;
        margin-bottom: 2px;
      }
      .cal-api code, .detail-api code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 12px;
        color: #0b1220;
      }
      .cal-wrap { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; }
      .cal-card {
        background: linear-gradient(180deg, #ffffff, #fbfbfd);
        border: 1px solid #ebebf0;
        border-radius: 18px;
        padding: 14px 14px 16px;
        box-shadow: 0 14px 28px -22px rgba(0, 0, 0, 0.5);
      }
      .cal-card h3 {
        margin: 0 0 10px;
        font-size: 17px;
        font-weight: 600;
        text-transform: capitalize;
      }
      .cal-weekdays, .cal-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 6px;
      }
      .cal-weekdays { margin-bottom: 8px; }
      .cal-weekdays span {
        text-align: center;
        font-size: 11px;
        color: #8e8e93;
        font-weight: 600;
      }
      .cal-day {
        height: 30px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        font-size: 13px;
        color: #1d1d1f;
        background: #f4f4f7;
        border: 1px solid transparent;
      }
      .cal-day--empty { background: transparent; border-color: transparent; }
      .cal-day--past {
        background: #ececf1;
        color: #9a9aa2;
        border-color: transparent;
      }
      .cal-day--today {
        border-color: #60a5fa;
        box-shadow: inset 0 0 0 1px #bfdbfe;
        font-weight: 700;
      }
      .cal-day--unavailable {
        background: #ffe5e8;
        color: #b00020;
        border-color: #ffb8c4;
        font-weight: 700;
      }
      .cal-day--today.cal-day--unavailable {
        border-color: #60a5fa;
        box-shadow: inset 0 0 0 1px #bfdbfe;
      }
      .cal-legend { margin-top: 10px; display: flex; gap: 14px; color: #555; font-size: 12px; }
      .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; vertical-align: middle; }
      .legend-dot--busy { background: #ff5a6f; }
      .legend-dot--today { background: #0071e3; }
      .cal-error {
        margin-top: 8px;
        color: #b00020;
        font-size: 13px;
      }
      @media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="top">
        <a href="/" style="color:#0b63ce;text-decoration:none;">← Volver al listado</a>
        <div class="links">
          <a href="/api/accommodations/${escapeHtml(id)}?format=json" target="_blank" rel="noopener noreferrer">Ver JSON</a>
        </div>
      </div>

      <section class="card card--calendar">
        <div class="cal-head">
          <h2 class="cal-title" style="margin-bottom:0;">Calendario de disponibilidad</h2>
          <p>Días no disponibles en rojo</p>
        </div>
        <p class="cal-api">
          <span class="api-info-icon" aria-hidden="true">i</span>
          <span class="api-call-content">
            <span class="api-call-label">API calendario</span>
            <code>${escapeHtml(calendarApiUrl)}</code>
          </span>
        </p>
        <div class="cal-wrap">
          ${availabilityCalendarHtml}
        </div>
        <div class="cal-legend">
          <span><i class="legend-dot legend-dot--busy"></i>No disponible</span>
          <span><i class="legend-dot legend-dot--today"></i>Hoy</span>
        </div>
        ${availabilityError ? `<p class="cal-error">${escapeHtml(availabilityError)}</p>` : ""}
      </section>
      <section class="card">
        <h1>${escapeHtml(data?.tradeName?.es || data?.name || `Alojamiento ${id}`)}</h1>
        <p class="detail-api">
          <span class="api-info-icon" aria-hidden="true">i</span>
          <span class="api-call-content">
            <span class="api-call-label">API detalle</span>
            <code>${escapeHtml(detailApiUrl)}</code>
          </span>
        </p>
        <p>${escapeHtml(data?.accommodationType || "")} · ${escapeHtml(location.city || "")} (${escapeHtml(location.region || "")})</p>
        <p>${escapeHtml(data?.introduction?.es || "")}</p>
      </section>
      <section class="card">
        <h2>Datos principales</h2>
        <div class="grid">
          <div>
            ${kv("ID", data?.id)}
            ${kv("Estado", data?.status)}
            ${kv("Licencia", data?.license)}
            ${kv("Web", data?.web)}
            ${kv("Check-in", data?.entryTime)}
            ${kv("Check-out", data?.departureTime)}
          </div>
          <div>
            ${kv("Dirección", location.address)}
            ${kv("Código postal", location.zipCode)}
            ${kv("Ciudad", location.city)}
            ${kv("Región", location.region)}
            ${kv("País", location.country)}
            ${kv("Coordenadas", `${location.latitude ?? ""}, ${location.longitude ?? ""}`)}
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Descripción (ES)</h2>
        <p>${escapeHtml(data?.description?.es || "Sin descripción")}</p>
      </section>

      <section class="card">
        <h2>Galería (${images.length})</h2>
        <div class="gallery">${imagesHtml}</div>
      </section>

      <section class="card">
        <h2>Características activas (${features.length})</h2>
        <ul class="features">${featsHtml}</ul>
      </section>

      <section class="card">
        <h2>Temporadas de la primera unidad</h2>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Inicio</th><th>Fin</th><th>Mín. noches</th><th>Precio base</th></tr>
          </thead>
          <tbody>${seasonsHtml}</tbody>
        </table>
      </section>
    </div>
  </body>
</html>`);
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      if (req.query.format === "json") {
        return res.status(error.status).json({
          error: "Error al consultar Avaibook",
          status: error.status,
          data: error.data,
        });
      }
      return res.status(error.status).send(
        `<h1>Error ${error.status}</h1><pre>${escapeHtml(JSON.stringify(error.data, null, 2))}</pre>`,
      );
    }

    if (req.query.format === "json") {
      return res.status(500).json({
        error: "Error interno en la prueba",
        message: error instanceof Error ? error.message : String(error),
      });
    }
    return res.status(500).send(
      `<h1>Error interno</h1><pre>${escapeHtml(error instanceof Error ? error.message : String(error))}</pre>`,
    );
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de prueba activo en http://localhost:${PORT}`);
  void (async () => {
    try {
      const token = process.env.AVAIBOOK_TOKEN;
      if (!token) {
        prefetchCount = -1;
        console.error("Prefetch error: falta AVAIBOOK_TOKEN en variables de entorno.");
        return;
      }
      const data = await avaibookFetch("/accommodations/", token);
      const items = Array.isArray(data) ? data : [];
      prefetchCount = items.length;
      console.log(`Prefetch OK: ${items.length} alojamientos cargados.`);
    } catch (error) {
      prefetchCount = -1;
      console.error(
        `Prefetch error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  })();
});
