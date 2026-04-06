"use client";

import { useEffect, useRef, useState } from "react";
import type { DriveFile, DrivePdfResult } from "../../lib/drive";
import PdfModal from "./PdfModal";

type PdfGridProps = {
  driveResult: DrivePdfResult;
};

export default function PdfGrid({ driveResult }: PdfGridProps) {
  const [selected, setSelected] = useState<DriveFile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) === 0) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY * 0.4, behavior: "auto" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 24
      : 300;
    el.scrollBy({ left: dir === "right" ? cardWidth : -cardWidth, behavior: "smooth" });
  }

  if (!driveResult.ok) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 border border-red-200 bg-red-50 rounded-sm px-4 py-3">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden>
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        {driveResult.error === "no_api_key"
          ? "Google Drive API key not found. Add GOOGLE_API_KEY to your .env.local file."
          : "Google Drive API key is not working. Please check your GOOGLE_API_KEY."}
      </div>
    );
  }

  const files = driveResult.files;

  if (files.length === 0) {
    return (
      <p className="italic text-gray-400 text-sm">No PDF files found.</p>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Anterior"
          className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border border-gray-200 shadow-sm rounded-full text-gray-500 hover:text-brand-gold hover:border-brand-gold transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Siguiente"
          className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border border-gray-200 shadow-sm rounded-full text-gray-500 hover:text-brand-gold hover:border-brand-gold transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

      {/* mobile: vertical stack — lg: horizontal scroll showing ~2 cards */}
      <div ref={scrollRef} className="flex flex-col gap-8 lg:flex-row lg:overflow-x-auto lg:snap-x lg:snap-mandatory lg:pb-4 lg:gap-6">
        {files.map((file) => {
          const title = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
          const displayTitle =
            title.charAt(0).toUpperCase() + title.slice(1);

          return (
            <div
              key={file.id}
              className="bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col cursor-pointer group rounded-sm w-full lg:w-[calc(50%-12px)] lg:shrink-0 lg:snap-start"
              onClick={() => setSelected(file)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(file);
              }}
              aria-label={`Abrir ${displayTitle}`}
            >
              <div className="relative h-48 shrink-0 overflow-hidden">
                {file.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.thumbnail}
                    alt={displayTitle}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1 gap-2">
                <h4 className="text-xl font-serif text-gray-900 group-hover:text-brand-gold transition">
                  {displayTitle}
                </h4>
                {file.excerpt && (
                  <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-3">
                    {file.excerpt}
                  </p>
                )}
                {file.pages !== null && (
                  <p className="text-xs text-right mt-auto text-brand-gold font-semibold uppercase tracking-widest">
                    {file.pages} {file.pages === 1 ? "página" : "páginas"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {selected && (
        <PdfModal file={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
