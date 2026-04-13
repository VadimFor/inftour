import { notFound } from "next/navigation";
import ModalSeoPageArticle from "../../components/ModalSeoPageArticle";
import { buildPageMetadata } from "../../lib/metadata";
import { getModalSeoPageByPath } from "../../lib/modalSeoPages";

const modalPage = getModalSeoPageByPath("/legal/raicv");

export const metadata = modalPage
  ? buildPageMetadata({
      title: modalPage.title,
      description: modalPage.description,
      path: modalPage.seoPath,
    })
  : {};

export default function RaicvSeoPage() {
  if (!modalPage) {
    notFound();
  }

  return <ModalSeoPageArticle modalPage={modalPage} />;
}
