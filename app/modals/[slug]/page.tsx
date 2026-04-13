import { notFound, permanentRedirect } from "next/navigation";
import { getModalSeoPageBySlug, modalSeoPages } from "../../lib/modalSeoPages";

type ModalPageParams = {
  slug: string;
};

export function generateStaticParams(): ModalPageParams[] {
  return modalSeoPages.map((modalPage) => ({ slug: modalPage.slug }));
}

export default async function ModalSeoPage({
  params,
}: {
  params: Promise<ModalPageParams>;
}) {
  const { slug } = await Promise.resolve(params);
  const modalPage = getModalSeoPageBySlug(slug);

  if (!modalPage) {
    notFound();
  }

  permanentRedirect(modalPage.seoPath);
}
