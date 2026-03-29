"use client";

import Link from "next/link";
import { useLangStore } from "@/app/lib/langStore";

import WeatherIcon from "./WeatherIcon";
import type { CalpWeather } from "@/lib/weather";

const WEBCAM_URL =
  "https://ibericam.com/player/modern/player.html?s=4&a=live&v=calpe-playa-del-arenal-bol&i=image-4&l=ibericam";

const SKYLINE_PAGE_URL =
  "https://www.skylinewebcams.com/es/webcam/espana/comunidad-valenciana/alicante/calpe-penon-de-ifach.html";
const WEBCAM_3_URL =
  "https://www.comunitatvalenciana.com/es/alacant-alicante/calp/webcams/calp-playa-de-la-fossa";

type TopBarProps = {
  weather: CalpWeather | null;
  seaTemp: number | null;
};

export default function TopBar({ weather, seaTemp }: TopBarProps) {
  useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);
  return (
    <div
      className="bg-brand-darkgray text-white text-[11px] md:text-xs py-2 px-4 md:px-6 flex justify-between items-center tracking-wide font-bold"
    >
      <div className="flex items-center gap-1.5">
        <span className="hidden sm:inline text-white/70">
          {t("nowInCalpe")}
        </span>
        <span className="sm:hidden text-white/70">Calpe:</span>
        <span className="font-medium">
          {weather != null ? `${weather.temperature}°C` : "—°C"}
        </span>
        <span
          className="flex items-center shrink-0"
          title={weather?.condition ?? undefined}
        >
          {weather != null ? (
            <WeatherIcon code={weather.weatherCode} className="w-4 h-4" />
          ) : (
            <span
              className="w-4 h-4 rounded-full bg-white/20 block"
              aria-hidden
            />
          )}
        </span>
        <span className="flex items-center gap-1">
          <span className="hidden sm:inline text-white/70">{t("agua")}:</span>
          <span className="sm:hidden text-white/70">{t("sea")}:</span>
          <span className="font-medium">
            {seaTemp != null ? `${seaTemp}°C` : "—°C"}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <Link
          href={WEBCAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-brand-gold transition"
        >
          <span
            className="w-2 h-2 rounded-full bg-red-500 shrink-0"
            aria-hidden
          />
          <span className="hidden sm:inline">{t("webcam1")}</span>
          <span className="sm:hidden">{t("cam1")}</span>
        </Link>

        <Link
          href={SKYLINE_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-brand-gold transition"
        >
          <span
            className="w-2 h-2 rounded-full bg-brand-gold shrink-0"
            aria-hidden
          />
          <span className="hidden sm:inline">{t("webcam2")}</span>
          <span className="sm:hidden">{t("cam2")}</span>
        </Link>

        <Link
          href={WEBCAM_3_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-brand-gold transition"
        >
          <span
            className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
            aria-hidden
          />
          <span className="hidden sm:inline">{t("webcam3")}</span>
          <span className="sm:hidden">{t("cam3")}</span>
        </Link>
      </div>
    </div>
  );
}
