import { ImageResponse } from "next/og";
import { getProduct, products } from "@/lib/data/products";
import { fmtPrice } from "@/lib/format";

export const alt = "Producto — Farmacia Vázquez";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FBF7F3",
            fontSize: 48,
            color: "#1A1320",
          }}
        >
          Producto no encontrado
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            flex: "0 0 540px",
            background: `linear-gradient(180deg, ${p.cA} 0%, #FBF7F3 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 60,
          }}
        >
          <div
            style={{
              width: 280,
              height: 360,
              borderRadius: 16,
              background: p.cB,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 64px rgba(26,19,32,0.18)",
              color: "#fff",
              padding: 32,
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: "0.18em",
                fontWeight: 700,
                opacity: 0.8,
              }}
            >
              {p.brand.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 32,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                marginTop: 18,
                lineHeight: 1.1,
              }}
            >
              {p.name}
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 14,
                letterSpacing: "0.1em",
                opacity: 0.85,
              }}
            >
              {p.size}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "70px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: 18,
                color: "#5C1A6E",
                fontWeight: 700,
                letterSpacing: "0.14em",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {p.brand.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 64,
                lineHeight: 1.05,
                color: "#1A1320",
                letterSpacing: "-0.02em",
                maxWidth: 540,
              }}
            >
              {p.name}
            </div>
            {p.short && (
              <div
                style={{
                  fontSize: 22,
                  color: "#4A3D54",
                  lineHeight: 1.45,
                  maxWidth: 540,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {p.short}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 14, color: "#7A7185", letterSpacing: "0.12em", fontWeight: 600 }}>
                PRECIO
              </div>
              <div
                style={{
                  fontSize: 56,
                  color: "#1A1320",
                  letterSpacing: "-0.02em",
                  fontFamily: "Georgia, serif",
                }}
              >
                {fmtPrice(p.price)}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#1A1320",
                fontSize: 18,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "#5C1A6E",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                +
              </div>
              <span style={{ fontWeight: 700, letterSpacing: "0.04em" }}>FARMACIA VÁZQUEZ</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
