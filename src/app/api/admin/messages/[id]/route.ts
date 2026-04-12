import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/admin-auth";

const VALID_STATUSES = new Set(["new", "read", "replied"]);

async function requireAdmin() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminCookie(cookie);
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAdmin())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const { status } = await request.json();

    if (!VALID_STATUSES.has(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const { error } = await adminClient()
      .from("contact_messages")
      .update({ status })
      .eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAdmin())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const { error } = await adminClient()
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
