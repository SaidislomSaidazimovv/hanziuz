import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/admin-auth";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin — HanziUz",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const ok = await isValidAdminCookie(cookie);

  if (!ok) {
    // Login page uses its own standalone layout via route segment check below
    // but layout.tsx wraps it too — so render children bare for /admin/login.
    // Middleware also guards this, belt-and-braces.
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-white text-neutral-900">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
