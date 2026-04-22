import { ImageResponse } from "next/og";

export const alt = "Farmacia Vázquez — Tu farmacia de confianza en San Miguel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #FBF7F3 0%, #F4EEF7 60%, #EFE5F2 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#5C1A6E",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              fontWeight: 700,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            +
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1A1320",
              letterSpacing: "0.02em",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            FARMACIA VÁZQUEZ
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              color: "#1A1320",
              letterSpacing: "-0.02em",
              maxWidth: 920,
            }}
          >
            Tu farmacia de confianza en San Miguel.
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#4A3D54",
              maxWidth: 920,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Medicamentos, dermocosmética y cuidado personal · Envíos en el día
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6A6075",
            fontSize: 22,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <span>Av. Balbín 4702</span>
            <span style={{ color: "#D0C8D8" }}>·</span>
            <span>Abierto 9 a 21 hs</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                background: "#00A651",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              ENVÍO GRATIS
            </span>
            <span>desde $15.000</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
