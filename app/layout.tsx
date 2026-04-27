import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "INFTOUR | Apartamentos premium en Calpe",
  description:
    "Apartamentos premium en Calpe con reserva directa, servicio tipo hotel y asistencia local durante toda la estancia.",
  icons: {
    icon: "/logo-alt.svg",
    shortcut: "/logo-alt.svg",
    apple: "/logo-alt.svg",
  },
};

/** Lets `env(safe-area-inset-*)` match the screen on notched phones (modals, fixed UI). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import RestoreLang from "./components/RestoreLang";
import ElevenLabsWidget from "./components/ElevenLabsWidget";
import { ExperienciasModalImageWarmup } from "./experiencias/components/ExperienciasModalImageWarmup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased bg-brand-stone text-brand-black font-sans selection:bg-brand-gold selection:text-white overflow-x-hidden`}
      >
        <RestoreLang />
        <ExperienciasModalImageWarmup />
        {children}
        <ElevenLabsWidget />
        <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
      </body>
    </html>
  );
}
