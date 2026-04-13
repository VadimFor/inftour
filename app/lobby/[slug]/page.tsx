import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import { getModalSeoPagesByPrefix } from "../../lib/modalSeoPages";

type RouteParams = {
  slug: string;
};

const lobbyPages = getModalSeoPagesByPrefix("/lobby/");

function getLobbyPage(slug: string) {
  return lobbyPages.find((modalPage) => modalPage.seoPath === `/lobby/${slug}`);
}

export function generateStaticParams(): RouteParams[] {
  return lobbyPages.map((modalPage) => ({
    slug: modalPage.seoPath.replace("/lobby/", ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const modalPage = getLobbyPage(slug);
  if (!modalPage) {
    return {};
  }

  return buildPageMetadata({
    title: modalPage.title,
    description: modalPage.description,
    path: modalPage.seoPath,
  });
}

export default async function LobbySeoPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const modalPage = getLobbyPage(slug);

  if (!modalPage) {
    notFound();
  }

  return <ModalSeoPageArticle modalPage={modalPage} />;
}
