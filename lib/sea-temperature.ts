const OPEN_METEO_MARINE_URL =
  "https://marine-api.open-meteo.com/v1/marine";

// Calpe coordinates
const CALP_LAT = 38.6448;
const CALP_LON = 0.0452;

/**
 * Fetches current sea surface temperature for Calpe from Open-Meteo Marine API.
 * Returns null on fetch or parse failure.
 * @see https://open-meteo.com/en/docs/marine-weather-api
 */
export async function getCalpSeaTemperature(): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(CALP_LAT),
      longitude: String(CALP_LON),
      current: "sea_surface_temperature",
      cell_selection: "sea",
    });
    const res = await fetch(`${OPEN_METEO_MARINE_URL}?${params}`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      current?: { sea_surface_temperature?: number };
    };
    const value = data.current?.sea_surface_temperature;
    if (typeof value !== "number") return null;
    // Sanity range for Mediterranean sea temp
    if (value < 5 || value > 35) return null;
    return Math.round(value * 10) / 10; // 1 decimal
  } catch {
    return null;
  }
}
