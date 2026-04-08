"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Bepul",
    price: "0",
    currency: "so'm",
    description: "Boshlang'ich daraja uchun",
    features: [
      "HSK 1 bepul darslari (7 ta)",
      "Kuniga 10 ta flashcard",
      "Kuniga 10 ta AI savol",
      "Asosiy quiz",
      "Progress kuzatuvi",
    ],
    cta: "Hozirgi reja",
    popular: false,
    disabled: true,
  },
  {
    name: "Premium",
    price: "29,000",
    currency: "so'm/oy",
    description: "To'liq kirish — barcha darajalar",
    features: [
      "Barcha HSK 1-6 darslari (27+)",
      "Cheksiz flashcard",
      "Cheksiz AI Repetitor",
      "Kengaytirilgan quiz",
      "Shaxsiy o'quv rejasi",
      "Sertifikat olish",
      "Yangi darslar birinchi bo'lib",
    ],
    cta: "Premium olish",
    popular: true,
    disabled: false,
  },
];

export default function PricingPage() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
          <Crown className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Narxlar</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Bepul boshlang, keyin o&apos;zingizga mos rejani tanlang
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={cn(
              "relative rounded-3xl border p-8",
              plan.popular
                ? "border-primary shadow-xl shadow-primary/10 bg-card"
                : "bg-card"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                Eng mashhur
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground ml-2">{plan.currency}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className={cn("w-5 h-5 shrink-0 mt-0.5", plan.popular ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => !plan.disabled && setShowComingSoon(true)}
              disabled={plan.disabled}
              className={cn(
                "w-full rounded-2xl py-6 text-base",
                plan.popular
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  : ""
              )}
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.popular && <Zap className="w-4 h-4 mr-2" />}
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Coming soon modal */}
      {showComingSoon && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowComingSoon(false)} />
          <motion.div
            className="relative w-full max-w-sm rounded-2xl border bg-card p-6 text-center space-y-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <Crown className="w-12 h-12 text-accent mx-auto" />
            <h3 className="text-lg font-bold">Tez kunda!</h3>
            <p className="text-sm text-muted-foreground">
              To&apos;lov tizimi tez orada ishga tushadi. Sizga xabar beramiz!
            </p>
            <Button
              onClick={() => setShowComingSoon(false)}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Tushunarli
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
