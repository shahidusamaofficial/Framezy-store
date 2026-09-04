import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Framezy — Wall Frames & Canvas Art, Pakistan";
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
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 32,
            background: "linear-gradient(135deg, #C1552C, #C9A34E)",
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 72, color: "#F4EBDD", fontWeight: 700 }}>F</span>
        </div>
        <div style={{ display: "flex", fontSize: 76, color: "#F4EBDD", fontWeight: 600, letterSpacing: -1 }}>
          Framezy
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#C9A34E", marginTop: 18 }}>
          Wall Frames & Canvas Art — Pakistan
        </div>
      </div>
    ),
    { ...size }
  );
}
