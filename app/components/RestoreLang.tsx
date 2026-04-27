"use client";

import { useEffect } from "react";
import { restoreLastLanguage, useLangStore } from "../lib/langStore";
import { isLang } from "../lib/i18n";

export default function RestoreLang() {
  useEffect(() => {
    const forcedLang = new URLSearchParams(window.location.search).get("lang");
    if (isLang(forcedLang)) {
      useLangStore.getState().setLang(forcedLang);
      return;
    }
    restoreLastLanguage();
  }, []);
  return null;
}
