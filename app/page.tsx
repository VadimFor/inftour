import PageShell from "./components/PageShell";
import HomeContent from "./home/components/HomeContent";
import HomeSeoIntro from "./home/components/HomeSeoIntro";
import { buildPageMetadata } from "./lib/metadata";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inftour.com";
const SOCIAL_URL_ENV_KEYS = [
  "NEXT_PUBLIC_INSTAGRAM_URL",
  "NEXT_PUBLIC_FACEBOOK_URL",
  "NEXT_PUBLIC_LINKEDIN_URL",
  "NEXT_PUBLIC_YOUTUBE_URL",
] as const;

function getSameAsUrls() {
  const values = SOCIAL_URL_ENV_KEYS.map((key) => process.env[key]).filter(
    (url): url is string => Boolean(url),
  );
  const missing = SOCIAL_URL_ENV_KEYS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const message = `[SEO] Missing social URL env vars: ${missing.join(", ")}. Set them in the production environment to keep sameAs complete.`;
    console.warn(message);
  }

  return values;
}

const SAME_AS = getSameAsUrls();

export const metadata = buildPageMetadata({
  title: "INFTOUR | Reserva apartamentos en Calpe",
  description:
    "Reserva apartamentos premium en Calpe con servicio tipo hotel, gestión directa y ubicación privilegiada frente al Peñón de Ifach.",
  path: "/",
});

const lodgingBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: "INFTOUR",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Apartamentos premium en Calpe con reserva directa, servicio tipo hotel y soporte local durante la estancia.",
  areaServed: "Calpe, Alicante",
  priceRange: "EUR 90-450",
  telephone: "+34 640 748 732",
  email: "mail@inftour.net",
  ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.6416,
    longitude: 0.0457,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+34 640 748 732",
      contactType: "customer support",
      areaServed: "ES",
      availableLanguage: ["es", "en", "ru", "fr", "it", "de", "uk", "pl"],
      email: "mail@inftour.net",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "C. Jardín 3 Local INFTOUR",
    addressLocality: "Calpe",
    addressRegion: "Alicante",
    postalCode: "03710",
    addressCountry: "ES",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "INFTOUR",
  description:
    "Reserva apartamentos premium en Calpe con gestión directa, servicio tipo hotel y asistencia local.",
  inLanguage: "es",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [lodgingBusinessJsonLd, websiteJsonLd],
};

export default function Home() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeSeoIntro />
      <HomeContent />
    </PageShell>
  );
}
