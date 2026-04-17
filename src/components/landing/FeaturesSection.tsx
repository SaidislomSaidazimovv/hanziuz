import { Bot, Brain, Gamepad2 } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Repetitor",
    description:
      "Sun'iy intellektga asoslangan shaxsiy o'qituvchi. Xatolaringizni tuzatadi, grammatikani o'zbek tilida tushuntiradi.",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Brain,
    title: "SRS Kartochkalar",
    description:
      "Ilmiy asoslangan takrorlash tizimi. Har bir so'zni o'z vaqtida takrorlang va uzoq muddatli xotiraga o'tkazing.",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: Gamepad2,
    title: "Gamifikatsiya",
    description:
      "Kunlik seriyalar, XP ballar va reytinglar bilan o'rganish jarayonini qiziqarli qiling.",
    gradient: "from-primary/15 to-accent/10",
    iconColor: "text-primary",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-up-sm">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Nima uchun <span className="text-primary">HanziUz</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Zamonaviy texnologiyalar bilan xitoy tilini samarali o&apos;rganing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              className="group relative rounded-3xl border bg-card p-8 hover:shadow-xl transition-shadow duration-300 animate-fade-up"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
