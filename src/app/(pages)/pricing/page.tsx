"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

const MONTHLY_PRICE = 29_000;
const YEARLY_TOTAL = 249_000;
const YEARLY_PER_MONTH = Math.round(YEARLY_TOTAL / 12);
const YEARLY_SAVINGS = MONTHLY_PRICE * 12 - YEARLY_TOTAL;
const YEARLY_DISCOUNT_PCT = Math.round((YEARLY_SAVINGS / (MONTHLY_PRICE * 12)) * 100);

function formatUzs(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const freeFeatures: [boolean, string][] = [
  [true, "HSK 1 darslari (7 ta)"],
  [true, "Kuniga 10 ta flashcard"],
  [true, "Kuniga 10 ta AI savol"],
  [true, "Asosiy quiz"],
  [true, "Streak va XP tizimi"],
  [false, "HSK 2-6 darslari"],
  [false, "Cheksiz AI Repetitor"],
  [false, "Sertifikat"],
];

const premiumFeatures: string[] = [
  "Barcha HSK 1-6 darslari (27 ta)",
  "Cheksiz flashcard",
  "Cheksiz AI Repetitor",
  "Kengaytirilgan quiz",
  "Streak va XP tizimi",
  "Achievements va Leaderboard",
  "Sertifikat (tez orada)",
];

const corporateFeatures: string[] = [
  "Barcha Premium imkoniyatlar",
  "5 va undan ko'p foydalanuvchi",
  "Admin boshqaruv paneli",
  "Oylik hisobotlar",
  "Maxsus kontent (ixtiyoriy)",
  "Texnik qo'llab-quvvatlash",
];

const faqs = [
  {
    q: "Bepul rejimda nima o'rganish mumkin?",
    a: "HSK 1 darajasidagi 7 ta dars, 150 ta so'z va kuniga 10 ta AI savol.",
  },
  {
    q: "Obunani bekor qilish mumkinmi?",
    a: "Ha, istalgan vaqtda bekor qilishingiz mumkin. Obuna muddati tugaguncha Premium imkoniyatlar saqlanib qoladi.",
  },
  {
    q: "To'lov qanday amalga oshiriladi?",
    a: "Tez orada Click va Payme orqali to'lov imkoniyati qo'shiladi.",
  },
  {
    q: "Korporativ tarifda nechta foydalanuvchi bo'lishi mumkin?",
    a: "Minimal 5 ta foydalanuvchi. Ko'proq kerak bo'lsa, biz bilan bog'laning.",
  },
  {
    q: "Sertifikat qachon tayyor bo'ladi?",
    a: "Sertifikat tizimi ishlab chiqilmoqda, tez orada qo'shiladi.",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isYearly = billing === "yearly";

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-14">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
          <Crown className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Narxlar</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Bepul boshlang, keyin o&apos;zingizga mos rejani tanlang
        </p>
      </div>

      <BillingToggle billing={billing} onChange={setBilling} />

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <PlanCard
          name="Bepul"
          price={<span className="text-4xl font-bold">0</span>}
          unit="so'm"
          subtitle="Boshlash uchun"
          ctaHref="/register"
          ctaLabel="Bepul boshlash"
        >
          {freeFeatures.map(([ok, text]) => (
            <FeatureRow key={text} ok={ok}>
              {text}
            </FeatureRow>
          ))}
        </PlanCard>

        <PlanCard
          highlighted
          badge="Eng mashhur"
          name="Premium"
          subtitle="To'liq kirish — barcha darajalar"
          price={
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl font-bold">
                {formatUzs(isYearly ? YEARLY_PER_MONTH : MONTHLY_PRICE)}
              </span>
              <span
                className="text-sm text-muted-foreground line-through"
                style={{ visibility: isYearly ? "visible" : "hidden" }}
              >
                {formatUzs(MONTHLY_PRICE)}
              </span>
            </div>
          }
          unit="so'm/oy"
          extra={
            <div className="text-sm space-y-1">
              <div
                className="text-muted-foreground"
                style={{ visibility: isYearly ? "visible" : "hidden" }}
              >
                {formatUzs(YEARLY_TOTAL)} so&apos;m/yil
              </div>
              <div
                className="text-green-600 dark:text-green-500 font-medium"
                style={{ visibility: isYearly ? "visible" : "hidden" }}
              >
                {formatUzs(YEARLY_SAVINGS)} so&apos;m tejaysiz
              </div>
            </div>
          }
          onCta={() => setModalOpen(true)}
          ctaLabel="Premium olish"
        >
          {premiumFeatures.map((t) => (
            <FeatureRow key={t} ok>
              {t}
            </FeatureRow>
          ))}
        </PlanCard>

        <PlanCard
          name="Korporativ"
          subtitle="5+ xodim uchun"
          price={<span className="text-3xl font-bold">Kelishiladi</span>}
          unit=""
          ctaHref="/contact"
          ctaLabel="Bog'lanish"
        >
          {corporateFeatures.map((t) => (
            <FeatureRow key={t} ok>
              {t}
            </FeatureRow>
          ))}
        </PlanCard>
      </div>

      <section className="max-w-3xl mx-auto space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-center">Ko&apos;p so&apos;raladigan savollar</h2>
        <div className="rounded-2xl border bg-card divide-y divide-border overflow-hidden">
          {faqs.map((f, i) => (
            <FaqItem
              key={f.q}
              question={f.q}
              answer={f.a}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-sm rounded-2xl border bg-card p-6 text-center space-y-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <Crown className="w-12 h-12 text-accent mx-auto" />
              <h3 className="text-lg font-bold">To&apos;lov tizimi tez orada!</h3>
              <p className="text-sm text-muted-foreground">
                Hozircha admin orqali faollashtiriladi. Bog&apos;lanish uchun{" "}
                <Link
                  href="/contact"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  aloqa sahifasiga
                </Link>{" "}
                o&apos;ting.
              </p>
              <Button
                onClick={() => setModalOpen(false)}
                className="w-full rounded-xl"
              >
                Tushunarli
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
}) {
  const base =
    "cursor-pointer text-sm font-medium rounded-full px-5 py-2 inline-flex items-center gap-2 transition-all duration-200 ease-out";
  const active = "bg-background text-foreground shadow-sm";
  const inactive = "bg-transparent text-muted-foreground hover:text-foreground";

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-full border bg-muted/40 p-1">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={cn(base, billing === "monthly" ? active : inactive)}
        >
          Oylik
        </button>
        <button
          type="button"
          onClick={() => onChange("yearly")}
          className={cn(base, billing === "yearly" ? active : inactive)}
        >
          Yillik
          <span
            className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-red text-white"
            )}
          >
            −{YEARLY_DISCOUNT_PCT}%
          </span>
        </button>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  subtitle,
  price,
  unit,
  extra,
  highlighted,
  badge,
  ctaLabel,
  ctaHref,
  onCta,
  children,
}: {
  name: string;
  subtitle: string;
  price: React.ReactNode;
  unit: string;
  extra?: React.ReactNode;
  highlighted?: boolean;
  badge?: string;
  ctaLabel: string;
  ctaHref?: string;
  onCta?: () => void;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      {badge && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full text-white shadow"
          style={{ backgroundColor: "#F59E0B" }}
        >
          {badge}
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          {price}
          {unit && <span className="text-muted-foreground">{unit}</span>}
        </div>
        {extra}
      </div>
      <ul className="space-y-3 flex-1">{children}</ul>
      {ctaHref ? (
        <Link href={ctaHref} className="block">
          <Button
            className="w-full rounded-2xl py-6 text-base"
            variant={highlighted ? "default" : "outline"}
          >
            {ctaLabel}
          </Button>
        </Link>
      ) : (
        <Button
          onClick={onCta}
          className="w-full rounded-2xl py-6 text-base"
          variant={highlighted ? "default" : "outline"}
        >
          {ctaLabel}
        </Button>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative rounded-3xl p-8 bg-card flex flex-col gap-6 h-full min-h-155",
        highlighted
          ? "border-2 shadow-xl shadow-primary/10 md:-translate-y-2"
          : "border"
      )}
      style={highlighted ? { borderColor: "#DC2626" } : undefined}
    >
      {inner}
    </motion.div>
  );
}

function FeatureRow({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      {ok ? (
        <Check className="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-500" />
      ) : (
        <X className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground/60" />
      )}
      <span
        className={cn(
          "text-sm",
          !ok && "text-muted-foreground line-through decoration-muted-foreground/40"
        )}
      >
        {children}
      </span>
    </li>
  );
}

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-accent/5 transition-colors"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
