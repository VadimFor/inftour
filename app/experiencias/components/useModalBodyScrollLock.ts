"use client";

import { useEffect } from "react";

export function useModalBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (typeof document === "undefined" || !isOpen) return;

    const body = document.body;
    const countAttr = "data-scroll-lock-count";
    const originalAttr = "data-scroll-lock-original-overflow";
    const currentCount = Number(body.getAttribute(countAttr) ?? "0");

    if (currentCount === 0) {
      body.setAttribute(originalAttr, body.style.overflow);
      body.style.overflow = "hidden";
    }

    body.setAttribute(countAttr, String(currentCount + 1));

    return () => {
      const latestCount = Number(body.getAttribute(countAttr) ?? "0");
      const nextCount = Math.max(0, latestCount - 1);

      if (nextCount === 0) {
        const originalOverflow = body.getAttribute(originalAttr) ?? "";
        body.style.overflow = originalOverflow;
        body.removeAttribute(countAttr);
        body.removeAttribute(originalAttr);
        return;
      }

      body.setAttribute(countAttr, String(nextCount));
    };
  }, [isOpen]);
}
