"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | string;
  created_at: string;
};

type Filter = "all" | "new" | "read" | "replied";

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "Barchasi" },
  { key: "new", label: "Yangi" },
  { key: "read", label: "O'qilgan" },
  { key: "replied", label: "Javob berilgan" },
];

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  const months = [
    "yan", "fev", "mar", "apr", "may", "iyn",
    "iyl", "avg", "sen", "okt", "noy", "dek",
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}, ${year} ${hh}:${mm}`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "new") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 text-xs px-2 py-0.5 font-medium">
        Yangi
      </span>
    );
  }
  if (status === "replied") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5 font-medium">
        Javob berilgan
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 font-medium">
      O&apos;qilgan
    </span>
  );
}

export default function MessagesClient({
  initialMessages,
}: {
  initialMessages: AdminMessage[];
}) {
  const [messages, setMessages] = useState<AdminMessage[]>(initialMessages);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const counts = useMemo(() => {
    const c = { all: messages.length, new: 0, read: 0, replied: 0 };
    for (const m of messages) {
      if (m.status === "new") c.new++;
      else if (m.status === "read") c.read++;
      else if (m.status === "replied") c.replied++;
    }
    return c;
  }, [messages]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? messages
        : messages.filter((m) => m.status === filter),
    [messages, filter]
  );

  function showToast(kind: "ok" | "err", text: string) {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 3000);
  }

  async function setStatus(id: string, status: "read" | "replied") {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("err", data.error || "Xatolik");
        return;
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      showToast(
        "ok",
        status === "read" ? "O'qilgan deb belgilandi" : "Javob berilgan deb belgilandi"
      );
    } catch {
      showToast("err", "Tarmoq xatosi");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Bu xabarni o'chirasizmi?")) return;
    setBusy(id);
    // Start fade
    setDeleting((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleting((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        showToast("err", data.error || "Xatolik");
        return;
      }
      // Wait for fade animation (300ms) before removing
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setDeleting((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 300);
      showToast("ok", "Xabar o'chirildi");
    } catch {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast("err", "Tarmoq xatosi");
    } finally {
      setBusy(null);
    }
  }

  function toggleExpand(id: string, currentStatus: string) {
    const next = expanded === id ? null : id;
    setExpanded(next);
    // Auto-mark as read on first expand of a "new" message
    if (next === id && currentStatus === "new") {
      setStatus(id, "read");
    }
  }

  return (
    <>
      <div className="flex gap-1 border-b border-neutral-200">
        {TABS.map((t) => {
          const active = filter === t.key;
          const count = counts[t.key];
          return (
            <button
              key={t.key}
              onClick={() => {
                setFilter(t.key);
                setExpanded(null);
              }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors inline-flex items-center gap-2 ${
                active
                  ? "border-[#DC2626] text-[#DC2626]"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {t.label}
              <span
                className={`inline-flex items-center justify-center rounded-full text-xs px-2 min-w-[1.5rem] h-5 ${
                  active
                    ? "bg-[#DC2626] text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="w-8"></th>
              <th className="text-left px-4 py-3 font-medium">Ism</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Mavzu</th>
              <th className="text-left px-4 py-3 font-medium">Sana</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  Hech qanday xabar yo&apos;q
                </td>
              </tr>
            )}
            {visible.map((m) => {
              const isOpen = expanded === m.id;
              const isUnread = m.status === "new";
              const isDeleting = deleting.has(m.id);
              return (
                <FragmentRow
                  key={m.id}
                  isOpen={isOpen}
                  isUnread={isUnread}
                  isDeleting={isDeleting}
                >
                  <tr
                    onClick={() => toggleExpand(m.id, m.status)}
                    className={`border-t border-neutral-100 cursor-pointer transition-all duration-300 ${
                      isDeleting ? "opacity-0" : "opacity-100"
                    } ${
                      isUnread ? "bg-red-50/40" : ""
                    } hover:bg-neutral-50`}
                  >
                    <td className="px-2 py-3 text-neutral-400">
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        isUnread ? "font-medium text-neutral-900" : "text-neutral-700"
                      }`}
                    >
                      {m.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{m.email}</td>
                    <td className="px-4 py-3 text-neutral-700">
                      {m.subject || "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                      {formatDate(m.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex gap-2">
                        {m.status !== "read" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStatus(m.id, "read")}
                            disabled={busy === m.id}
                          >
                            O&apos;qilgan
                          </Button>
                        )}
                        {m.status !== "replied" && (
                          <Button
                            size="sm"
                            onClick={() => setStatus(m.id, "replied")}
                            disabled={busy === m.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Javob berildi
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => remove(m.id)}
                          disabled={busy === m.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {isOpen && !isDeleting && (
                    <tr className="border-t border-neutral-100 bg-neutral-50/70">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                          Xabar
                        </div>
                        <p className="text-sm text-neutral-800 whitespace-pre-wrap">
                          {m.message}
                        </p>
                      </td>
                    </tr>
                  )}
                </FragmentRow>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md shadow-lg text-sm text-white ${
            toast.kind === "ok" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}

// Wraps two <tr> elements as a single child expression without adding DOM nodes
function FragmentRow({
  children,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  isUnread: boolean;
  isDeleting: boolean;
}) {
  return <>{children}</>;
}
