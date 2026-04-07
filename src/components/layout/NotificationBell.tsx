"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BookOpen,
  Flame,
  Trophy,
  Zap,
  Layers,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  type DbNotification,
} from "@/lib/db";

function getIcon(type: string) {
  switch (type) {
    case "lesson_complete": return BookOpen;
    case "streak": return Flame;
    case "achievement": return Trophy;
    case "xp_goal": return Zap;
    case "flashcards_due": return Layers;
    default: return Bell;
  }
}

function getIconColor(type: string) {
  switch (type) {
    case "lesson_complete": return "bg-primary/10 text-primary";
    case "streak": return "bg-orange-500/10 text-orange-500";
    case "achievement": return "bg-accent/10 text-accent";
    case "xp_goal": return "bg-green-500/10 text-green-500";
    case "flashcards_due": return "bg-blue-500/10 text-blue-500";
    default: return "bg-muted text-muted-foreground";
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Hozirgina";
  if (diffMin < 60) return `${diffMin} daq oldin`;
  if (diffHours < 24) return `${diffHours} soat oldin`;
  if (diffDays < 7) return `${diffDays} kun oldin`;
  return `${Math.floor(diffDays / 7)} hafta oldin`;
}

export default function NotificationBell() {
  const { id: userId } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch unread count on mount and periodically
  useEffect(() => {
    if (!userId) return;
    getUnreadCount(userId).then(setUnreadCount);

    const interval = setInterval(() => {
      getUnreadCount(userId).then(setUnreadCount);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = async () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && userId) {
      setLoading(true);
      const data = await getNotifications(userId);
      setNotifications(data);
      setLoading(false);
    }
  };

  const handleClick = async (notif: DbNotification) => {
    if (!notif.is_read) {
      await markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setIsOpen(false);
    if (notif.href) router.push(notif.href);
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;
    await markAllNotificationsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleOpen}
        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors relative"
        aria-label="Bildirishnomalar"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl border bg-card shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-semibold">Bildirishnomalar</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                >
                  <CheckCheck className="w-3 h-3" />
                  Barchasini o&apos;qilgan deb belgilash
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Bildirishnomalar yo&apos;q
                  </p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = getIcon(notif.type);
                  const colorClass = getIconColor(notif.type);
                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleClick(notif)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50",
                        !notif.is_read && "bg-primary/[0.03]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                          colorClass
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm",
                            !notif.is_read && "font-medium"
                          )}
                        >
                          {notif.title_uz}
                        </p>
                        {notif.message_uz && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notif.message_uz}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {timeAgo(notif.created_at)}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
