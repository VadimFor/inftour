const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const CALP_LAT = 38.6448;
const CALP_LON = 0.0452;

// WMO weather code to short label (English)
const WEATHER_LABELS: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  61: "Rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Snow",
  73: "Snow",
  75: "Snow",
  77: "Snow",
  80: "Showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

function labelFromCode(code: number): string {
  return WEATHER_LABELS[code] ?? "Clear";
}

export type CalpWeather = {
  temperature: number;
  condition: string;
  weatherCode: number;
};

/**
 * Fetches current weather for Calpe from Open-Meteo.
 * @see https://open-meteo.com/en/docs
 */
export async function getCalpWeather(): Promise<CalpWeather | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(CALP_LAT),
      longitude: String(CALP_LON),
      current: "temperature_2m,weather_code",
    });
    const res = await fetch(`${OPEN_METEO_URL}?${params}`, {
      next: { revalidate: 3600 }, // cache 1 hour
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };
    const temp = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (typeof temp !== "number") return null;
    return {
      temperature: Math.round(temp),
      condition: typeof code === "number" ? labelFromCode(code) : "Clear",
      weatherCode: typeof code === "number" ? code : 0,
    };
  } catch {
    return null;
  }
}
