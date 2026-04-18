/** Light tap haptic (Vibration API; common on Android; no-op on iOS Safari). */
export function triggerLightTapHaptic() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const touchDevice =
    "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;
  if (!coarsePointer && !touchDevice) return;
  try {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(14);
    }
  } catch {
    /* ignore */
  }
}
