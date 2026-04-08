"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  "Barcha HSK 1-6 darslari (27+ dars)",
  "Cheksiz AI Repetitor",
  "Kengaytirilgan flashcard tizimi",
  "Sertifikat olish imkoniyati",
];

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Crown */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center">
                <Crown className="w-8 h-8 text-accent" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center mb-2">
              Bu dars Premium
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Barcha HSK darslariga kirish uchun Premium obunani
              faollashtiring
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-3xl font-bold">29,000</span>
              <span className="text-muted-foreground ml-1">so&apos;m/oy</span>
            </div>

            {/* Buttons */}
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 text-base mb-3"
              render={<Link href="/pricing" />}
            >
              Premium olish
            </Button>
            <Button
              variant="ghost"
              className="w-full rounded-xl"
              onClick={onClose}
            >
              Bekor qilish
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
