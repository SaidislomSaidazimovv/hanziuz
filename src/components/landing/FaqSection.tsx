"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ko&apos;p so&apos;raladigan savollar
          </h2>
          <p className="text-muted-foreground">
            Savollaringizga tez javoblar
          </p>
        </div>

        <div className="rounded-2xl border bg-card divide-y divide-border overflow-hidden">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-accent/5 transition-colors cursor-pointer"
                >
                  <span className="font-medium">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
