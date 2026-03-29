"use client";

import { useEffect, useRef } from "react";

export default function ElevenLabsWidget() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("placement", "bottom-right");
  }, []);

  return (
    <elevenlabs-convai
      ref={ref as any}
      agent-id="agent_3801key34mpyfv68wzexyb1xb1z8"
      placement="bottom-right"
    />
  );
}
