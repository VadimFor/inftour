"use client";

import { useEffect } from "react";
import { restoreLastLanguage } from "../lib/langStore";

export default function RestoreLang() {
  useEffect(() => {
    restoreLastLanguage();
  }, []);
  return null;
}
