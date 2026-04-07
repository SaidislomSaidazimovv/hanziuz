import { Shield } from "lucide-react";

export const metadata = {
  title: "Maxfiylik siyosati — HanziUz",
  description: "HanziUz platformasining maxfiylik siyosati",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Maxfiylik siyosati</h1>
        <p className="text-muted-foreground">
          Oxirgi yangilanish: 2026-yil, 1-aprel
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section className="rounded-2xl border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">1. Umumiy ma&apos;lumot</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            HanziUz platformasi foydalanuvchilarning shaxsiy ma&apos;lumotlarini
            himoya qilishga alohida e&apos;tibor qaratadi. Ushbu maxfiylik siyosati
            qanday ma&apos;lumotlar yig&apos;ilishi, ular qanday ishlatilishi va
            himoya qilinishini tushuntiradi.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">
            2. Qanday ma&apos;lumotlar yig&apos;iladi
          </h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              <strong className="text-foreground">Hisob ma&apos;lumotlari:</strong>{" "}
              ism, email manzil, parol (shifrlangan holda)
            </li>
            <li>
              <strong className="text-foreground">O&apos;quv ma&apos;lumotlari:</strong>{" "}
              yakunlangan darslar, test natijalari, SRS kartochka statistikasi
            </li>
            <li>
              <strong className="text-foreground">Foydalanish ma&apos;lumotlari:</strong>{" "}
              kirish vaqti, qurilma turi, brauzer ma&apos;lumotlari
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">
            3. Ma&apos;lumotlardan foydalanish
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Yig&apos;ilgan ma&apos;lumotlar faqat quyidagi maqsadlarda ishlatiladi:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>— Platformani ishlashi va shaxsiy tajribani yaxshilash</li>
            <li>— O&apos;quv tavsiyalarini moslashtirish</li>
            <li>— Texnik muammolarni hal qilish</li>
            <li>— Statistik tahlillar (anonim holda)</li>
          </ul>
        </section>

        <section className="rounded-2xl border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">
            4. Ma&apos;lumotlar himoyasi
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Barcha shaxsiy ma&apos;lumotlar zamonaviy shifrlash texnologiyalari
            yordamida himoyalanadi. Parollar bcrypt algoritmi bilan
            shifrlanadi. Ma&apos;lumotlar uchinchi tomonlarga sotilmaydi yoki
            berilmaydi.
          </p>
        </section>

        <section className="rounded-2xl border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">
            5. Foydalanuvchi huquqlari
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>— O&apos;z ma&apos;lumotlarini ko&apos;rish va yuklab olish</li>
            <li>— Ma&apos;lumotlarni tuzatish yoki yangilash</li>
            <li>— Hisobni o&apos;chirish va barcha ma&apos;lumotlarni yo&apos;q qilish</li>
          </ul>
        </section>

        <section className="rounded-2xl border bg-card p-6 space-y-3">
          <h2 className="text-lg font-semibold">6. Aloqa</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Maxfiylik siyosati bo&apos;yicha savollaringiz bo&apos;lsa, bizga
            murojaat qiling: <strong className="text-foreground">info@hanziuz.uz</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
