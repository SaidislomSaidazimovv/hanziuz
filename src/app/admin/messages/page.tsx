import { createClient } from "@supabase/supabase-js";
import MessagesClient, { type AdminMessage } from "./MessagesClient";

export const dynamic = "force-dynamic";

async function loadMessages(): Promise<AdminMessage[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as AdminMessage[]) ?? [];
}

export default async function AdminMessagesPage() {
  const messages = await loadMessages();
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Xabarlar</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Jami: {messages.length.toLocaleString("uz-UZ")} ta xabar
        </p>
      </header>
      <MessagesClient initialMessages={messages} />
    </div>
  );
}
