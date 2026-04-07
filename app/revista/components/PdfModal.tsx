"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { DriveFile } from "../../lib/drive";
import { usePdfDetails } from "./usePdfDetails";

type PdfModalProps = {
  file: DriveFile;
  onClose: () => void;
};

export default function PdfModal({ file, onClose }: PdfModalProps) {
  const details = usePdfDetails(file.id);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const title = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[98vh] shadow-2xl overflow-hidden flex flex-col rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded transition"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 pt-6 pb-5 border-b border-gray-200 pr-14 bg-gray-50">
          <div className="h-px w-10 mb-3 bg-brand-gold" />
          <h2
            id="pdf-modal-title"
            className="text-xl font-serif text-gray-900"
          >
            {displayTitle}
          </h2>
          {details?.pages != null && (
            <p className="text-xs font-bold uppercase tracking-widest mt-1 text-brand-gold">
              {details.pages} {details.pages === 1 ? "página" : "páginas"}
            </p>
          )}
        </div>

        {/* PDF viewer */}
        <div className="flex-1 overflow-hidden relative" style={{ minHeight: 0 }}>
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50">
              <svg className="w-8 h-8 animate-spin text-brand-gold" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Cargando revista…</p>
            </div>
          )}
          <iframe
            src={`https://drive.google.com/file/d/${file.id}/preview`}
            className="w-full h-full border-0"
            style={{ minHeight: "75vh", opacity: iframeLoaded ? 1 : 0, transition: "opacity 0.3s" }}
            allow="autoplay"
            title={displayTitle}
            onLoad={() => setIframeLoaded(true)}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50">
          <a
            href={`https://drive.usercontent.google.com/download?id=${file.id}&export=download`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-gold text-white text-sm font-semibold px-5 py-2 rounded transition hover:opacity-90"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-4 h-4"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Descargar PDF
          </a>

          <button
            type="button"
            onClick={onClose}
            className="text-white text-sm font-semibold px-5 py-2 rounded transition hover:opacity-90 bg-brand-darkgray"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
