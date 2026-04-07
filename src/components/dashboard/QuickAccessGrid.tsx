"use client";

import { motion } from "framer-motion";
import { Layers, Brain, Bot, BookOpen } from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    label: "Kartochkalar",
    description: "SRS takrorlash",
    href: "/flashcards",
    icon: Layers,
    gradient: "from-blue-500/15 to-cyan-500/15",
    iconColor: "text-blue-500",
    count: "15 ta tayyor",
  },
  {
    label: "Test",
    description: "Bilimni sinash",
    href: "/quiz",
    icon: Brain,
    gradient: "from-purple-500/15 to-pink-500/15",
    iconColor: "text-purple-500",
    count: "HSK 1",
  },
  {
    label: "AI Repetitor",
    description: "Savol berish",
    href: "/ai-tutor",
    icon: Bot,
    gradient: "from-primary/15 to-red-400/15",
    iconColor: "text-primary",
    count: "Online",
  },
  {
    label: "Barcha darslar",
    description: "HSK 1-6",
    href: "/lessons",
    icon: BookOpen,
    gradient: "from-accent/15 to-yellow-400/15",
    iconColor: "text-accent",
    count: "150+ dars",
  },
];

export default function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {quickActions.map((action, i) => (
        <motion.div
          key={action.href}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
        >
          <Link
            href={action.href}
            className="group block rounded-2xl border bg-card p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
          >
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3`}
            >
              <action.icon
                className={`w-5 h-5 ${action.iconColor} group-hover:scale-110 transition-transform`}
              />
            </div>
            <h4 className="font-semibold text-sm">{action.label}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {action.description}
            </p>
            <span className="inline-block text-xs text-primary/80 font-medium mt-2">
              {action.count}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
