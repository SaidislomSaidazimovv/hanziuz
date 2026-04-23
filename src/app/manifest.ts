import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HanziUz — O'zbek tilida xitoy tili",
    short_name: "HanziUz",
    description:
      "O'zbekiston uchun birinchi xitoy tili o'rganish platformasi. HSK 1-6 darslari, AI repetitor, SRS kartochkalar.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#DC2626",
    lang: "uz",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        // Next.js serves src/app/icon.tsx as a 512x512 PNG at /icon.
        // We list it here for Chrome's PWA install requirements (wants a
        // raster PNG ≥192px); the SVG above covers everything else.
        src: "/icon",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
    ],
  };
}
