import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import { getModalSeoPagesByPrefix } from "../../lib/modalSeoPages";
import AboutUsContent from "../components/AboutUsContent";
import { ArrivalStayContent } from "../components/ArrivalStayModal";
import { FaqContent } from "../components/FaqModal";
import InstructionsContent from "../components/InstructionsContent";
import { PrivacyContent } from "../components/PrivacyModal";
import { ReportingChannelContent } from "../components/ReportingChannelModal";

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

  if (slug === "about-us") {
    return <AboutUsContent />;
  }

  if (slug === "instructions") {
    return <InstructionsContent />;
  }

  if (slug === "arrival-and-stay") {
    return <ArrivalStayContent />;
  }

  if (slug === "faq") {
    return <FaqContent />;
  }

  if (slug === "privacy-policy") {
    return <PrivacyContent />;
  }

  if (slug === "reporting-channel") {
    return <ReportingChannelContent />;
  }

  return <ModalSeoPageArticle modalPage={modalPage} />;
}
