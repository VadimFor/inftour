import PageShell from "../components/PageShell";
import { buildPageMetadata } from "../lib/metadata";
import ExperienciasContent from "./components/ExperienciasContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rent.inftour.es";

export const metadata = buildPageMetadata({
  title: "Experiencias en Calpe | INFTOUR",
  description:
    "Descubre experiencias en Calpe: gastronomía local, naturaleza, estilo de vida mediterráneo y planes para familias durante tu estancia con INFTOUR.",
  path: "/experiencias",
});

const experienciasJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Experiencias INFTOUR en Calpe",
  description:
    "Selección de experiencias en Calpe para huéspedes de INFTOUR: gastronomía, naturaleza, relax, familia y estilo de vida.",
  url: `${SITE_URL}/experiencias`,
  numberOfItems: 5,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Gastronomía" },
    { "@type": "ListItem", position: 2, name: "Naturaleza" },
    { "@type": "ListItem", position: 3, name: "Relax" },
    { "@type": "ListItem", position: 4, name: "Familia" },
    { "@type": "ListItem", position: 5, name: "Estilo de vida" },
  ],
};

export default function ExperienciasPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(experienciasJsonLd) }}
      />
      <ExperienciasContent />
    </PageShell>
  );
}
