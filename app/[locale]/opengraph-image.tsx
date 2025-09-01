import { ImageResponse } from "next/og";
import { getDict, type Locale } from "@/lib/i18n";
import { DOMAIN } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ locale: Locale }> };

export default async function OG({ params }: Props) {
  const { locale } = await params;
  const dict = getDict(locale);

  const title =
    locale === "fr"
      ? "Raphael Comandon — Développeur Full-Stack"
      : "Raphael Comandon — Full-Stack Developer";

  const subtitle =
    locale === "fr"
      ? "React • Next.js • Node.js • TypeScript"
      : "React • Next.js • Node.js • TypeScript";

  const domainLabel = DOMAIN.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0ea5e9 0%, #1e293b 60%)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: 0.5,
          }}
        >
          {domainLabel}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.9)",
              fontWeight: 600,
            }}
          >
            {locale === "fr" ? "Portfolio & Projets" : "Portfolio & Projects"}
          </div>

          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {locale === "fr" ? "Dispo pour missions" : "Available for projects"}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
