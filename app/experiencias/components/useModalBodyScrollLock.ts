"use client";

import { useEffect } from "react";

export function useModalBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (typeof document === "undefined" || !isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);
}
