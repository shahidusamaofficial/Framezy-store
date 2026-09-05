import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site-config";

export const runtime = "edge";
export const alt = "The Wall Edit — Fine Art Framing & Curation, Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1B120C 0%, #3a2416 55%, #1B120C 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${SITE_URL}/brand/og-source.png`}
          alt="The Wall Edit"
          width={620}
          height={331}
          style={{ objectFit: "contain" }}
        />
        <div style={{ display: "flex", fontSize: 26, color: "#C9A34E", marginTop: 28, letterSpacing: 2 }}>
          FINE ART FRAMING &amp; CURATION — PAKISTAN
        </div>
      </div>
    ),
    { ...size }
  );
}
