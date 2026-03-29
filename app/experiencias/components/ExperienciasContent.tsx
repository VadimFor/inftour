"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../../lib/langStore";
import gastronomyImage from "../pictures/restaurante.png";
import natureImage from "../pictures/bosque.png";
import cyclingImage from "../pictures/ciclistas.png";
import sportsImage from "../pictures/papeles.png";
import relaxImage from "../pictures/jabon.png";
import RestaurantsModal from "./sabores/RestaurantsModal";
import MarketsModal from "./sabores/MarketsModal";
import RecipesModal from "./sabores/RecipesModal";
import SportRentingModal from "./estilo_de_vida/SportRentingModal";
import CyclingModal from "./estilo_de_vida/CyclingModal";
import BBQParksModal from "./familia/BBQParksModal";
import FeriaModal from "./familia/FeriaModal";
import CalpeGrandezaModal from "./familia/CalpeGrandezaModal";
import ParquesAtraccionesModal from "./familia/ParquesAtraccionesModal";
import EcosistemaDeportivoModal from "./estilo_de_vida/EcosistemaDeportivoModal";
import RelaxModal from "./relax/RelaxModal";
import IfachModal from "./naturaleza/IfachModal";
import HorizontesMarinosModal from "./naturaleza/HorizontesMarinosModal";
import SalinasModal from "./naturaleza/SalinasModal";

