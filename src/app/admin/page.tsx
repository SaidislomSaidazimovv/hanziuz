import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type RecentUser = {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  is_premium: boolean;
};

async function loadStats() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  const [
    totalUsersRes,
    premiumUsersRes,
    unreadMessagesRes,
    authListRes,
    profilesForRecentRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_premium", true),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.auth.admin.listUsers({ page: 1, perPage: 100 }),
    supabase.from("profiles").select("id, name, is_premium"),
  ]);

  const totalUsers = totalUsersRes.count ?? 0;
  const premiumUsers = premiumUsersRes.count ?? 0;
  const unreadMessages = unreadMessagesRes.count ?? 0;

  const authUsers = authListRes.data?.users ?? [];
  const todaySignups = authUsers.filter(
    (u) => u.created_at && u.created_at >= todayIso
  ).length;

  const profileMap = new Map(
    (profilesForRecentRes.data ?? []).map((p) => [
      p.id as string,
      p as { id: string; name: string | null; is_premium: boolean },
    ])
  );

  const recent: RecentUser[] = authUsers
    .slice()
    .sort((a, b) =>
      (b.created_at ?? "").localeCompare(a.created_at ?? "")
    )
    .slice(0, 10)
    .map((u) => {
      const p = profileMap.get(u.id);
      return {
        id: u.id,
        name: p?.name ?? (u.user_metadata?.full_name as string) ?? null,
        email: u.email ?? "",
        created_at: u.created_at ?? "",
        is_premium: p?.is_premium ?? false,
      };
    });

  return { totalUsers, premiumUsers, todaySignups, unreadMessages, recent };
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminStatsPage() {
  const { totalUsers, premiumUsers, todaySignups, unreadMessages, recent } =
    await loadStats();

  const metrics = [
    { label: "Jami foydalanuvchilar", value: totalUsers },
    { label: "Premium foydalanuvchilar", value: premiumUsers },
    { label: "Bugungi ro'yxatdan o'tganlar", value: todaySignups },
    { label: "O'qilmagan xabarlar", value: unreadMessages },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Statistika</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-neutral-200 bg-white p-5"
          >
            <div className="text-sm text-neutral-500">{m.label}</div>
            <div className="mt-2 text-3xl font-semibold text-neutral-900">
              {m.value.toLocaleString("uz-UZ")}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          So'nggi ro'yxatdan o'tganlar
        </h2>
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Ism</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">
                  Ro'yxatdan o'tgan
                </th>
                <th className="text-left px-4 py-3 font-medium">Premium</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-neutral-500"
                  >
                    Foydalanuvchilar topilmadi
                  </td>
                </tr>
              )}
              {recent.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-neutral-100 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3">{u.name ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {u.is_premium ? (
                      <span className="inline-flex items-center rounded-full bg-[#DC2626] text-white text-xs px-2 py-0.5">
                        Premium
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-xs">Bepul</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
