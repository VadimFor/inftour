import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import { getModalSeoPagesByPrefix } from "../../lib/modalSeoPages";

type RouteParams = {
  slug: string;
};

const reservaPages = getModalSeoPagesByPrefix("/reserva-directa-v2/");

function getReservaPage(slug: string) {
  return reservaPages.find((modalPage) => modalPage.seoPath === `/reserva-directa-v2/${slug}`);
}

export function generateStaticParams(): RouteParams[] {
  return reservaPages.map((modalPage) => ({
    slug: modalPage.seoPath.replace("/reserva-directa-v2/", ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const modalPage = getReservaPage(slug);
  if (!modalPage) {
    return {};
  }

  return buildPageMetadata({
    title: modalPage.title,
    description: modalPage.description,
    path: modalPage.seoPath,
  });
}

export default async function ReservaSeoPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const modalPage = getReservaPage(slug);

  if (!modalPage) {
    notFound();
  }

  return <ModalSeoPageArticle modalPage={modalPage} />;
}