export default function ExperienciasContent() {
  const { t } = useLangStore(useShallow((s) => ({ lang: s.lang, t: s.t })));
  const [restaurantsOpen, setRestaurantsOpen] = useState(false);
  const [marketsOpen, setMarketsOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [sportsEventsOpen, setSportsEventsOpen] = useState(false);
  const [cyclingOpen, setCyclingOpen] = useState(false);
  const [bbqParksOpen, setBbqParksOpen] = useState(false);
  const [feriaOpen, setFeriaOpen] = useState(false);
  const [calpeGrandeurOpen, setCalpeGrandeurOpen] = useState(false);
  const [parquesAtraccionesOpen, setParquesAtraccionesOpen] = useState(false);
  const [ecosistemaDeportivoOpen, setEcosistemaDeportivoOpen] = useState(false);
  const [relaxOpen, setRelaxOpen] = useState(false);
  const [ifachOpen, setIfachOpen] = useState(false);
  const [horizontesMarinosOpen, setHorizontesMarinosOpen] = useState(false);
  const [salinasOpen, setSalinasOpen] = useState(false);

  return (
    <main className="relative z-20 font-bold pb-18">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center max-w-4xl">
        <span className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
          {t("expHeroLabel")}
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
          {t("expPageTitle")}
        </h1>
        <p className="text-lg text-gray-600 font-light leading-relaxed">
          {t("expHeroDescLong")}
        </p>
      </section>

      {/* Grid */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
          {/* Gastronomy – 8 cols */}
          <article className="md:col-span-8 bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex flex-col md:flex-row group">
            <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto min-h-64">
              <Image
                src={gastronomyImage}
                alt={t("expGastronomy")}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-serif text-gray-900 mb-2">
                {t("expGastronomy").split(" – ")[0]}
              </h2>
              <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
                {t("expGastronomySub")}
              </p>
              <ul className="space-y-4 text-sm text-gray-600 border-l-2 border-brand-gold pl-4 font-normal">
                <li>
                  <button
                    type="button"
                    onClick={() => setRestaurantsOpen(true)}
                    className="block text-gray-800 hover:text-brand-gold transition text-left font-bold"
                  >
                    1. {t("expRestaurants")}
                  </button>
                  <span className="text-xs leading-relaxed">
                    {t("expRestaurantsDesc")}
                  </span>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setMarketsOpen(true)}
                    className="block text-gray-800 hover:text-brand-gold transition text-left font-bold"
                  >
                    2. {t("expMarkets")}
                  </button>
                  <span className="text-xs leading-relaxed">
                    {t("expMarketsDesc")}
                  </span>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setRecipesOpen(true)}
                    className="block text-gray-800 hover:text-brand-gold transition text-left font-bold"
                  >
                    3. {t("expRecipes")}
                  </button>
                  <span className="text-xs leading-relaxed">
                    {t("expRecipesDesc")}
                  </span>
                </li>
              </ul>
            </div>
          </article>

          {/* Nature – 4 cols, row-span-2 */}
          <article className="md:col-span-4 md:row-span-2 bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex flex-col group">
            <div className="h-64 md:h-2/5 relative overflow-hidden min-h-48">
              <Image
                src={natureImage}
                alt={t("expNature")}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-3xl font-serif text-gray-900 mb-2">
                {t("expNature")}
              </h2>
              <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
                {t("expNatureSub")}
              </p>
              <ul className="space-y-6 text-sm text-gray-600 flex-1 font-normal">
                <li className="border-b border-gray-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setIfachOpen(true)}
                    className="text-gray-800 hover:text-brand-gold transition text-left font-bold"
                  >
                    {t("expIfach")}
                  </button>
                  <span className="block mt-1 text-xs leading-relaxed">
                    {t("expIfachDesc")}
                  </span>
                </li>
                <li className="border-b border-gray-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setSalinasOpen(true)}
                    className="text-gray-800 hover:text-brand-gold transition text-left font-bold"
                  >
                    {t("expSalinas")}
                  </button>
                  <span className="block mt-1 text-xs leading-relaxed">
                    {t("expSalinasDesc")}
                  </span>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setHorizontesMarinosOpen(true)}
                    className="text-gray-800 hover:text-brand-gold transition text-left font-bold"
                  >
                    {t("expSeaside")}
                  </button>
                  <span className="block mt-1 text-xs leading-relaxed">
                    {t("expSeasideDesc")}
                  </span>
                </li>
              </ul>
            </div>
          </article>

          {/* Family – 4 cols */}
          <article className="md:col-span-4 bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-serif text-gray-900 mb-2">
                {t("expFamily")}
              </h2>
              <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
                {t("expFamilySub")}
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold shrink-0 mt-0.5">▪</span>
                  <button
                    type="button"
                    onClick={() => setBbqParksOpen(true)}
                    className="text-left font-bold text-gray-800 hover:text-brand-gold focus:text-brand-gold active:text-brand-gold transition"
                  >
                    {t("expBBQ")}
                  </button>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold shrink-0 mt-0.5">▪</span>
                  <button
                    type="button"
                    onClick={() => setCalpeGrandeurOpen(true)}
                    className="text-left font-bold text-gray-800 hover:text-brand-gold focus:text-brand-gold active:text-brand-gold transition"
                  >
                    {t("expCalpeGrandeur")}
                  </button>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold shrink-0 mt-0.5">▪</span>
                  <button
                    type="button"
                    onClick={() => setFeriaOpen(true)}
                    className="text-left font-bold text-gray-800 hover:text-brand-gold focus:text-brand-gold active:text-brand-gold transition"
                  >
                    {t("expFeria")}
                  </button>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold shrink-0 mt-0.5">▪</span>
                  <button
                    type="button"
                    onClick={() => setParquesAtraccionesOpen(true)}
                    className="text-left font-bold text-gray-800 hover:text-brand-gold focus:text-brand-gold active:text-brand-gold transition"
                  >
                    {t("expFamilyAttractions")}
                  </button>
                </li>
              </ul>
            </div>
            <a
              href="https://cultura.calp.es/en/cultural-programming"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-xs font-bold uppercase tracking-wider text-white bg-brand-darkgray hover:bg-gray-800 transition py-3 px-4 text-center rounded-sm"
            >
              {t("expViewEventsCalendar")}
            </a>
          </article>

          {/* Sport – 4 cols */}
          <article className="md:col-span-4 bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden p-8">
            <h2 className="text-3xl font-serif text-gray-900 mb-2">
              {t("expSport").split(" – ")[0]}
            </h2>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
              {t("expSportSub")}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="relative h-24 rounded-sm overflow-hidden">
                <Image
                  src={cyclingImage}
                  alt={t("expCycling")}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </div>
              <div className="relative h-24 rounded-sm overflow-hidden">
                <Image
                  src={sportsImage}
                  alt={t("expSportsFacilities")}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="font-bold text-gray-800">
                <button
                  type="button"
                  onClick={() => setCyclingOpen(true)}
                  className="text-gray-800 hover:text-brand-gold focus:text-brand-gold active:text-brand-gold transition text-left"
                >
                  {t("expCycling")}
                </button>
              </li>
              <li className="font-bold text-gray-800">
                <button
                  type="button"
                  onClick={() => setEcosistemaDeportivoOpen(true)}
                  className="text-gray-800 hover:text-brand-gold focus:text-brand-gold active:text-brand-gold transition text-left"
                >
                  {t("expEcosistemaDeportivoLabel")}
                </button>
              </li>
              <li className="font-bold text-gray-800">
                <button
                  type="button"
                  onClick={() => setSportsEventsOpen(true)}
                  className="text-gray-800 hover:text-brand-gold focus:text-brand-gold active:text-brand-gold transition text-left"
                >
                  {t("expEquipmentRental")}
                </button>
              </li>
              <li className="font-bold text-gray-800">
                <a
                  href="https://cultura.calp.es/en/agendaweb/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-link transition block font-bold text-brand-gold"
                >
                  <span className="font-bold">{t("expSportsEvents")}</span>
                </a>
              </li>
            </ul>
          </article>

          {/* Relax – full width */}
          <article className="md:col-span-12 bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex flex-col md:flex-row group">
            <div className="md:w-1/3 bg-brand-bg p-8 flex flex-col justify-center shrink-0">
              <h2 className="text-3xl font-serif text-gray-900 mb-2">
                {t("expRelax")}
              </h2>
              <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
                {t("expRelaxDesc")}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {t("expRelaxDescLong")}
              </p>
              <button
                type="button"
                onClick={() => setRelaxOpen(true)}
                className="text-brand-link text-sm font-bold inline-flex items-center gap-2 hover:underline"
              >
                {t("expExploreCatalog")}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
            <div className="md:w-2/3 bg-[#e8e4df] flex items-center justify-center overflow-hidden">
              <div className="w-full transition duration-700">
                <Image
                  src={relaxImage}
                  alt={t("expRelax")}
                  className="w-full h-auto object-contain group-hover:scale-105 duration-700"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
      <RestaurantsModal
        isOpen={restaurantsOpen}
        onClose={() => setRestaurantsOpen(false)}
      />
      <MarketsModal
        isOpen={marketsOpen}
        onClose={() => setMarketsOpen(false)}
      />
      <RecipesModal
        isOpen={recipesOpen}
        onClose={() => setRecipesOpen(false)}
      />
      <SportRentingModal
        isOpen={sportsEventsOpen}
        onClose={() => setSportsEventsOpen(false)}
      />
      <CyclingModal
        isOpen={cyclingOpen}
        onClose={() => setCyclingOpen(false)}
      />
      <BBQParksModal
        isOpen={bbqParksOpen}
        onClose={() => setBbqParksOpen(false)}
      />
      <FeriaModal isOpen={feriaOpen} onClose={() => setFeriaOpen(false)} />
      <CalpeGrandezaModal
        isOpen={calpeGrandeurOpen}
        onClose={() => setCalpeGrandeurOpen(false)}
      />
      <ParquesAtraccionesModal
        isOpen={parquesAtraccionesOpen}
        onClose={() => setParquesAtraccionesOpen(false)}
      />
      <EcosistemaDeportivoModal
        isOpen={ecosistemaDeportivoOpen}
        onClose={() => setEcosistemaDeportivoOpen(false)}
      />
      <RelaxModal isOpen={relaxOpen} onClose={() => setRelaxOpen(false)} />
      <IfachModal isOpen={ifachOpen} onClose={() => setIfachOpen(false)} />
      <HorizontesMarinosModal
        isOpen={horizontesMarinosOpen}
        onClose={() => setHorizontesMarinosOpen(false)}
      />
      <SalinasModal
        isOpen={salinasOpen}
        onClose={() => setSalinasOpen(false)}
      />
    </main>
  );
}
