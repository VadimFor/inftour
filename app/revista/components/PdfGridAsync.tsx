import { getDriveFileList } from "../../lib/drive";
import PdfGrid from "./PdfGrid";

export default async function PdfGridAsync() {
  const result = await getDriveFileList();
  return <PdfGrid driveResult={result} />;
}
