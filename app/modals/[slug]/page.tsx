import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "../../lib/metadata";
import { modalSeoPages } from "../../lib/modalSeoPages";

type ModalPageParams = {
  slug: string;
};
type MaybePromise<T> = T | Promise<T>;

function getModalPage(slug: string) {
  return modalSeoPages.find((modalPage) => modalPage.slug === slug);
}

export function generateStaticParams(): ModalPageParams[] {
  return modalSeoPages.map((modalPage) => ({ slug: modalPage.slug }));
}

export function generateMetadata({
  params,
}: {
  params: MaybePromise<ModalPageParams>;
}): Promise<Metadata> {
  return Promise.resolve(params).then(({ slug }) => {
    const modalPage = getModalPage(slug);
    if (!modalPage) {
      return {};
    }

    return buildPageMetadata({
      title: modalPage.title,
      description: modalPage.description,
      path: `/modals/${modalPage.slug}`,
    });
  });
}

export default async function ModalSeoPage({
  params,
}: {
  params: MaybePromise<ModalPageParams>;
}) {
  const { slug } = await Promise.resolve(params);
  const modalPage = getModalPage(slug);

  if (!modalPage) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <article className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-serif text-gray-900">{modalPage.title}</h1>
        <p className="text-gray-700 mt-4 leading-relaxed">{modalPage.description}</p>
        <p className="text-gray-700 mt-3 leading-relaxed">
          Component source: <code>{modalPage.componentName}</code>
        </p>
        <p className="text-gray-700 mt-3 leading-relaxed">
          Parent section:{" "}
          <Link
            href={modalPage.parentPath}
            className="underline hover:text-brand-gold transition"
          >
            {modalPage.parentPath}
          </Link>
        </p>
        <p className="text-gray-600 mt-6 text-sm">
          This crawlable document mirrors content currently exposed through a modal interface in the
          application.
        </p>
      </article>
    </main>
  );
}
