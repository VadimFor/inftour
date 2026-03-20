"use client";

import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../../lib/langStore";
import featuredImage from "../pictures/salon.png";
import article1Image from "../pictures/jabon.png";
import article2Image from "../pictures/restaurante.png";

type Props = { pdfPath: string | null };

export default function RevistaContent({ pdfPath }: Props) {
  const { t } = useLangStore(useShallow((s) => ({ lang: s.lang, t: s.t })));

  if (pdfPath) {
    return (
      <main className="relative z-20  pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-black">
              {t("revistaTitle")}
            </h1>
            <p className="text-gray-500 mt-2 font-light">
              {t("revistaTagline")}
            </p>
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-5 py-2.5 bg-brand-gold text-white font-medium rounded-lg hover:opacity-90 transition"
            >
              {t("revistaDownload")}
            </a>
          </header>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100 min-h-[70vh]">
            <iframe
              src={`${pdfPath}#view=FitH`}
              title={t("revistaTitle")}
              className="w-full h-[75vh] min-h-[600px]"
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-20  pb-24">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-20 text-center max-w-4xl">
        <span className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
          {t("revHeroLabel")}
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 leading-tight">
          {t("revHeroTitle")}
        </h1>
        <p className="text-lg text-gray-600 font-light leading-relaxed">
          {t("revHeroDesc")}
        </p>
      </section>

      {/* Featured article */}
      <section className="container mx-auto px-4 mb-20">
        <article className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden flex flex-col lg:flex-row group">
          <div className="lg:w-7/12 relative overflow-hidden h-72 lg:h-[400px] shrink-0">
            <Image
              src={featuredImage}
              alt={t("revFeaturedTitle")}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
            />
          </div>
          <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center">
            <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">
              {t("revFeaturedLabel")}
            </span>
            <h2 className="text-3xl font-serif text-gray-900 mb-4 hover:text-brand-gold transition cursor-pointer">
              {t("revFeaturedTitle")}
            </h2>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
              {t("revFeaturedDesc")}
            </p>
          </div>
        </article>
      </section>

      {/* Latest articles + sidebar */}
      <section className="container mx-auto px-4 mb-24 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3">
          <h3 className="text-2xl font-serif text-gray-900 mb-8 pb-4 border-b border-gray-200">
            {t("revLatestTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden group flex flex-col">
              <div className="h-48 relative overflow-hidden shrink-0">
                <Image
                  src={article1Image}
                  alt={t("revArticle1Title")}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className="absolute bottom-4 left-4 bg-brand-darkgray text-white px-2 py-1 text-[9px] uppercase tracking-widest">
                  {t("revArticle1Tag")}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-serif text-gray-900 mb-3 group-hover:text-brand-gold transition cursor-pointer">
                  {t("revArticle1Title")}
                </h4>
                <p className="text-xs text-gray-600 font-light leading-relaxed mb-4">
                  {t("revArticle1Desc")}
                </p>
              </div>
            </article>
            <article className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden group flex flex-col">
              <div className="h-48 relative overflow-hidden shrink-0">
                <Image
                  src={article2Image}
                  alt={t("revArticle2Title")}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className="absolute bottom-4 left-4 bg-brand-gold text-white px-2 py-1 text-[9px] uppercase tracking-widest">
                  {t("revArticle2Tag")}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-serif text-gray-900 mb-3 group-hover:text-brand-gold transition cursor-pointer">
                  {t("revArticle2Title")}
                </h4>
                <p className="text-xs text-gray-600 font-light leading-relaxed mb-4">
                  {t("revArticle2Desc")}
                </p>
              </div>
            </article>
          </div>
        </div>
        <aside className="lg:w-1/3">
          <h3 className="text-2xl font-serif text-gray-900 mb-8 pb-4 border-b border-gray-200">
            {t("revLiveTitle")}
          </h3>
          <div className="space-y-6">
            <div className="bg-white border-l-4 border-brand-gold p-5 shadow-sm rounded-r-sm">
              <h5 className="font-bold text-gray-800 text-sm mb-2 hover:text-brand-link cursor-pointer">
                {t("revLive1Title")}
              </h5>
              <p className="text-xs text-gray-600 font-light">
                {t("revLive1Desc")}
              </p>
            </div>
            <div className="bg-brand-darkgray text-white p-5 shadow-sm rounded-sm">
              <h5 className="font-bold text-white text-sm mb-2">
                {t("revLive2Title")}
              </h5>
              <p className="text-xs text-gray-300 font-light mb-3">
                {t("revLive2Desc")}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
