import PageShell from "./components/PageShell";
import { buildPageMetadata } from "./lib/metadata";
import ReservaDirectaV2Content from "./reserva-directa-v2/components/ReservaDirectaV2Content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rent.inftour.es";
const HOME_H1 = "Reserva directa en Calpe | INFTOUR";

export const metadata = buildPageMetadata({
  title: HOME_H1,
  description:
    "Consulta disponibilidad y reserva directamente apartamentos en Calpe con INFTOUR, sin intermediarios y con atencion personalizada.",
  path: "/",
});

const reservaJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "INFTOUR Reserva Directa",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Plataforma de reserva directa de apartamentos INFTOUR en Calpe con disponibilidad actualizada y atencion personalizada.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reservaJsonLd) }}
      />
      <ReservaDirectaV2Content />
    </PageShell>
  );
}
