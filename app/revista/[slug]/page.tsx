import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../../components/PageShell";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import {
  getDriveFileBySlug,
  getDriveFileListWithSlugs,
  getPdfDetails,
  getPdfDownloadUrl,
  getPdfPreviewUrl,
  getPdfTitle,
  getThumbnailUrl,
} from "../../lib/drive";
import { getModalSeoPagesByPrefix } from "../../lib/modalSeoPages";

type RouteParams = {
  slug: string;
};

const revistaPages = getModalSeoPagesByPrefix("/revista/");

function getRevistaSeoPage(slug: string) {
  return revistaPages.find((modalPage) => modalPage.seoPath === `/revista/${slug}`);
}

function toParagraphs(content: string | null) {
  if (!content) return [];
  const sentences = content
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (!current) {
      current = sentence;
      continue;
    }

    if ((current + " " + sentence).length > 900) {
      chunks.push(current);
      current = sentence;
      continue;
    }

    current += ` ${sentence}`;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length > 0 ? chunks : [content];
}

export const revalidate = 3600;

export async function generateStaticParams(): Promise<RouteParams[]> {
  const driveResult = await getDriveFileListWithSlugs();
  const driveParams = driveResult.ok
    ? driveResult.files.map((file) => ({ slug: file.slug }))
    : [];

  return [
    ...revistaPages.map((modalPage) => ({
      slug: modalPage.seoPath.replace("/revista/", ""),
    })),
    ...driveParams,
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const modalPage = getRevistaSeoPage(slug);
  if (modalPage) {
    return buildPageMetadata({
      title: modalPage.title,
      description: modalPage.description,
      path: modalPage.seoPath,
    });
  }

  const file = await getDriveFileBySlug(slug);
  if (!file) {
    return {};
  }

  const details = await getPdfDetails(file.id);
  const title = `${getPdfTitle(file.name)} | Revista INFTOUR`;
  const description =
    details.excerpt ??
    "Article from the INFTOUR magazine archive with PDF preview and downloadable version.";

  return buildPageMetadata({
    title,
    description,
    path: `/revista/${file.slug}`,
  });
}

export default async function RevistaArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const modalPage = getRevistaSeoPage(slug);

  if (modalPage) {
    return <ModalSeoPageArticle modalPage={modalPage} />;
  }

  const file = await getDriveFileBySlug(slug);
  if (!file) {
    notFound();
  }

  const details = await getPdfDetails(file.id);
  const title = getPdfTitle(file.name);
  const paragraphs = toParagraphs(details.content);
  const excerpt =
    details.excerpt ??
    "Preview this INFTOUR magazine PDF online or download the full file.";

  return (
    <PageShell>
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
            <Link href="/revista" className="hover:text-brand-gold transition">
              Revista
            </Link>{" "}
            / <span className="text-gray-700">{title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
            <div>
              <span className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs block mb-4">
                INFTOUR Magazine
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
                {title}
              </h1>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                {excerpt}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <a
                  href={getPdfDownloadUrl(file.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-darkgray text-white px-5 py-3 rounded-sm hover:bg-gray-700 transition"
                >
                  Download PDF
                </a>
                <a
                  href={getPdfPreviewUrl(file.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-800 px-5 py-3 rounded-sm hover:border-brand-gold hover:text-brand-gold transition"
                >
                  Open Drive preview
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-600">
                {details.pages !== null ? (
                  <p>
                    <span className="font-semibold text-gray-900">Pages:</span>{" "}
                    {details.pages}
                  </p>
                ) : null}
                <p>
                  <span className="font-semibold text-gray-900">Source:</span>{" "}
                  Google Drive archive
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getThumbnailUrl(file.id)}
                alt={title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <section className="mt-12 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10">
            <div className="space-y-5">
              <h2 className="text-2xl font-serif text-gray-900">
                Full article text
              </h2>
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-gray-700 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  The PDF preview below contains the full article. Text extraction
                  is not available for this file yet.
                </p>
              )}
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-serif text-gray-900">
                  PDF preview
                </h2>
              </div>
              <iframe
                src={getPdfPreviewUrl(file.id)}
                className="w-full border-0"
                style={{ minHeight: "75vh" }}
                allow="autoplay"
                title={title}
              />
            </div>
          </section>
        </article>
      </main>
    </PageShell>
  );
}
