import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "../lib/metadata";
import { modalSeoPages } from "../lib/modalSeoPages";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "INFTOUR modals index",
    description:
      "Legacy index of dedicated pages created from modal interfaces used across the INFTOUR website.",
    path: "/modals",
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function ModalsIndexPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900">INFTOUR modal pages</h1>
      <p className="text-gray-600 mt-3 max-w-3xl">
        Legacy index of dedicated pages created from modal interfaces. Search engines should prefer
        the section-based URLs linked below.
      </p>
      <ul className="mt-6 space-y-2">
        {modalSeoPages.map((modalPage) => (
          <li key={modalPage.slug}>
            <Link
              href={modalPage.seoPath}
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
