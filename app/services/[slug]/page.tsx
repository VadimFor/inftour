import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import { getModalSeoPagesByPrefix } from "../../lib/modalSeoPages";
import { OurServicesContent } from "../components/OurServicesModal";
import { ReferenceNumbersContent } from "../components/ReferenceNumbersModal";
import { RequestsCommentsContent } from "../components/RequestsCommentsModal";

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

  if (slug === "reference-numbers") {
    return <ReferenceNumbersContent />;
  }

  if (slug === "our-services") {
    return <OurServicesContent />;
  }

  if (slug === "requests-comments") {
    return <RequestsCommentsContent />;
  }

  return <ModalSeoPageArticle modalPage={modalPage} />;
}
