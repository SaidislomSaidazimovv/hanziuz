"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  BookOpen,
  Layers,
  Brain,
  Bot,
  BarChart3,
  Crown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import SearchBar from "@/components/layout/SearchBar";
import NotificationBell from "@/components/layout/NotificationBell";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/lib/user-context";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Panel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Darslar", href: "/lessons", icon: BookOpen },
  { label: "Kartochkalar", href: "/flashcards", icon: Layers },
  { label: "Test", href: "/quiz", icon: Brain },
  { label: "AI", href: "/ai-tutor", icon: Bot },
  { label: "Natijalar", href: "/progress", icon: BarChart3 },
];

function PremiumCrown() {
  return (
    <span
      className="relative inline-flex items-center justify-center shrink-0"
      title="Premium"
      aria-label="Premium"
    >
      <span className="absolute inset-0 rounded-full bg-amber-400/40 blur-[3px] animate-pulse" />
      <Crown className="relative w-4 h-4 text-amber-500 drop-shadow-[0_0_3px_rgba(245,158,11,0.6)]" />
    </span>
  );
}

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { name: userName, email: userEmail, avatarUrl: userAvatar, initials, isPremium } = useUser();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

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
      <header className="h-16 border-b bg-card/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
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
          <div className="hidden sm:flex items-center max-w-md w-80">
            <SearchBar />
          </div>
        </div>

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

          <NotificationBell />

          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 ml-1 px-2 py-1.5 rounded-xl hover:bg-secondary transition-colors"
            >
              <Avatar className="w-8 h-8">
                {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium max-w-[160px]">
                <span className="truncate">
                  {userName || userEmail?.split("@")[0] || "Foydalanuvchi"}
                </span>
                {isPremium && <PremiumCrown />}
              </span>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border bg-card shadow-xl z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b">
                    <Avatar className="w-10 h-10 shrink-0">
                      {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate flex items-center gap-1.5">
                        <span className="truncate">
                          {userName || "Foydalanuvchi"}
                        </span>
                        {isPremium && <PremiumCrown />}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Profil
                    </Link>
                    <Link
                      href="/progress"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      Natijalarim
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      Sozlamalar
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm w-full hover:bg-red-500/10 text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Chiqish
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

            {/* Mobile logout */}
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Chiqish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
