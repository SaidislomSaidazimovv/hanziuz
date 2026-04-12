import { createClient } from "@/lib/supabase";

export interface DbChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DbChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function getChatSessions(userId: string, limit = 20) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) console.error("getChatSessions error:", error);
  return (data as DbChatSession[]) || [];
}

export async function getChatMessages(sessionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at");
  if (error) console.error("getChatMessages error:", error);
  return (data as DbChatMessage[]) || [];
}

export async function createChatSession(userId: string, title = "Yangi suhbat") {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_chat_sessions")
    .insert({ user_id: userId, title })
    .select("*")
    .single();
  if (error) console.error("createChatSession error:", error);
  return data as DbChatSession | null;
}

export async function saveChatMessage(sessionId: string, role: string, content: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("ai_chat_messages")
    .insert({ session_id: sessionId, role, content });
  if (error) console.error("saveChatMessage error:", error);

  await supabase
    .from("ai_chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);
}

export async function updateChatSessionTitle(sessionId: string, title: string) {
  const supabase = createClient();
  await supabase
    .from("ai_chat_sessions")
    .update({ title })
    .eq("id", sessionId);
}

export async function deleteChatSession(sessionId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("ai_chat_sessions")
    .delete()
    .eq("id", sessionId);
  if (error) console.error("deleteChatSession error:", error);
}

export async function getTodayMessageCount(userId: string): Promise<number> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: sessions } = await supabase
    .from("ai_chat_sessions")
    .select("id")
    .eq("user_id", userId);

  if (!sessions || sessions.length === 0) return 0;

  const sessionIds = sessions.map((s: { id: string }) => s.id);
  const { count } = await supabase
    .from("ai_chat_messages")
    .select("id", { count: "exact", head: true })
    .in("session_id", sessionIds)
    .eq("role", "user")
    .gte("created_at", `${today}T00:00:00`);

  return count || 0;
}
