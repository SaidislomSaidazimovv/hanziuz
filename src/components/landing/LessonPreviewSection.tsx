"use client";

import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sampleWords = [
  {
    hanzi: "你好",
    pinyin: "nǐ hǎo",
    meaning: "Salom",
    level: 1,
  },
  {
    hanzi: "谢谢",
    pinyin: "xiè xie",
    meaning: "Rahmat",
    level: 1,
  },
  {
    hanzi: "再见",
    pinyin: "zài jiàn",
    meaning: "Xayr",
    level: 1,
  },
  {
    hanzi: "我",
    pinyin: "wǒ",
    meaning: "Men",
    level: 1,
  },
  {
    hanzi: "你",
    pinyin: "nǐ",
    meaning: "Sen",
    level: 1,
  },
  {
    hanzi: "很好",
    pinyin: "hěn hǎo",
    meaning: "Juda yaxshi",
    level: 1,
  },
];

export default function LessonPreviewSection() {
  return (
    <section className="py-24 px-6 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-4 text-primary border-primary/30"
          >
            HSK 1 — Boshlang&apos;ich
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Darslar namunasi
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            HSK 1 darajasidagi eng ko&apos;p ishlatiladigan so&apos;zlar bilan
            boshlang
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {sampleWords.map((word) => (
            <motion.div
              key={word.hanzi}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
              }}
              className="group relative bg-card rounded-2xl border p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="hanzi-display text-4xl sm:text-5xl mb-3 group-hover:text-primary transition-colors">
                {word.hanzi}
              </div>
              <div className="pinyin text-sm text-primary/80 mb-1">
                {word.pinyin}
              </div>
              <div className="text-muted-foreground font-medium">
                {word.meaning}
              </div>
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`${word.meaning} so'zini tinglash`}
              >
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-muted-foreground">
            ...va yana <span className="font-semibold text-foreground">5,000+</span>{" "}
            so&apos;z HSK 1 dan 6 gacha
          </p>
        </motion.div>
      </div>
    </section>
  );
}
