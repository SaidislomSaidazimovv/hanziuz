"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Bepul",
    price: "0",
    currency: "so'm",
    description: "Boshlang'ich daraja uchun",
    features: [
      "HSK 1 barcha darslari",
      "Asosiy SRS kartochkalar",
      "Kunlik 5 ta AI savol",
      "Ierogliflar yozish mashqi",
      "Progress kuzatuvi",
    ],
    cta: "Bepul boshlash",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "49,000",
    currency: "so'm/oy",
    description: "To'liq kirish — barcha darajalar",
    features: [
      "HSK 1-6 barcha darslar",
      "Cheksiz SRS kartochkalar",
      "Cheksiz AI repetitor",
      "Ilg'or grammatika mashqlari",
      "Shaxsiy o'quv rejasi",
      "Offline rejim",
      "Sertifikat",
    ],
    cta: "Premium olish",
    variant: "default" as const,
    popular: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Oddiy narxlar
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Bepul boshlang, keyin o&apos;zingizga mos rejani tanlang
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-3xl border p-8 ${
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 bg-card"
                  : "bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  Mashhur
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">
                  {plan.currency}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.variant}
                className={`w-full rounded-2xl py-6 text-base ${
                  plan.popular
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    : ""
                }`}
                render={<Link href="/register" />}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
