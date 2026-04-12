"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_premium: boolean;
  premium_expires_at: string | null;
};

const PAGE_SIZE = 20;
const DURATIONS = [1, 3, 6, 12];

function initials(name: string | null, email: string) {
  const src = (name ?? email ?? "?").trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}

function colorFor(id: string) {
  const palette = [
    "#DC2626",
    "#2563EB",
    "#059669",
    "#D97706",
    "#7C3AED",
    "#DB2777",
    "#0891B2",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UsersClient({
  initialUsers,
}: {
  initialUsers: AdminUser[];
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalUser, setModalUser] = useState<AdminUser | null>(null);
  const [months, setMonths] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name ?? "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const visible = filtered.slice(
    (pageClamped - 1) * PAGE_SIZE,
    pageClamped * PAGE_SIZE
  );

  function showToast(kind: "ok" | "err", text: string) {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 3000);
  }

  async function grantPremium() {
    if (!modalUser) return;
    setBusy(modalUser.id);
    try {
      const res = await fetch("/api/admin/set-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: modalUser.id, months }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("err", data.error || "Xatolik");
        setBusy(null);
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === modalUser.id
            ? {
                ...u,
                is_premium: true,
                premium_expires_at: data.premium_expires_at,
              }
            : u
        )
      );
      showToast("ok", "Premium berildi");
      setModalUser(null);
    } catch {
      showToast("err", "Tarmoq xatosi");
    } finally {
      setBusy(null);
    }
  }

  async function removePremium(u: AdminUser) {
    if (!confirm(`${u.name ?? u.email} dan premiumni olib qo'yasizmi?`)) return;
    setBusy(u.id);
    try {
      const res = await fetch("/api/admin/remove-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("err", data.error || "Xatolik");
        return;
      }
      setUsers((prev) =>
        prev.map((x) =>
          x.id === u.id
            ? { ...x, is_premium: false, premium_expires_at: null }
            : x
        )
      );
      showToast("ok", "Premium olib qo'yildi");
    } catch {
      showToast("err", "Tarmoq xatosi");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="Ism yoki email bo'yicha qidirish..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <div className="text-sm text-neutral-500">
          {filtered.length.toLocaleString("uz-UZ")} natija
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium w-12"></th>
              <th className="text-left px-4 py-3 font-medium">Ism</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">
                Ro'yxatdan o'tgan
              </th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Muddati</th>
              <th className="text-right px-4 py-3 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  Foydalanuvchilar topilmadi
                </td>
              </tr>
            )}
            {visible.map((u) => (
              <tr
                key={u.id}
                className="border-t border-neutral-100 hover:bg-neutral-50"
              >
                <td className="px-4 py-3">
                  {u.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.avatar_url}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: colorFor(u.id) }}
                    >
                      {initials(u.name, u.email)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-900">
                  {u.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {formatDate(u.created_at)}
                </td>
                <td className="px-4 py-3">
                  {u.is_premium ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5 font-medium">
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 font-medium">
                      Bepul
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {u.is_premium ? formatDate(u.premium_expires_at) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setMonths(1);
                        setModalUser(u);
                      }}
                      disabled={busy === u.id}
                      className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                    >
                      Premium ber
                    </Button>
                    {u.is_premium && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removePremium(u)}
                        disabled={busy === u.id}
                      >
                        Olib qo&apos;y
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          Sahifa {pageClamped} / {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageClamped <= 1}
          >
            Oldingi
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={pageClamped >= totalPages}
          >
            Keyingi
          </Button>
        </div>
      </div>

      {modalUser && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => !busy && setModalUser(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-1">Premium berish</h2>
            <p className="text-sm text-neutral-600 mb-4">
              {modalUser.name ?? modalUser.email}
            </p>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Muddati
            </label>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {DURATIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`py-2 rounded-md text-sm font-medium border transition-colors ${
                    months === m
                      ? "bg-[#DC2626] text-white border-[#DC2626]"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {m} oy
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setModalUser(null)}
                disabled={!!busy}
              >
                Bekor qilish
              </Button>
              <Button
                onClick={grantPremium}
                disabled={!!busy}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
              >
                {busy ? "Yuborilmoqda..." : "Tasdiqlash"}
              </Button>
            </div>
          </div>
        </div>
      )}

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
