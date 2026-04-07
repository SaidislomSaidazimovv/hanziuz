import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";

export const metadata = {
  title: "HSK haqida — HanziUz",
  description: "HSK (Hanyu Shuiping Kaoshi) xitoy tili imtihoni haqida to'liq ma'lumot",
};

const hskLevels = [
  {
    level: 1,
    words: 150,
    description: "Eng oddiy so'z va iboralar. O'zingizni tanishtirish, salomlashish, oddiy savollar.",
    topics: "Salomlashish, raqamlar, oila, vaqt, ranglar",
    duration: "1-2 oy",
  },
  {
    level: 2,
    words: 300,
    description: "Kundalik hayotdagi oddiy suhbatlar. Do'konda xarid, transport, ob-havo.",
    topics: "Xarid, transport, ob-havo, ovqat, kasallik",
    duration: "2-4 oy",
  },
  {
    level: 3,
    words: 600,
    description: "Kundalik, o'quv va ish muhitida asosiy muloqot.",
    topics: "Sayohat, ish, ta'lim, madaniyat, sport",
    duration: "4-6 oy",
  },
  {
    level: 4,
    words: 1200,
    description: "Keng ko'lamli mavzularda erkin suhbatlashish.",
    topics: "Ijtimoiy masalalar, texnologiya, san'at, tabiiy fanlar",
    duration: "6-12 oy",
  },
  {
    level: 5,
    words: 2500,
    description: "Xitoy tilida gazeta, jurnal o'qish va ma'ruza tinglash.",
    topics: "Siyosat, iqtisodiyot, falsafa, adabiyot",
    duration: "1-2 yil",
  },
  {
    level: 6,
    words: 5000,
    description: "Xitoy tilida erkin yozish va gapirish. Professional daraja.",
    topics: "Barcha mavzular, idiomalar, ilmiy matnlar",
    duration: "2+ yil",
  },
];

export default function HSKGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">HSK nima?</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          HSK (汉语水平考试 — Hanyu Shuiping Kaoshi) — xitoy tilini bilish
          darajasini belgilaydigan xalqaro standart imtihon. Xitoyda
          o&apos;qish yoki ishlash uchun HSK sertifikati talab qilinadi.
        </p>
      </div>

      <div className="grid gap-4">
        {hskLevels.map((hsk) => (
          <div
            key={hsk.level}
            className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary">
                  {hsk.level}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">HSK {hsk.level}</h3>
                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-md">
                    {hsk.words} so&apos;z
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ~{hsk.duration}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {hsk.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Mavzular:</span>{" "}
                  {hsk.topics}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-8 text-center space-y-4">
        <BookOpen className="w-8 h-8 text-primary mx-auto" />
        <h2 className="text-xl font-semibold">
          HanziUz bilan HSK ga tayyorlaning
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Bizning platformada HSK 1 dan 6 gacha barcha darajalar uchun darslar,
          kartochkalar, testlar va AI repetitor mavjud — barchasi o&apos;zbek tilida.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
          <TrendingUp className="w-4 h-4" />
          Bugundan boshlang — bepul!
        </div>
      </div>
    </div>
  );
}
