"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { markImageLoaded } from "../../components/ProgressiveNextImage";
import { RESTAURANT_IMAGES, RESTAURANT_IMAGE_SIZES } from "./sabores/restaurantsImages";
import relax1 from "./relax/1 Gigantes de oro.png";
import relax2 from "./relax/2 Un toque de historia.png";
import relax3 from "./relax/3 Gastronomía y relax.png";
import relax4 from "./relax/4 Mundos submarinos.png";
import relax5 from "./relax/5 Libertad salvaje.png";
import relax6 from "./relax/6 Fiordos secretos.png";
import ascenso1 from "./naturaleza/pictures/Ascenso al Peñón 1.jpeg";
import ascenso2 from "./naturaleza/pictures/Ascenso al Peñón 2.jpeg";
import ascenso3 from "./naturaleza/pictures/Ascenso al Peñón 3.jpeg";
import playas1 from "./naturaleza/pictures/Playas 1.jpeg";
import playas2 from "./naturaleza/pictures/Playas 2.jpeg";
import playas3 from "./naturaleza/pictures/Playas 3.jpeg";
import playas4 from "./naturaleza/pictures/Playas 4.jpeg";
import horizontes1 from "./naturaleza/pictures/Horizontes marinos 1.jpeg";
import horizontes2 from "./naturaleza/pictures/Horizontes marinos 2.jpeg";
import horizontes3 from "./naturaleza/pictures/Horizontes marinos 3.jpeg";
import horizontes4 from "./naturaleza/pictures/Horizontes marinos 4.jpeg";
import salinas1 from "./naturaleza/pictures/Las Salinas 1.jpg";
import salinas2 from "./naturaleza/pictures/Las Salinas 2.jpg";
import salinas3 from "./naturaleza/pictures/Las Salinas 3.png";
import salinas4 from "./naturaleza/pictures/Las Salinas 4.jpg";
import ecosistemaCalpe1 from "./estilo_de_vida/pictures/Ecosistema deportivo de Calpe 1.png";
import ecosistemaCalpe2 from "./estilo_de_vida/pictures/Ecosistema deportivo de Calpe 2.jpg";
import ecosistemaCalpe3 from "./estilo_de_vida/pictures/Ecosistema deportivo de Calpe 3.png";
import ecosistemaCalpe4 from "./estilo_de_vida/pictures/Ecosistema deportivo de Calpe 4.png";
import ecosistemaCalpe5 from "./estilo_de_vida/pictures/Ecosistema deportivo de Calpe 5.jpg";
import ecosistemaCalpe6 from "./estilo_de_vida/pictures/Ecosistema deportivo de Calpe 6.png";
import areas1 from "./familia/pictures/Áreas 1.png";
import feria1 from "./familia/pictures/Feria 1.png";
import calpePlayas1 from "./familia/pictures/Playas 1.jpeg";
import calpePlayas2 from "./familia/pictures/Playas 2.jpeg";
import calpePlayas3 from "./familia/pictures/Playas 3.jpeg";
import calpePlayas4 from "./familia/pictures/Playas 4.jpeg";
import terra1 from "./familia/pictures/Terra 1.png";
import terra2 from "./familia/pictures/Terra 2.png";
import terra3 from "./familia/pictures/Terra 3.png";
import terra4 from "./familia/pictures/Terra 4.png";
import terra5 from "./familia/pictures/Terra 5.png";
import terra6 from "./familia/pictures/Terra 6.png";

const RECIPE_IMAGES = [
  "/sabores/pictures/Recetas 1.png",
  "/sabores/pictures/Recetas 2.png",
  "/sabores/pictures/Recetas 3.png",
  "/sabores/pictures/Recetas 4.png",
  "/sabores/pictures/Recetas 5.png",
  "/sabores/pictures/Recetas 6.png",
  "/sabores/pictures/Recetas 7.png",
  "/sabores/pictures/Recetas 8.png",
  "/sabores/pictures/Recetas 9.png",
  "/sabores/pictures/Recetas 10.png",
] as const;

const MARKET_IMAGES = [
  "/sabores/pictures/Mercado Lonja 4.jpg",
  "/sabores/pictures/Mercado Lonja 3.png",
] as const;

