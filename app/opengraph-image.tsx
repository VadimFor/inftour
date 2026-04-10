import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f0f 0%, #2a2a2a 60%, #c5a85f 100%)",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#d4bd82",
            marginBottom: 24,
          }}
        >
          Calpe Private Collection
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          INFTOUR
        </div>
        <div
          style={{
            fontSize: 40,
            lineHeight: 1.2,
            maxWidth: 960,
            color: "#f5f5f5",
          }}
        >
          Reserva apartamentos premium en Calpe.
        </div>
      </div>
    ),
    size,
  );
}
