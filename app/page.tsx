import PageShell from "./components/PageShell";
import { buildPageMetadata } from "./lib/metadata";
import ReservaDirectaV2Content from "./reserva-directa-v2/components/ReservaDirectaV2Content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rent.inftour.es";
const HOME_H1 = "Reserva directa en Calpe | INFTOUR";
const HOME_SEO_PARAGRAPHS = [
  "INFTOUR ofrece reserva directa en Calpe para viajeros que buscan apartamentos bien ubicados, atención personalizada y un proceso de contratación claro. En nuestra plataforma puedes consultar disponibilidad real, comparar opciones por zona y confirmar tu estancia sin intermediarios. Trabajamos con alojamientos seleccionados por confort, equipamiento y cercanía a playa, ocio, servicios y puntos de interés de la Costa Blanca. Nuestro equipo local acompaña cada reserva para resolver dudas antes, durante y después del viaje.",
  "Si viajas en pareja, en familia o por trabajo, en rent.inftour.es encontrarás apartamentos en Calpe adaptados a diferentes necesidades de espacio, presupuesto y fechas. Mostramos información útil para tomar decisiones: capacidad, distribución, características del edificio, normas de estancia y detalles prácticos para la llegada. También facilitamos una experiencia de entrada sencilla y soporte continuo para incidencias habituales. El objetivo es que reserves con confianza y disfrutes una estancia cómoda desde el primer día.",
  "Reserva directa en Calpe con INFTOUR significa elegir una gestión cercana y profesional, con comunicación rápida y orientación en cada paso. Conocemos el destino y te ayudamos a encontrar la opción más adecuada según el tipo de viaje, la duración de la estancia y tus prioridades. Además de la reserva, compartimos recomendaciones locales para aprovechar mejor Calpe: playas, rutas, gastronomía, servicios y planes para todo el año. Así convertimos la búsqueda de alojamiento en una experiencia útil, transparente y enfocada en tu tranquilidad.",
];

export const metadata = buildPageMetadata({
  title: HOME_H1,
  description:
    "Consulta disponibilidad y reserva directamente apartamentos en Calpe con INFTOUR, sin intermediarios y con atención personalizada.",
  path: "/",
});

const reservaJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "INFTOUR Reserva Directa",
  url: SITE_URL,
  sameAs: [
    "https://www.facebook.com/inftourspain",
    "https://www.instagram.com/inftourcalpe/",
  ],
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Plataforma de reserva directa de apartamentos INFTOUR en Calpe con disponibilidad actualizada y atención personalizada.",
  areaServed: "Calpe, Alicante",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calpe",
    addressRegion: "Alicante",
    addressCountry: "ES",
  },
};

export default function Home() {
  return (
    <PageShell>
      <h1 className="sr-only">{HOME_H1}</h1>
      <section className="sr-only" aria-label="Información de reserva directa en Calpe">
        {HOME_SEO_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reservaJsonLd) }}
      />
      <ReservaDirectaV2Content />
    </PageShell>
  );
}
