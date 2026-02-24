"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function CalpeWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Replace with current working URL(s) — find via browser DevTools on ibericam.com
    const possibleUrls = [
      // Example — replace with real one(s):
      "https://new-cdn-or-domain.ibericam.com/.../calpe-playa-del-arenal-bol.m3u8",
      // Add fallback mirrors if you discover them
    ];

    // If you can't find a stable HLS URL, consider iframe embedding as fallback:
    // <iframe src="https://ibericam.com/alicante/webcam-calpe-playa-del-arenal-bol" ... />

    let hls: Hls | null = null;

    const tryLoad = (urlIndex = 0) => {
      if (urlIndex >= possibleUrls.length) {
        setError(
          "No working stream found. Check console + ibericam.com for updated URL.",
        );
        setStatus("Failed to load live stream");
        return;
      }

      const streamUrl = possibleUrls[urlIndex];
      setStatus(`Trying stream ${urlIndex + 1} of ${possibleUrls.length}...`);

      if (Hls.isSupported()) {
        hls?.destroy(); // clean previous attempt

        hls = new Hls({
          lowLatencyMode: true,
          backBufferLength: 90,
          enableWorker: true,
          debug: false, // change to true only when troubleshooting
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setStatus("Stream ready → playing");
          video.play().catch((err) => {
            console.warn("Autoplay prevented:", err);
            setStatus("Stream loaded (tap/click to play)");
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          if (data.fatal) {
            setError(`Stream error: ${data.type} — ${data.details}`);
            tryLoad(urlIndex + 1); // next attempt
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", () => {
          setStatus("Native HLS ready");
          video.play().catch(console.warn);
        });
        video.addEventListener("error", () =>
          setError("Native playback failed"),
        );
      } else {
        setError("Browser does not support HLS");
      }
    };

    tryLoad(0);

    return () => {
      hls?.destroy();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        poster="https://image-4.ibericam.com/poster/webcam-calpe-playa-del-arenal-bol.webp"
        style={{ width: "100%", height: "auto", background: "#000" }}
      />
      <p style={{ color: error ? "red" : "orange", marginTop: "8px" }}>
        Status: {status}
        {error && (
          <>
            <br />
            {error}
          </>
        )}
      </p>
      <small>
        Tip: Check browser console (F12) for HLS logs. Visit{" "}
        <a
          href="https://ibericam.com/alicante/webcam-calpe-playa-del-arenal-bol"
          target="_blank"
          rel="noopener noreferrer"
        >
          ibericam.com
        </a>{" "}
        to find the current stream URL if needed.
      </small>
    </div>
  );
}
