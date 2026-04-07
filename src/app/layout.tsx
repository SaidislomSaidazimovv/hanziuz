import type { Metadata } from "next";
import { Inter, Noto_Sans_SC, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      lang="uz"
      className={`${inter.variable} ${notoSansSC.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
