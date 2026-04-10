"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";

/** Neutral micro-blur before LQIP or HQ paint (modal tiles, static imports, public paths). */
export const MODAL_MICRO_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRwfAEcbH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBf/EABkRAAICAwAAAAAAAAAAAAAAAAABAhEDMEL/2gAMAwEAAhEDEQA/AKGpCp//2Q==";

// Tracks images that have already been loaded at least once in this browser session.
const loadedImageSrcs = new Set<string>();

function resolveImageSrc(src: string | StaticImageData): string {
  return typeof src === "string" ? src : src.src;
}

function lqipSrc(fullSrc: string): string {
  const params = new URLSearchParams({
    url: fullSrc,
    w: "64",
    q: "10",
  });
  return `/_next/image?${params.toString()}`;
}

export type ProgressiveNextImageProps = {
  src: string | StaticImageData;
  alt: string;
  sizes: string;
  /** Full-quality optimized payload (default 65; must exist in next.config images.qualities). */
  quality?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  onError?: () => void;
  /** Appended to the HQ <Image> (e.g. hover scale, object-fit). Parent must be `relative` with explicit dimensions. */
  imageClassName?: string;
};

/**
 * Tiny blurred LQIP via the image optimizer, then cross-fades to full-quality Next/Image.
 * Use inside a `relative` container with width/height (or aspect-ratio).
 */
export function ProgressiveNextImage({
  src,
  alt,
  sizes,
  quality = 65,
  priority,
  loading,
  onError,
  imageClassName = "",
}: ProgressiveNextImageProps) {
  const isPriority = Boolean(priority);
  const resolvedSrc = resolveImageSrc(src);
  const alreadyLoaded = typeof window !== "undefined" && loadedImageSrcs.has(resolvedSrc);
  const useProgressive = !isPriority && !alreadyLoaded;
  const [hqReady, setHqReady] = useState(alreadyLoaded);
  const [lqipHidden, setLqipHidden] = useState(false);
  const lqipUrl = lqipSrc(resolvedSrc);

  return (
    <div className="relative h-full w-full bg-stone-200/60">
      {useProgressive && !lqipHidden && (
        // eslint-disable-next-line @next/next/no-img-element -- intentional tiny LQIP; not duplicate of <Image> semantics
        <img
          src={lqipUrl}
          alt=""
          decoding="async"
          className={`absolute inset-0 z-0 h-full w-full object-cover blur-[3px] transition-opacity duration-300 ease-out ${
            hqReady ? "opacity-0" : "opacity-100"
          }`}
          onError={() => setLqipHidden(true)}
          aria-hidden
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={loading}
        placeholder={useProgressive ? "blur" : "empty"}
        blurDataURL={useProgressive ? MODAL_MICRO_BLUR_DATA_URL : undefined}
        onLoad={() => {
          loadedImageSrcs.add(resolvedSrc);
          setHqReady(true);
        }}
        onError={onError}
        className={`z-1 ${useProgressive ? "transition-opacity duration-500 ease-out" : ""} ${
          useProgressive ? (hqReady ? "opacity-100" : "opacity-0") : "opacity-100"
        } ${imageClassName || "object-cover"}`.trim()}
      />
    </div>
  );
}
