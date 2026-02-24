/**
 * Renders a colored icon based on Open-Meteo WMO weather code.
 * Replaces the text label (Clear, Partly cloudy, etc.) with the icon only.
 * @see https://open-meteo.com/en/docs#api_form
 */
export default function WeatherIcon({
  code,
  className = "w-5 h-5",
}: {
  code: number;
  className?: string;
}) {
  const baseProps = { viewBox: "0 0 24 24" as const, "aria-hidden": true };

  // Clear – sun (amber)
  if (code === 0) {
    return (
      <svg {...baseProps} className={`${className} text-amber-400`} fill="currentColor">
        <path d="M12 2.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM3.75 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM17.25 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM12 18.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM3 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12ZM18 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 18 12ZM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
      </svg>
    );
  }

  // Mainly clear (1) – sun + cloud (amber + slate)
  if (code === 1) {
    return (
      <svg {...baseProps} className={className} fill="currentColor">
        <path className="text-amber-400" fill="currentColor" d="M12 4a4 4 0 0 0-4 4c0 .5.1 1 .28 1.45A3.5 3.5 0 0 0 6.5 15h11a3.5 3.5 0 0 0-1.78-6.55C15.9 8 15.5 8 15 8a4 4 0 0 0-3-4Z" />
        <path className="text-slate-300" fill="currentColor" d="M18 10a4 4 0 0 0-7.5 1.5A4 4 0 0 0 6 18h12a4 4 0 0 0 0-8Z" />
      </svg>
    );
  }

  // Partly cloudy (2) – sun + cloud
  if (code === 2) {
    return (
      <svg {...baseProps} className={className} fill="currentColor">
        <path className="text-amber-400" fill="currentColor" d="M12 7a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 7ZM12 18a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 18ZM5.64 9.64a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L5.64 10.7a.75.75 0 0 1 0-1.06ZM16.36 16.36a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM12 10.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
        <path className="text-slate-400" fill="currentColor" d="M19.35 10.04A5.5 5.5 0 0 0 12 6a5.5 5.5 0 0 0-5.35 4.04A4 4 0 0 0 4 14h16a4 4 0 0 0-.65-3.96Z" />
      </svg>
    );
  }

  // Overcast (3), Fog (45, 48) – gray cloud
  if (code === 3 || code === 45 || code === 48) {
    return (
      <svg {...baseProps} className={`${className} text-slate-400`} fill="currentColor">
        <path d="M19.35 10.04A7.5 7.5 0 0 0 12 4c-3.5 0-6.4 2.5-7.1 5.8A5.5 5.5 0 0 0 2 15.5h20a5.5 5.5 0 0 0-2.65-5.46Z" />
      </svg>
    );
  }

  // Rain, drizzle, showers – blue cloud + rain
  if (
    (code >= 51 && code <= 55) ||
    (code >= 61 && code <= 65) ||
    (code >= 80 && code <= 82)
  ) {
    return (
      <svg {...baseProps} className={className} fill="currentColor">
        <path className="text-slate-400" fill="currentColor" d="M12 3a5.5 5.5 0 0 0-5.5 5.5c0 2.1 1.2 3.9 2.9 4.8A4 4 0 0 0 6 17h12a4 4 0 0 0-3.4-3.7A5.5 5.5 0 0 0 12 3Z" />
        <path className="text-sky-400" fill="currentColor" d="M8.5 18.5L10 20l1.5-1.5L10 17l-1.5 1.5ZM14 18.5L15.5 20 17 18.5 15.5 17 14 18.5ZM11 21l1.5-1.5L14 21l-1.5 1.5L11 21Z" />
      </svg>
    );
  }

  // Snow – white/slate cloud + snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return (
      <svg {...baseProps} className={className} fill="currentColor">
        <path className="text-slate-300" fill="currentColor" d="M12 3a5.5 5.5 0 0 0-5.5 5.5c0 1.9 1 3.6 2.5 4.5H6a3 3 0 0 1 0-6h.5a.5.5 0 0 0 .5-.5A4 4 0 0 1 12 4.5a4 4 0 0 1 5 3.5.5.5 0 0 0 .5.5H18a3 3 0 0 1 0 6h-3.5c1.5-.9 2.5-2.6 2.5-4.5A5.5 5.5 0 0 0 12 3Z" />
        <path className="text-white" fill="currentColor" d="M11 12l1.5 1.5L14 12l-1.5-1.5L11 12Zm2 2l1.5 1.5L16 14l-1.5-1.5L13 14Zm-4 0l1.5 1.5L12 14l-1.5-1.5L9 14Zm2 2l1.5 1.5L14 16l-1.5-1.5L11 16Z" />
      </svg>
    );
  }

  // Thunderstorm – dark cloud + yellow lightning
  if (code >= 95 && code <= 99) {
    return (
      <svg {...baseProps} className={className} fill="currentColor">
        <path className="text-slate-500" fill="currentColor" d="M14.5 2a5.5 5.5 0 0 0-5.5 5.5c0 2 .9 3.8 2.3 5H6a3 3 0 0 1 0-6h.5a.5.5 0 0 0 .5-.5A4 4 0 0 1 14.5 3a4 4 0 0 1 4 3.5.5.5 0 0 0 .5.5H20a3 3 0 0 1 0 6h-4.2c1.4-1.2 2.2-2.8 2.2-4.5A5.5 5.5 0 0 0 14.5 2Z" />
        <path className="text-amber-300" fill="currentColor" d="M13 11H9l2.5-4 1.5 2.5L11 14h4l-2 3 1 1 3-4h-4l1-3Z" />
      </svg>
    );
  }

  // Default: clear sun (amber)
  return (
    <svg {...baseProps} className={`${className} text-amber-400`} fill="currentColor">
      <path d="M12 2.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM3.75 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM17.25 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM12 18.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM3 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12ZM18 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 18 12ZM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
    </svg>
  );
}
