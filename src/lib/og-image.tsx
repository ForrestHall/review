import { ImageResponse } from "next/og";
import { SITE } from "./site";

export const ogSize = { width: 1200, height: 630 };

export function createOgImage(title: string, subtitle?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d4f4f 0%, #134e4a 50%, #115e59 100%)",
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#14b8a6",
              color: "white",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            RV
          </div>
          <span style={{ color: "#99f6e4", fontSize: "24px", fontWeight: 600 }}>
            {SITE.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: title.length > 50 ? "52px" : "60px",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "28px",
                color: "#ccfbf1",
                lineHeight: 1.4,
                maxWidth: "900px",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ color: "#5eead4", fontSize: "22px" }}>
          {SITE.domain}
        </div>
      </div>
    ),
    ogSize
  );
}
