"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Sparkles,
  Plus,
  MessageSquare,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import {
  getChatSessions,
  getChatMessages,
  createChatSession,
  saveChatMessage,
  updateChatSessionTitle,
  deleteChatSession,
  getTodayMessageCount,
  getProfile,
  type DbChatSession,
  type DbChatMessage,
} from "@/lib/db";
import { isPremiumActive } from "@/lib/premium";
import PremiumModal from "@/components/premium/PremiumModal";
import ChineseKeyboard from "./ChineseKeyboard";

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Menga o'zingizni xitoycha tanishtiring",
  "你好 so'zini tushuntiring",
  "HSK 1 grammatikasini o'rgating",
  "Xitoycha sanashni o'rgating",
  "吃 va 喝 farqi nima?",
];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Bugun";
  if (diffDays === 1) return "Kecha";
  if (diffDays < 7) return `${diffDays} kun oldin`;
  return `${Math.floor(diffDays / 7)} hafta oldin`;
}

export default function AiTutor() {
  const { id: userId } = useUser();

  // Sessions
  const [sessions, setSessions] = useState<DbChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Messages
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [dailyCount, setDailyCount] = useState(0);
  const [premium, setPremium] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const FREE_DAILY_LIMIT = 10;
  const isLimited = !premium && dailyCount >= FREE_DAILY_LIMIT;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load sessions + check premium + daily limit
  useEffect(() => {
    if (!userId) return;
    Promise.all([
      getChatSessions(userId),
      getProfile(userId),
      getTodayMessageCount(userId),
    ]).then(([data, profile, count]) => {
      setSessions(data);
      setPremium(isPremiumActive(profile));
      setDailyCount(count);
      if (data.length > 0) {
        loadSession(data[0].id);
      }
      setLoadingSessions(false);
    });
  }, [userId]);

  const loadSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    const msgs = await getChatMessages(sessionId);
    setMessages(
      msgs.map((m: DbChatMessage) => ({
        id: m.id,
        role: m.role,
        content: m.content,
      }))
    );
    setError(null);
    setSidebarOpen(false);
  };

  const handleNewChat = async () => {
    if (!userId) return;
    const session = await createChatSession(userId);
    if (session) {
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setMessages([]);
      setError(null);
      setSidebarOpen(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteChatSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter((s) => s.id !== sessionId);
      if (remaining.length > 0) {
        loadSession(remaining[0].id);
      } else {
        setActiveSessionId(null);
        setMessages([]);
      }
    }
  };

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text || input).trim();
      if (!content || isStreaming || !userId) return;

      setInput("");
      setError(null);

      // Create session if none active
      let sessionId = activeSessionId;
      if (!sessionId) {
        const session = await createChatSession(userId);
        if (!session) return;
        sessionId = session.id;
        setActiveSessionId(sessionId);
        setSessions((prev) => [session, ...prev]);
      }

      const userMsg: LocalMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
      };
      const assistantId = `asst-${Date.now()}`;
      const assistantMsg: LocalMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      // Save user message to DB
      saveChatMessage(sessionId, "user", content);
      setDailyCount((c) => c + 1);

      // Update title from first message
      const currentSession = sessions.find((s) => s.id === sessionId);
      if (currentSession?.title === "Yangi suhbat") {
        const newTitle = content.slice(0, 30) + (content.length > 30 ? "..." : "");
        updateChatSessionTitle(sessionId, newTitle);
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
        );
      }

      abortRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortRef.current?.abort(), 30000);

      let fullResponse = "";

      try {
        const apiMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/ai-tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, hskLevel: 1 }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server xatosi: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("Stream mavjud emas");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          while (buffer.includes("\n")) {
            const newlineIdx = buffer.indexOf("\n");
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line || !line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullResponse += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed.text }
                      : m
                  )
                );
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Save assistant response to DB
        if (fullResponse) {
          saveChatMessage(sessionId, "assistant", fullResponse);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("So'rov vaqti tugadi. Qaytadan urinib ko'ring.");
        } else {
          setError(err instanceof Error ? err.message : "Noma'lum xatolik");
        }
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantId || m.content.length > 0)
        );
      } finally {
        clearTimeout(timeoutId);
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [input, isStreaming, messages, userId, activeSessionId, sessions]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const insertChar = (char: string) => {
    setInput((prev) => prev + char);
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-5xl mx-auto gap-0">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l flex flex-col"
              initial={{ x: 288 }}
              animate={{ x: 0 }}
              exit={{ x: 288 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between p-3 border-b">
                <span className="text-sm font-semibold">Suhbatlar tarixi</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ChatSidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                loading={loadingSessions}
                onNewChat={handleNewChat}
                onSelectSession={loadSession}
                onDeleteSession={handleDeleteSession}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <Bot className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-sm font-bold">AI Repetitor</h1>
              <p className="text-[10px] text-muted-foreground">
                Xitoy tili bo&apos;yicha savollar bering
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Xush kelibsiz!</h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Men sizga xitoy tilini o&apos;rganishda yordam beraman.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="px-3 py-2 text-xs rounded-xl border bg-secondary hover:bg-secondary/80 hover:border-primary/30 transition-all text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  )}
                >
                  {msg.content || (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isStreaming && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pl-10">
                <Loader2 className="w-3 h-3 animate-spin" />
                AI yozmoqda...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Daily limit warning */}
        {isLimited && (
          <div className="mx-4 mb-2 p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm text-center space-y-2">
            <p className="text-accent font-medium">
              Kunlik {FREE_DAILY_LIMIT} ta savol limitiga yetdingiz
            </p>
            <p className="text-xs text-muted-foreground">
              Premium bilan cheksiz foydalaning
            </p>
            <button
              onClick={() => setPremiumModalOpen(true)}
              className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Premium olish
            </button>
          </div>
        )}

        {/* Input */}
        <div className="p-3 shrink-0 border-t">
          <div className="flex items-end gap-2 p-2 rounded-2xl border bg-card">
            <ChineseKeyboard onInsert={insertChar} />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLimited ? "Kunlik limit tugadi..." : "Xitoy tili haqida savol bering..."}
              rows={1}
              disabled={isLimited}
              className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground py-2 px-1 max-h-32 disabled:opacity-50"
              style={{ height: "auto", minHeight: "36px" }}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming || isLimited}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0",
                input.trim() && !isStreaming && !isLimited
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1.5">
            {isLimited
              ? `${dailyCount}/${FREE_DAILY_LIMIT} savol ishlatildi`
              : `AI xatolarga yo'l qo'yishi mumkin. ${dailyCount}/${FREE_DAILY_LIMIT} savol.`}
          </p>
        </div>

        <PremiumModal isOpen={premiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
      </div>

      {/* Desktop sidebar — right side */}
      <div className="hidden md:flex flex-col w-64 shrink-0 border-l bg-card/50 rounded-r-2xl overflow-hidden">
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          loading={loadingSessions}
          onNewChat={handleNewChat}
          onSelectSession={loadSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>
    </div>
  );
}

function ChatSidebar({
  sessions,
  activeSessionId,
  loading,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: {
  sessions: DbChatSession[];
  activeSessionId: string | null;
  loading: boolean;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  return (
    <>
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi suhbat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Hali suhbatlar yo&apos;q</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const isDeleting = deleteConfirm === session.id;

            return (
              <div key={session.id} className="relative group">
                {isDeleting ? (
                  <div className="flex items-center gap-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-[10px] text-red-500 flex-1">O&apos;chirasizmi?</p>
                    <button
                      onClick={() => { onDeleteSession(session.id); setDeleteConfirm(null); }}
                      className="px-2 py-1 text-[10px] bg-red-500 text-white rounded-lg"
                    >
                      Ha
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 text-[10px] bg-secondary rounded-lg"
                    >
                      Yo&apos;q
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all",
                      isActive
                        ? "bg-primary/10 border-l-2 border-l-primary"
                        : "hover:bg-secondary"
                    )}
                  >
                    <p className="truncate text-xs font-medium">{session.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {timeAgo(session.updated_at)}
                    </p>
                  </button>
                )}
                {!isDeleting && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(session.id); }}
                    className="absolute right-2 top-2.5 w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-500" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
