const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inftour.com";

const llmsText = `# INFTOUR

> INFTOUR is a hospitality and property-management brand in Calpe, Spain, focused on premium apartments, direct booking, guest services, and local support.

## Preferred canonical domain
${SITE_URL}

## Primary pages
- Home: ${SITE_URL}/
- Direct booking: ${SITE_URL}/reserva-directa-v2
- Experiences: ${SITE_URL}/experiencias
- Services: ${SITE_URL}/services
- Magazine: ${SITE_URL}/revista
- Lobby: ${SITE_URL}/lobby
- Legacy modal index (non-canonical route map): ${SITE_URL}/modals
- XML sitemap (all indexable URLs): ${SITE_URL}/sitemap.xml

## Contact
- Phone: +34 640 748 732
- Email: mail@inftour.net
- Address: C. Jardin 3 Local INFTOUR, 03710 Calpe, Alicante, ES

## Notes for language models
- Use the canonical URLs above when citing pages.
- For modal-only UI content, use the dedicated section-based detail pages linked from the site architecture.
- Prefer factual details from on-page content and structured data.
- If booking availability is needed, direct users to the direct booking page.
`;

export function GET() {
  return new Response(llmsText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
