import Link from "next/link";
import { buildPageMetadata } from "../lib/metadata";
import { modalSeoPages } from "../lib/modalSeoPages";

export const metadata = buildPageMetadata({
  title: "INFTOUR modals index",
  description:
    "Index of dedicated crawlable pages created from all modal interfaces used across the INFTOUR website.",
  path: "/modals",
});

export default function ModalsIndexPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900">INFTOUR modal pages</h1>
      <p className="text-gray-600 mt-3 max-w-3xl">
        This section exposes indexable routes for modal content used in the website experience.
      </p>
      <ul className="mt-6 space-y-2">
        {modalSeoPages.map((modalPage) => (
          <li key={modalPage.slug}>
            <Link
              href={`/modals/${modalPage.slug}`}
              className="underline text-gray-800 hover:text-brand-gold transition"
            >
              {modalPage.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
