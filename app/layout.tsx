import type { Metadata } from "next";
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
  title: "INFTOUR | Calpe Private Collection",
  description: "Коллекция апартаментов с видом на Скалу. Сервис отеля. Приватность дома.",
};

import RestoreLang from "./components/RestoreLang";
import ElevenLabsWidget from "./components/ElevenLabsWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased bg-brand-stone text-brand-black font-sans selection:bg-brand-gold selection:text-white overflow-x-hidden`}
      >
        <RestoreLang />
        {children}
        <ElevenLabsWidget />
        <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
      </body>
    </html>
  );
}
