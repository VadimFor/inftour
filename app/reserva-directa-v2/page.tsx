import PageShell from "../components/PageShell";
import { buildPageMetadata } from "../lib/metadata";
import ReservaDirectaV2Content from "./components/ReservaDirectaV2Content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inftour.com";

export const metadata = buildPageMetadata({
  title: "Reserva directa en Calpe | INFTOUR",
  description:
    "Consulta disponibilidad y reserva directamente apartamentos en Calpe con INFTOUR, sin intermediarios y con atención personalizada.",
  path: "/reserva-directa-v2",
});

const reservaJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "INFTOUR Reserva Directa",
  url: `${SITE_URL}/reserva-directa-v2`,
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

export default function ReservaDirectaV2Page() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reservaJsonLd) }}
      />
      <ReservaDirectaV2Content />
    </PageShell>
  );
}
