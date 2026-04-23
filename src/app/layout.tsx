import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HanziUz — O'zbek tilida xitoy tilini o'rganing",
  description:
    "O'zbekiston uchun birinchi xitoy tili o'rganish platformasi. AI repetitor, SRS kartochkalar, HSK 1-6 darslari.",
  keywords: [
    "xitoy tili",
    "o'zbek",
    "HSK",
    "hanzi",
    "pinyin",
    "chinese learning",
    "uzbekistan",
  ],
  appleWebApp: {
    capable: true,
    title: "HanziUz",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#DC2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="uz"
      className={`${inter.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
