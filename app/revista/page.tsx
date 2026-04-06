import PageShell from "../components/PageShell";
import RevistaContent from "./components/RevistaContent";
import { getDrivePdfFiles } from "../lib/drive";

export default async function RevistaPage() {
  const driveResult = await getDrivePdfFiles();

  return (
    <PageShell>
      <RevistaContent driveResult={driveResult} />
    </PageShell>
  );
}
