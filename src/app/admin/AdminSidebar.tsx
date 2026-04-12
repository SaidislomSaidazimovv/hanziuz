"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileText,
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
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 bg-[#1a1a1a] text-neutral-200 flex flex-col">
      <div className="px-5 py-5 border-b border-neutral-800">
        <div className="text-lg font-semibold text-white">HanziUz Admin</div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-[#DC2626] text-white"
                  : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-5 py-4 border-t border-neutral-800 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Chiqish
      </button>
    </aside>
  );
}
