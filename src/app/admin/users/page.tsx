import { createClient } from "@supabase/supabase-js";
import UsersClient, { type AdminUser } from "./UsersClient";

export const dynamic = "force-dynamic";

async function loadUsers(): Promise<AdminUser[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const perPage = 1000;
  let page = 1;
  const authUsers: {
    id: string;
    email?: string;
    created_at?: string;
    user_metadata?: Record<string, unknown>;
  }[] = [];

  // Paginate through all auth users (cap at ~10k to be safe)
  for (let i = 0; i < 10; i++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error || !data?.users?.length) break;
    authUsers.push(...data.users);
    if (data.users.length < perPage) break;
    page++;
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, is_premium, premium_expires_at");

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      p.id as string,
      p as {
        id: string;
        name: string | null;
        avatar_url: string | null;
        is_premium: boolean;
        premium_expires_at: string | null;
      },
    ])
  );

  return authUsers
    .map((u) => {
      const p = profileMap.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "",
        name:
          p?.name ??
          (u.user_metadata?.full_name as string | undefined) ??
          null,
        avatar_url: p?.avatar_url ?? null,
        created_at: u.created_at ?? "",
        is_premium: p?.is_premium ?? false,
        premium_expires_at: p?.premium_expires_at ?? null,
      };
    })
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
}

export default async function AdminUsersPage() {
  const users = await loadUsers();
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Foydalanuvchilar</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Jami: {users.length.toLocaleString("uz-UZ")} ta foydalanuvchi
        </p>
      </header>
      <UsersClient initialUsers={users} />
    </div>
  );
}
