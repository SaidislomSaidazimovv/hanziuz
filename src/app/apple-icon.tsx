import { ImageResponse } from "next/og";

// Apple home-screen icon (iOS). 180x180 PNG. Next.js emits the correct
// <link rel="apple-touch-icon"> tag automatically.

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          fontSize: 140,
          fontWeight: 700,
          color: "#DC2626",
          fontFamily: "serif",
        }}
      >
        汉
      </div>
    ),
    { ...size }
  );
}
