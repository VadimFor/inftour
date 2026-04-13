import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import { getModalSeoPagesByPrefix } from "../../lib/modalSeoPages";

type RouteParams = {
  slug: string;
};

const experienciaPages = getModalSeoPagesByPrefix("/experiencias/");

function getExperienciaPage(slug: string) {
  return experienciaPages.find((modalPage) => modalPage.seoPath === `/experiencias/${slug}`);
}

export function generateStaticParams(): RouteParams[] {
  return experienciaPages.map((modalPage) => ({
    slug: modalPage.seoPath.replace("/experiencias/", ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const modalPage = getExperienciaPage(slug);
  if (!modalPage) {
    return {};
  }

  return buildPageMetadata({
    title: modalPage.title,
    description: modalPage.description,
    path: modalPage.seoPath,
  });
}

export default async function ExperienciaSeoPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const modalPage = getExperienciaPage(slug);

  if (!modalPage) {
    notFound();
  }

  return <ModalSeoPageArticle modalPage={modalPage} />;
}
