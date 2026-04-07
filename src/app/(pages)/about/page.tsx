import { Users, Target, Globe, Heart } from "lucide-react";

export const metadata = {
  title: "Biz haqimizda — HanziUz",
  description: "HanziUz jamoasi va missiyamiz haqida",
};

const values = [
  {
    icon: Target,
    title: "Missiyamiz",
    description:
      "O'zbekistonlik o'quvchilarga xitoy tilini ona tillarida o'rganish imkoniyatini berish. Biz til to'sig'ini bartaraf etamiz.",
  },
  {
    icon: Globe,
    title: "Nima uchun xitoy tili?",
    description:
      "O'zbekiston va Xitoy o'rtasidagi savdo va madaniy aloqalar yildan-yilga o'smoqda. Xitoy tilini bilish — katta imkoniyat.",
  },
  {
    icon: Users,
    title: "Kim uchun?",
    description:
      "Talabalar, tadbirkorlar, sayohatchilar va har bir xitoy tilini o'rganmoqchi bo'lgan o'zbekistonlik uchun.",
  },
  {
    icon: Heart,
    title: "Yondashuvimiz",
    description:
      "Zamonaviy AI texnologiyalar, ilmiy asoslangan SRS tizimi va o'yin elementlari bilan o'rganishni qiziqarli qilamiz.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Biz haqimizda</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          HanziUz — O&apos;zbekiston uchun birinchi xitoy tili o&apos;rganish
          platformasi. Biz xitoy tilini har bir o&apos;zbekistonlik uchun
          tushunarli va qulay qilish maqsadida ishlaymiz.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {values.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-8 text-center space-y-3">
        <h2 className="text-xl font-semibold">Raqamlar bilan</h2>
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div>
            <p className="text-3xl font-bold text-primary">5,000+</p>
            <p className="text-xs text-muted-foreground">So&apos;zlar</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">HSK 1-6</p>
            <p className="text-xs text-muted-foreground">Darajalar</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground">O&apos;zbek tilida</p>
          </div>
        </div>
      </div>
    </div>
  );
}
