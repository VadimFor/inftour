"use client";

import Link from "next/link";
import { useLangStore } from "@/app/lib/langStore";
import SeaIcon from "./SeaIcon";
import WeatherIcon from "./WeatherIcon";
import type { CalpWeather } from "@/lib/weather";

const WEBCAM_URL =
  "https://ibericam.com/player/modern/player.html?s=4&a=live&v=calpe-playa-del-arenal-bol&i=image-4&l=ibericam";

type TopBarProps = {
  weather: CalpWeather | null;
  seaTemp: number | null;
};

export default function TopBar({ weather, seaTemp }: TopBarProps) {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-[10px] md:text-xs py-2 px-6 flex justify-between tracking-widest">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <span className="text-white/80">Calpe:</span>
          <span
            className="flex items-center shrink-0"
            title={weather?.condition ?? undefined}
          >
            {weather != null ? (
              <WeatherIcon code={weather.weatherCode} className="w-5 h-5" />
            ) : (
              <span
                className="w-5 h-5 rounded-full bg-white/20 block"
                aria-hidden
              />
            )}
          </span>

          {weather != null
            ? `${weather.temperature}°C (${weather.condition})`
            : "—°C"}
        </span>
        <Link
          href="https://www.seatemperature.org/europe/spain/calp.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-brand-gold transition"
          title={t("seaTempTitle")}
        >
          <SeaIcon className="w-4 h-4 shrink-0" />
          <span className="text-white/70">{t("sea")} </span>
          {seaTemp != null ? `${seaTemp}°C` : "—°C"}
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href={WEBCAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-brand-gold transition"
        >
          <span
            className="w-2 h-2 rounded-full bg-red-500 shrink-0"
            aria-hidden
          />
          <span>{t("calpeLiveWebcam")}</span>
        </Link>
      </div>
    </div>
  );
}