const CYCLING_IMAGES = [
  "/estilo_de_vida/pictures/El Vaticano del ciclismo 1.png",
  "/estilo_de_vida/pictures/El Vaticano del ciclismo 2.jpeg",
  "/estilo_de_vida/pictures/El Vaticano del ciclismo 3.jpeg",
  "/estilo_de_vida/pictures/El Vaticano del ciclismo 4.png",
] as const;

type WarmupImage = {
  src: string | StaticImageData;
  sizes: string;
  quality?: number;
};

const WARMUP_IMAGES: WarmupImage[] = [
  ...RESTAURANT_IMAGES.map((src) => ({
    src,
    sizes: RESTAURANT_IMAGE_SIZES,
    quality: 65,
  })),
  ...MARKET_IMAGES.map((src) => ({
    src,
    sizes: "(max-width: 896px) 100vw, 896px",
    quality: 65,
  })),
  ...RECIPE_IMAGES.map((src) => ({
    src,
    sizes: "(max-width: 640px) 100vw, (max-width: 896px) calc(100vw - 4rem), 800px",
    quality: 65,
  })),
  ...CYCLING_IMAGES.map((src) => ({
    src,
    sizes: "(max-width: 896px) 50vw, 448px",
    quality: 65,
  })),
  ...[relax1, relax2, relax3, relax4, relax5, relax6].map((src) => ({
    src,
    sizes: "100vw",
  })),
  { src: ascenso1, sizes: "min(896px, 100vw)" },
  { src: ascenso2, sizes: "50vw" },
  { src: ascenso3, sizes: "50vw" },
  ...[playas1, playas2, playas3, playas4, horizontes1, horizontes2, horizontes3, horizontes4].map((src) => ({
    src,
    sizes: "50vw",
  })),
  ...[salinas1, salinas2, salinas3, salinas4].map((src) => ({
    src,
    sizes: "50vw",
  })),
  { src: ecosistemaCalpe1, sizes: "(max-width: 640px) 100vw, 400px" },
  { src: ecosistemaCalpe2, sizes: "(max-width: 640px) 100vw, 200px" },
  { src: ecosistemaCalpe3, sizes: "(max-width: 640px) 100vw, 200px" },
  { src: ecosistemaCalpe4, sizes: "33vw" },
  { src: ecosistemaCalpe5, sizes: "33vw" },
  { src: ecosistemaCalpe6, sizes: "33vw" },
  { src: areas1, sizes: "min(896px, 100vw)" },
  { src: feria1, sizes: "min(896px, 100vw)" },
  { src: calpePlayas1, sizes: "(max-width: 640px) 100vw, 50vw" },
  { src: calpePlayas2, sizes: "(max-width: 1024px) 100vw, 896px" },
  { src: calpePlayas3, sizes: "(max-width: 640px) 100vw, 50vw" },
  { src: calpePlayas4, sizes: "(max-width: 1024px) 100vw, 896px" },
  ...[terra1, terra2, terra3, terra4, terra5, terra6].map((src) => ({
    src,
    sizes: "(max-width: 640px) 50vw, 33vw",
  })),
];

function resolveWarmupSrc(src: string | StaticImageData) {
  return typeof src === "string" ? src : src.src;
}

type ExperienciasModalImageWarmupProps = {
  delayMs?: number;
};

export function ExperienciasModalImageWarmup({
  delayMs = 1000,
}: ExperienciasModalImageWarmupProps) {
  const [shouldWarm, setShouldWarm] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldWarm(true);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs]);

  if (!shouldWarm) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed -left-[200vw] top-0 h-px w-screen overflow-hidden opacity-0"
    >
      {WARMUP_IMAGES.map(({ src, sizes, quality }, index) => (
        <div key={`${resolveWarmupSrc(src)}-${sizes}`} className="relative h-px w-full">
          <Image
            src={src}
            alt=""
            fill
            sizes={sizes}
            quality={quality}
            priority={index === 0}
            loading="eager"
            onLoad={() => markImageLoaded(resolveWarmupSrc(src))}
          />
        </div>
      ))}
    </div>
  );
}
