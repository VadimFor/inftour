"use client";

import { useShallow } from "zustand/react/shallow";
import { ProgressiveNextImage } from "../../components/ProgressiveNextImage";
import { useLangStore } from "../../lib/langStore";
import featuredImage from "../pictures/salon.png";
import type { DrivePdfResult } from "../../lib/drive";
import PdfGrid from "./PdfGrid";

type Props = {
  driveResult: DrivePdfResult;
};

export default function RevistaContent({ driveResult }: Props) {
  const { t } = useLangStore(useShallow((s) => ({ lang: s.lang, t: s.t })));

  return (
    <main className="relative z-20  pb-10">
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
          <div className="relative h-72 shrink-0 overflow-hidden lg:h-[400px] lg:w-7/12">
            <ProgressiveNextImage
              src={featuredImage}
              alt={t("revFeaturedTitle")}
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
              imageClassName="object-cover transition duration-700 group-hover:scale-105"
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

      {/* PDF archive + sidebar */}
      <section className="container mx-auto px-4 mb-10 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 lg:px-6">
          <h3 className="text-2xl font-serif text-gray-900 mb-8 pb-4 border-b border-gray-200">
            {t("revLatestTitle")}
          </h3>
          <PdfGrid driveResult={driveResult} />
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
