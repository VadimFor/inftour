import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import { getModalSeoPagesByPrefix } from "../../lib/modalSeoPages";
import { BBQParksContent } from "../components/familia/BBQParksModal";
import { CalpeGrandezaContent } from "../components/familia/CalpeGrandezaModal";
import { FeriaContent } from "../components/familia/FeriaModal";
import { ParquesAtraccionesContent } from "../components/familia/ParquesAtraccionesModal";
import { CyclingContent } from "../components/estilo_de_vida/CyclingModal";
import { EcosistemaDeportivoContent } from "../components/estilo_de_vida/EcosistemaDeportivoModal";
import { SportRentingContent } from "../components/estilo_de_vida/SportRentingModal";
import { HorizontesMarinosContent } from "../components/naturaleza/HorizontesMarinosModal";
import { IfachContent } from "../components/naturaleza/IfachModal";
import { SalinasContent } from "../components/naturaleza/SalinasModal";
import { RelaxContent } from "../components/relax/RelaxModal";
import { MarketsContent } from "../components/sabores/MarketsModal";
import { RecipesContent } from "../components/sabores/RecipesModal";
import { RestaurantsContent } from "../components/sabores/RestaurantsModal";

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

  if (slug === "restaurantes") {
    return <RestaurantsContent />;
  }

  if (slug === "mercados") {
    return <MarketsContent />;
  }

  if (slug === "recetas") {
    return <RecipesContent />;
  }

  if (slug === "alquiler-deportivo") {
    return <SportRentingContent />;
  }

  if (slug === "ciclismo") {
    return <CyclingContent />;
  }

  if (slug === "parques-bbq") {
    return <BBQParksContent />;
  }

  if (slug === "feria") {
    return <FeriaContent />;
  }

  if (slug === "calpe-grandeza") {
    return <CalpeGrandezaContent />;
  }

  if (slug === "parques-atracciones") {
    return <ParquesAtraccionesContent />;
  }

  if (slug === "ecosistema-deportivo") {
    return <EcosistemaDeportivoContent />;
  }

  if (slug === "ifach") {
    return <IfachContent />;
  }

  if (slug === "horizontes-marinos") {
    return <HorizontesMarinosContent />;
  }

  if (slug === "salinas") {
    return <SalinasContent />;
  }

  if (slug === "relax") {
    return <RelaxContent />;
  }

  return <ModalSeoPageArticle modalPage={modalPage} />;
}
