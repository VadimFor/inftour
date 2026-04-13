import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import { getModalSeoPagesByPrefix } from "../../lib/modalSeoPages";

type RouteParams = {
  slug: string;
};

const servicePages = getModalSeoPagesByPrefix("/services/");

function getServicePage(slug: string) {
  return servicePages.find((modalPage) => modalPage.seoPath === `/services/${slug}`);
}

export function generateStaticParams(): RouteParams[] {
  return servicePages.map((modalPage) => ({
    slug: modalPage.seoPath.replace("/services/", ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const modalPage = getServicePage(slug);
  if (!modalPage) {
    return {};
  }

  return buildPageMetadata({
    title: modalPage.title,
    description: modalPage.description,
    path: modalPage.seoPath,
  });
}

export default async function ServiceSeoPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const modalPage = getServicePage(slug);

  if (!modalPage) {
    notFound();
  }

  return <ModalSeoPageArticle modalPage={modalPage} />;
}
