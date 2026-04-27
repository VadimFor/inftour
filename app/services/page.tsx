import PageShell from "../components/PageShell";
import { buildPageMetadata } from "../lib/metadata";
import ServicesContent from "./components/ServicesContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rent.inftour.es";

export const metadata = buildPageMetadata({
  title: "Servicios para huéspedes y propietarios | INFTOUR",
  description:
    "Conoce los servicios de INFTOUR en Calpe: atención al huésped, gestión operativa, soporte de estancia y soluciones para propietarios.",
  path: "/services",
});

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Property management and guest support",
  name: "Servicios INFTOUR para huéspedes y propietarios",
  description:
    "Servicios de gestión operativa, atención al huésped y soporte de estancia para apartamentos turísticos en Calpe.",
  areaServed: {
    "@type": "Place",
    name: "Calpe, Alicante, ES",
  },
  provider: {
    "@type": "Organization",
    name: "INFTOUR",
    url: SITE_URL,
  },
  url: `${SITE_URL}/services`,
};

export default function ServicesPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <ServicesContent />
    </PageShell>
  );
}
