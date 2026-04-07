export const dynamic = "force-dynamic";

import { Suspense } from "react";
import PageShell from "../components/PageShell";
import RevistaContent from "./components/RevistaContent";
import PdfGridAsync from "./components/PdfGridAsync";
import PdfGridSkeleton from "./components/PdfGridSkeleton";

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
