"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useLangStore } from "../../lib/langStore";

type ArrivalStayModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BODY = "text-sm text-gray-600 leading-relaxed";

const STAY_THREE_STEPS = [
  { title: "lobStayStep1Title" as const, body: "lobStayStep1Body" as const },
  { title: "lobStayStep2Title" as const, body: "lobStayStep2Body" as const },
  { title: "lobStayStep3Title" as const, body: "lobStayStep3Body" as const },
] as const;

const STAY_BEFORE_ARRIVAL_BULLETS = [
  "lobStayBeforeArrivalBullet1",
  "lobStayBeforeArrivalBullet2",
] as const;

const STAY_CHECK_BULLETS = [
  "lobStayCheckBulletEarly",
  "lobStayCheckBulletLate",
] as const;

const STAY_DEPARTURE_BULLETS = [
  "lobStayBeforeDepartureB1",
  "lobStayBeforeDepartureB2",
  "lobStayBeforeDepartureB3",
  "lobStayBeforeDepartureB4",
] as const;

export default function ArrivalStayModal({ isOpen, onClose }: ArrivalStayModalProps) {
  const t = useLangStore((s) => s.t);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arrival-stay-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-3xl flex-col bg-white shadow-2xl rounded-t-2xl sm:rounded-xl overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-8 py-6 bg-linear-to-br from-brand-bg via-white to-amber-50/30">
          <div>
            <div className="mb-3 h-px w-10 bg-brand-gold" aria-hidden />
            <h2
              id="arrival-stay-modal-title"
              className="text-2xl font-serif font-semibold text-brand-black leading-tight"
            >
              {t("lobStayTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("lobCloseModal")}
            className="mt-1 shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-900"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-modal flex-1 overflow-y-auto">
          {/* Intro */}
          <div className="px-8 py-6 space-y-3 text-[15px] font-light leading-relaxed text-gray-600 border-b border-gray-100">
            <p className={BODY}>{t("lobStayIntro1")}</p>
            <p className={BODY}>{t("lobStayIntro2")}</p>
          </div>

          <div className="space-y-10 p-8">
            {/* 3 steps */}
            <div>
              <h3 className="mb-6 flex items-center gap-3 font-serif text-xl text-brand-black">
                <span className="h-6 w-1 shrink-0 rounded-full bg-brand-gold" aria-hidden />
                {t("lobStayStepsHeading")}
              </h3>
              <ol className="grid gap-4 md:grid-cols-3">
                {STAY_THREE_STEPS.map(({ title, body }, i) => (
                  <li key={title} className="flex flex-col rounded-xl border border-gray-100 bg-(--color-brand-bg) px-5 py-5">
                    <span className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-white shadow-sm ring-4 ring-white">
                      {i + 1}
                    </span>
                    <p className="mb-2 text-sm font-semibold text-brand-black md:text-base">{t(title)}</p>
                    <p className="text-sm font-light leading-relaxed text-gray-600">{t(body)}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Before arrival */}
            <div className="border-t border-gray-100 pt-2">
              <h3 className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 font-serif text-xl text-brand-black">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </span>
                {t("lobStayBeforeArrivalTitle")}
              </h3>
              <div className="space-y-4 text-[15px] font-light leading-relaxed text-gray-600">
                <p>{t("lobStayBeforeArrivalP1")}</p>
                <p>{t("lobStayBeforeArrivalP2")}</p>
                <ul className="list-disc space-y-2 pl-5 marker:text-brand-gold">
                  {STAY_BEFORE_ARRIVAL_BULLETS.map((key) => (
                    <li key={key}>{t(key)}</li>
                  ))}
                </ul>
                <p>{t("lobStayBeforeArrivalP3")}</p>
                <p>{t("lobStayBeforeArrivalP4")}</p>
              </div>
            </div>

            {/* Office hours */}
            <div className="border-t border-gray-100 pt-2">
              <h3 className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 font-serif text-xl text-brand-black">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                {t("lobStayOfficeHoursTitle")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-(--color-brand-bg) px-5 py-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold">{t("lobStayOfficeSummer")}</p>
                  <p className="mb-2 text-sm font-medium text-brand-black">{t("lobStayOfficeWeekdays")}</p>
                  <p className="text-sm text-gray-600">{t("lobStayOfficeSummerAm")}</p>
                  <p className="text-sm text-gray-600">{t("lobStayOfficeSummerPm")}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-(--color-brand-bg) px-5 py-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-gold">{t("lobStayOfficeWinter")}</p>
                  <p className="mb-2 text-sm font-medium text-brand-black">{t("lobStayOfficeWeekdays")}</p>
                  <p className="text-sm text-gray-600">{t("lobStayOfficeWinterAm")}</p>
                  <p className="text-sm text-gray-600">{t("lobStayOfficeWinterPm")}</p>
                </div>
              </div>
            </div>

            {/* Check-in / Check-out */}
            <div className="border-t border-gray-100 pt-2">
              <h3 className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 font-serif text-xl text-brand-black">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </span>
                {t("lobStayCheckTitle")}
              </h3>
              <div className="space-y-4 text-[15px] font-light leading-relaxed text-gray-600">
                <p>{t("lobStayCheckIn")}</p>
                <p>{t("lobStayCheckOut")}</p>
                <p>{t("lobStayCheckExtraIntro")}</p>
                <ul className="list-disc space-y-2 pl-5 marker:text-brand-gold">
                  {STAY_CHECK_BULLETS.map((key) => (
                    <li key={key}>{t(key)}</li>
                  ))}
                </ul>
                <p>{t("lobStayCheckNote")}</p>
              </div>
            </div>

            {/* Property access */}
            <div className="border-t border-gray-100 pt-2">
              <h3 className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 font-serif text-xl text-brand-black">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </span>
                {t("lobStayAccessTitle")}
              </h3>
              <div className="space-y-5 text-[15px] font-light leading-relaxed text-gray-600">
                <p>{t("lobStayAccessIntro")}</p>
                <div className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                  <p className="mb-2 text-sm font-semibold text-brand-black">{t("lobStayAccessOfficeTitle")}</p>
                  <p>{t("lobStayAccessOfficeBody")}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-brand-black">{t("lobStayAccessSelfTitle")}</p>
                  <p className="mb-3">{t("lobStayAccessSelfP1")}</p>
                  <p className="mb-3">{t("lobStayAccessSelfP2")}</p>
                  <p>{t("lobStayAccessSelfP3")}</p>
                </div>
              </div>
            </div>

            {/* Security deposit */}
            <div className="border-t border-gray-100 pt-2">
              <h3 className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 font-serif text-xl text-brand-black">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </span>
                {t("lobStayDepositTitle")}
              </h3>
              <div className="space-y-4 text-[15px] font-light leading-relaxed text-gray-600">
                <p>{t("lobStayDepositP1")}</p>
                <p>{t("lobStayDepositP2")}</p>
                <p>{t("lobStayDepositP3")}</p>
              </div>
            </div>

            {/* Guest registration */}
            <div className="border-t border-gray-100 pt-2">
              <h3 className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 font-serif text-xl text-brand-black">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                </span>
                {t("lobStayGuestRegTitle")}
              </h3>
              <div className="space-y-4 text-[15px] font-light leading-relaxed text-gray-600">
                <p>{t("lobStayGuestRegP1")}</p>
                <p>{t("lobStayGuestRegP2")}</p>
              </div>
            </div>

            {/* During your stay */}
            <div className="border-t border-gray-100 pt-2">
              <h3 className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 font-serif text-xl text-brand-black">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                </span>
                {t("lobStayDuringTitle")}
              </h3>
              <div className="space-y-4 text-[15px] font-light leading-relaxed text-gray-600">
                <p>{t("lobStayDuringP1")}</p>
                <p>{t("lobStayDuringP2")}</p>
                <p>{t("lobStayDuringP3")}</p>
                <p>{t("lobStayDuringP4")}</p>
              </div>
            </div>

            {/* Before departure */}
            <div className="border-t border-gray-100 pt-2">
              <h3 className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4 font-serif text-xl text-brand-black">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold" aria-hidden>
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                </span>
                {t("lobStayBeforeDepartureTitle")}
              </h3>
              <div className="space-y-4 text-[15px] font-light leading-relaxed text-gray-600">
                <p>{t("lobStayBeforeDepartureIntro")}</p>
                <ul className="space-y-2">
                  {STAY_DEPARTURE_BULLETS.map((key) => (
                    <li key={key} className="flex items-start gap-3 rounded-lg border border-brand-gold/15 bg-amber-50/60 px-4 py-2.5 text-sm">
                      <svg className="mt-0.5 size-4 shrink-0 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t(key)}
                    </li>
                  ))}
                </ul>
                <p>{t("lobStayBeforeDepartureClosing")}</p>
              </div>
            </div>

            {/* Closing */}
            <div className="space-y-3 border-t border-gray-100 pt-6 text-[15px] font-light leading-relaxed text-gray-600">
              <p>{t("lobStayClosing1")}</p>
              <p>{t("lobStayClosing2")}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 bg-brand-stone px-8 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-brand-black text-white hover:bg-brand-gold transition-colors duration-200"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
