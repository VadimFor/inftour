import { Suspense } from "react";
import PageShell from "../components/PageShell";
import { buildPageMetadata } from "../lib/metadata";
import RevistaContent from "./components/RevistaContent";
import PdfGridAsync from "./components/PdfGridAsync";
import PdfGridSkeleton from "./components/PdfGridSkeleton";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Revista INFTOUR | Guías y novedades de Calpe",
  description:
    "Explora la revista de INFTOUR con guías, recomendaciones y contenido útil para planificar tu estancia en Calpe y la Costa Blanca.",
  path: "/revista",
});

export default function RevistaPage() {
  return (
    <PageShell>
      <RevistaContent>
        <Suspense fallback={<PdfGridSkeleton />}>
          <PdfGridAsync />
        </Suspense>
      </RevistaContent>
    </PageShell>
  );
}
