import PageShell from "../components/PageShell";
import { buildPageMetadata } from "../lib/metadata";
import LobbyContent from "./components/LobbyContent";

export const metadata = buildPageMetadata({
  title: "Lobby INFTOUR | Información de estancia en Calpe",
  description:
    "Accede al lobby digital de INFTOUR con información útil de llegada, estancia, normas, preguntas frecuentes y contactos de soporte.",
  path: "/lobby",
});

export default function LobbyPage() {
  return (
    <PageShell>
      <LobbyContent />
    </PageShell>
  );
}
