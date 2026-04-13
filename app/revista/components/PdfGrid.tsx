"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DriveFileWithSlug, DriveListResult } from "../../lib/drive";
import { getPdfTitle, getThumbnailUrl, withDriveFileSlugs } from "../../lib/drive";
import PdfModal from "./PdfModal";
import { usePdfDetails } from "./usePdfDetails";

type PdfGridProps = {
  driveResult: DriveListResult;
};

function PdfCard({
  file,
  onOpenModal,
}: {
  file: DriveFileWithSlug;
  onOpenModal: (file: DriveFileWithSlug) => void;
}) {
  const details = usePdfDetails(file.id);
  const [preload, setPreload] = useState(false);
  const displayTitle = getPdfTitle(file.name);
  const thumbnailUrl = getThumbnailUrl(file.id);

  return (
    <Link
      href={`/revista/${file.slug}`}
      className="bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col cursor-pointer group rounded-sm w-full lg:w-[calc(50%-12px)] lg:shrink-0 lg:snap-start"
      onMouseEnter={() => setPreload(true)}
      onClick={(e) => {
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }

        e.preventDefault();
        onOpenModal(file);
      }}
      aria-label={`Open ${displayTitle}`}
    >
      <div className="relative h-48 shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={displayTitle}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="p-6 flex flex-col flex-1 gap-2">
        <h4 className="text-xl font-serif text-gray-900 group-hover:text-brand-gold transition">
          {displayTitle}
        </h4>
        {details?.excerpt && (
          <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-3">
            {details.excerpt}
          </p>
        )}
        {details === null ? (
          <div className="mt-auto ml-auto h-3 w-16 bg-gray-100 rounded animate-pulse" />
        ) : details.pages !== null ? (
          <p className="text-xs text-right mt-auto text-brand-gold font-semibold uppercase tracking-widest">
            {details.pages} {details.pages === 1 ? "página" : "páginas"}
          </p>
        ) : null}
      </div>
      {preload && (
        <iframe
          src={`https://drive.google.com/file/d/${file.id}/preview`}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          title=""
        />
      )}
    </Link>
  );
}

export default function PdfGrid({ driveResult }: PdfGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<DriveFileWithSlug | null>(null);

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

  const files: DriveFileWithSlug[] = withDriveFileSlugs(driveResult.files);

  if (files.length === 0) {
    return <p className="italic text-gray-400 text-sm">No PDF files found.</p>;
  }

  return (
    <>
      <div className="relative">
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

        <div ref={scrollRef} className="flex flex-col gap-8 lg:flex-row lg:overflow-x-auto lg:snap-x lg:snap-mandatory lg:pb-4 lg:gap-6">
          {files.map((file) => (
            <PdfCard key={file.id} file={file} onOpenModal={setSelected} />
          ))}
        </div>
      </div>

      {selected ? (
        <PdfModal file={selected} onClose={() => setSelected(null)} />
      ) : null}
    </>
  );
}
