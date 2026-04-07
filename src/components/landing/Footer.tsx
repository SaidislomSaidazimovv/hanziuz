import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Platforma: [
    { label: "Darslar", href: "/lessons" },
    { label: "Kartochkalar", href: "/flashcards" },
    { label: "AI Repetitor", href: "/ai-tutor" },
    { label: "Narxlar", href: "#pricing" },
  ],
  Resurslar: [
    { label: "HSK haqida", href: "/hsk-guide" },
    { label: "Blog", href: "/blog" },
    { label: "Yo'riqnoma", href: "/guide" },
  ],
  Kompaniya: [
    { label: "Biz haqimizda", href: "/about" },
    { label: "Aloqa", href: "/contact" },
    { label: "Maxfiylik siyosati", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="hanzi-display text-2xl text-primary">汉</span>
              <span className="text-xl font-bold">HanziUz</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O&apos;zbekiston uchun birinchi xitoy tili o&apos;rganish
              platformasi.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HanziUz. Barcha huquqlar
            himoyalangan.
          </p>
          <p className="text-sm text-muted-foreground">
            O&apos;zbekistondan ❤️ bilan yaratilgan
          </p>
        </div>
      </div>
    </footer>
  );
}
