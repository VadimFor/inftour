import PageShell from "../components/PageShell";
import RevistaContent from "./RevistaContent";
import { MAGAZINE_PDF_PATH } from "../config/magazine";

export default function RevistaPage() {
  return (
    <PageShell>
      <RevistaContent pdfPath={MAGAZINE_PDF_PATH} />
    </PageShell>
  );
}
