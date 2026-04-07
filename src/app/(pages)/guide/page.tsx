import { HelpCircle, BookOpen, Layers, Brain, Bot, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Yo'riqnoma — HanziUz",
  description: "HanziUz platformasidan foydalanish bo'yicha yo'riqnoma",
};

const steps = [
  {
    icon: BookOpen,
    title: "1. Ro'yxatdan o'ting",
    description:
      "Bepul hisob yarating. Email va parol kiriting — 30 soniyada tayyor.",
  },
  {
    icon: BookOpen,
    title: "2. Darslarni boshlang",
    description:
      "HSK 1 darajasidan boshlang. Har bir darsda yangi so'zlar, ierogliflar va grammatika o'rgatiladi.",
  },
  {
    icon: Layers,
    title: "3. Kartochkalar bilan takrorlang",
    description:
      "SRS (Spaced Repetition System) tizimi so'zlarni to'g'ri vaqtda takrorlashga yordam beradi.",
  },
  {
    icon: Brain,
    title: "4. Testlar bilan tekshiring",
    description:
      "Har bir darsdan keyin test topshiring. O'z bilimingizni sinab ko'ring.",
  },
  {
    icon: Bot,
    title: "5. AI Repetitor bilan mashq qiling",
    description:
      "Sun'iy intellekt repetitori bilan o'zbek tilida suhbatlashing. Savollar bering, xatolaringizni tuzating.",
  },
  {
    icon: BarChart3,
    title: "6. Natijalarni kuzating",
    description:
      "Kunlik seriyalar, XP ballar va progress statistikasi bilan motivatsiyangizni saqlang.",
  },
];

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Yo&apos;riqnoma</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          HanziUz platformasidan qanday foydalanish kerak — bosqichma-bosqich
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex gap-4 rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <step.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Savollaringiz bormi?</h2>
        <p className="text-muted-foreground">
          AI Repetitorga yozing — u sizga o&apos;zbek tilida yordam beradi!
        </p>
      </div>
    </div>
  );
}
