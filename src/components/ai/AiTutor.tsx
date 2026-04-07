"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChineseKeyboard from "./ChineseKeyboard";

interface Message {
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

export default function AiTutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text || input).trim();
      if (!content || isStreaming) return;

      setInput("");
      setError(null);

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
      };

      const assistantId = `asst-${Date.now()}`;
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      // Abort controller for timeout
      abortRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortRef.current?.abort(), 30000);

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
          throw new Error(
            errData.error || `Server xatosi: ${res.status}`
          );
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("Stream mavjud emas");

        const decoder = new TextDecoder();
        let buffer = "";
        let receivedText = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines
          while (buffer.includes("\n")) {
            const newlineIdx = buffer.indexOf("\n");
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line) continue;
            if (!line.startsWith("data: ")) continue;

            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                receivedText = true;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed.text }
                      : m
                  )
                );
              }
            } catch (e) {
              if (e instanceof Error && e.message !== "Stream xatosi") {
                // Skip malformed JSON, but rethrow known errors
                if (e.message.includes("xatosi") || e.message.includes("Server")) {
                  throw e;
                }
              }
            }
          }
        }

        // If we got no text at all, show error
        if (!receivedText) {
          throw new Error("Javob olinmadi. Qaytadan urinib ko'ring.");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("So'rov vaqti tugadi. Qaytadan urinib ko'ring.");
        } else {
          const msg =
            err instanceof Error ? err.message : "Noma'lum xatolik";
          setError(msg);
        }
        // Remove empty assistant message on error
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantId || m.content.length > 0)
        );
      } finally {
        clearTimeout(timeoutId);
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [input, isStreaming, messages]
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

  const clearChat = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setError(null);
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">AI Repetitor</h1>
            <p className="text-xs text-muted-foreground">
              Xitoy tili bo&apos;yicha savollar bering
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
            aria-label="Suhbatni tozalash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 rounded-2xl border bg-card overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  Xush kelibsiz!
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Men sizga xitoy tilini o&apos;rganishda yordam beraman.
                  Savol bering yoki quyidagi takliflardan birini tanlang.
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
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
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
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}

          {isStreaming && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pl-11">
              <Loader2 className="w-3 h-3 animate-spin" />
              AI yozmoqda...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="mt-3 shrink-0">
        <div className="flex items-end gap-2 p-2 rounded-2xl border bg-card">
          <ChineseKeyboard onInsert={insertChar} />
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Xitoy tili haqida savol bering..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground py-2 px-1 max-h-32"
            style={{
              height: "auto",
              minHeight: "36px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0",
              input.trim() && !isStreaming
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Yuborish"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
          AI xatolarga yo&apos;l qo&apos;yishi mumkin. Muhim ma&apos;lumotlarni tekshiring.
        </p>
      </div>
    </div>
  );
}
