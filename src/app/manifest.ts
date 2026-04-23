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
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
