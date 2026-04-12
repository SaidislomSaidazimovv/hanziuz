"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Brain,
  BarChart3,
  Bot,
  Crown,
  Trophy,
  Medal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Boshqaruv paneli",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Darslar",
    href: "/lessons",
    icon: BookOpen,
  },
  {
    label: "Kartochkalar",
    href: "/flashcards",
    icon: Layers,
  },
  {
    label: "Test",
    href: "/quiz",
    icon: Brain,
  },
  {
    label: "AI Repetitor",
    href: "/ai-tutor",
    icon: Bot,
  },
  {
    label: "Natijalar",
    href: "/progress",
    icon: BarChart3,
  },
  {
    label: "Yutuqlar",
    href: "/achievements",
    icon: Trophy,
  },
  {
    label: "Reyting",
    href: "/leaderboard",
    icon: Medal,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className="hidden md:flex flex-col h-screen sticky top-0 border-r bg-card z-30"
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <span className="hanzi-display text-2xl text-primary shrink-0">
            汉
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="text-lg font-bold tracking-tight whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                HanziUz
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("w-5 h-5 shrink-0", isActive && "text-primary")}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    className="whitespace-nowrap overflow-hidden"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Premium upsell */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">Premium</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Barcha darslarga kirish va cheksiz AI repetitor
            </p>
            <Link
              href="/pricing"
              className="block text-center text-xs font-medium bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors"
            >
              Yangilash
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <div className="border-t p-3 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label={collapsed ? "Menyuni ochish" : "Menyuni yopish"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Yopish
              </motion.span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
