import { ImageResponse } from "next/og";

// Generates a 512x512 PNG icon at build time using the brand red and the
// 汉 character. Next.js serves this at /icon and also emits a <link
// rel="icon"> in the document head for every page.

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          fontSize: 400,
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
