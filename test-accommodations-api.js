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

// Vista rápida en "/" que hace fetch a accommodations automáticamente
app.get("/", async (req, res) => {
  try {
    const token = getTokenOrFail(res);
    if (!token) return;

    const data = await avaibookFetch("/accommodations/", token);
    const items = Array.isArray(data) ? data : [];

    const listHtml = items
      .map((item) => {
        const id = item?.id ?? "";
        const name = item?.tradeName?.es || item?.name || `Alojamiento ${id}`;
        return `<li><a href="/api/accommodations/${id}" target="_blank" rel="noopener noreferrer">${name} (ID: ${id})</a></li>`;
      })
      .join("");

    return res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Alojamientos AvaiBook</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; }
      h1 { margin: 0 0 8px; }
      p { color: #555; }
      ul { line-height: 1.7; padding-left: 20px; }
      a { color: #0b63ce; text-decoration: none; }
      a:hover { text-decoration: underline; }
      .meta { margin-top: 18px; font-size: 13px; color: #666; }
    </style>
  </head>
  <body>
    <h1>Alojamientos</h1>
    <p>Prefetch al iniciar: ${prefetchCount === null ? "en curso" : prefetchCount === -1 ? "error" : `${prefetchCount} alojamientos`}</p>
    <p>Total: ${items.length}</p>
    <ul>${listHtml || "<li>No se recibieron alojamientos</li>"}</ul>
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
    const data = await avaibookFetch(`/accommodations/${id}/`, token);
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

    return res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(data?.tradeName?.es || data?.name || `Alojamiento ${id}`)}</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; margin: 24px; color: #232323; background: #f5f5f5; }
      .wrap { max-width: 1200px; margin: 0 auto; }
      .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
      .links a { margin-left: 10px; color: #0b63ce; text-decoration: none; }
      .card { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 16px; margin-bottom: 14px; }
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

      <section class="card">
        <h1>${escapeHtml(data?.tradeName?.es || data?.name || `Alojamiento ${id}`)}</h1>
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
