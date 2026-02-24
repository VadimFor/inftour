import { MAGAZINE_PDF_PATH } from "../config/magazine";
import PageShell from "../components/PageShell";
import RevistaContent from "./RevistaContent";

export default function RevistaPage() {
  return (
    <PageShell>
      <RevistaContent pdfPath={MAGAZINE_PDF_PATH} />
    </PageShell>
  );
}
