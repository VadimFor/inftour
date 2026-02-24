"use client";

import Link from "next/link";
import { useState } from "react";
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
  const [webcamOpen, setWebcamOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-[10px] md:text-xs py-2 px-6 flex justify-between tracking-widest sticky top-0 z-60">
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
          <button
            type="button"
            onClick={() => setWebcamOpen(true)}
            className="flex items-center gap-2 hover:text-brand-gold transition"
          >
            <span
              className="w-2 h-2 rounded-full bg-red-500 shrink-0"
              aria-hidden
            />
            <span>{t("calpeLiveWebcam")}</span>
          </button>
        </div>
      </div>

      {webcamOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("calpeLiveWebcam")}
          onClick={() => setWebcamOpen(false)}
        >
          <div
            className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl aspect-video flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between px-4 py-2 bg-gray-800">
              <span className="text-sm font-bold text-white">
                {t("calpeLiveWebcam")}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={WEBCAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white bg-blue-400/70 hover:bg-blue-400 border border-blue-400/50 rounded-lg px-2 py-1"
                >
                  {t("openInNewTab")}
                </a>
                <button
                  type="button"
                  onClick={() => setWebcamOpen(false)}
                  className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition"
                  aria-label={t("close")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <iframe
              src={WEBCAM_URL}
              title={t("calpeLiveWebcam")}
              className="flex-1 w-full h-full min-h-0 border-0"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
