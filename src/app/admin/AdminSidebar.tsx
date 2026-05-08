"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  LogOut,
  MessageSquare,
  Users,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Statistika", icon: BarChart3, exact: true },
  { href: "/admin/users", label: "Foydalanuvchilar", icon: Users },
  { href: "/admin/messages", label: "Xabarlar", icon: MessageSquare },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/lessons", label: "Darslar", icon: BookOpen },
  { href: "/admin/listening", label: "Tinglash", icon: Headphones },
];

const STORAGE_KEY = "admin-sidebar-collapsed";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore collapsed state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className={`shrink-0 bg-[#1a1a1a] text-neutral-200 flex flex-col sticky top-0 h-screen transition-[width] duration-200 ease-out ${
        collapsed ? "w-16" : "w-60"
      } ${hydrated ? "" : "invisible"}`}
    >
      <div
        className={`flex items-center border-b border-neutral-800 ${
          collapsed ? "justify-center px-0 py-5" : "justify-between px-5 py-5"
        }`}
      >
        {!collapsed && (
          <div className="text-lg font-semibold text-white">HanziUz Admin</div>
        )}
        <button
          onClick={toggle}
          aria-label={collapsed ? "Ochish" : "Yopish"}
          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-md text-sm transition-colors ${
                collapsed ? "justify-center px-0 py-2" : "px-3 py-2"
              } ${
                active
                  ? "bg-[#DC2626] text-white"
                  : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        title={collapsed ? "Chiqish" : undefined}
        className={`flex items-center gap-3 border-t border-neutral-800 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors ${
          collapsed ? "justify-center px-0 py-4" : "px-5 py-4"
        }`}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!collapsed && "Chiqish"}
      </button>
    </aside>
  );
}
