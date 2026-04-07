"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Bell,
  Search,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Layers,
  Brain,
  Bot,
  BarChart3,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Panel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Darslar", href: "/lessons", icon: BookOpen },
  { label: "Kartochkalar", href: "/flashcards", icon: Layers },
  { label: "Test", href: "/quiz", icon: Brain },
  { label: "AI", href: "/ai-tutor", icon: Bot },
  { label: "Natijalar", href: "/progress", icon: BarChart3 },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <>
      <header className="h-16 border-b bg-card/80 backdrop-blur-xl sticky top-0 z-20 flex items-center px-4 sm:px-6 gap-4">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menyu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="So'z yoki dars qidirish..."
              className="pl-9 rounded-xl h-9 bg-secondary border-0"
            />
          </div>
        </div>

        <div className="flex-1 sm:hidden" />

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Mavzuni almashtirish"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors relative"
            aria-label="Bildirishnomalar"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>

          <Link
            href="#"
            className="flex items-center gap-2 ml-1 px-2 py-1.5 rounded-xl hover:bg-secondary transition-colors"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                F
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium">
              Foydalanuvchi
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl pt-4 px-4 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="hanzi-display text-2xl text-primary">汉</span>
                <span className="text-xl font-bold">HanziUz</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="So'z yoki dars qidirish..."
                className="pl-9 rounded-xl h-11 bg-secondary border-0"
              />
            </div>

            <nav className="space-y-1">
              {mobileNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
