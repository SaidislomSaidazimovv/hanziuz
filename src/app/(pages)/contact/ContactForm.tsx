"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errors.name = "Ism kamida 2 ta harf bo'lishi kerak";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email noto'g'ri formatda";
    if (!message.trim() || message.trim().length < 10) errors.message = "Xabar kamida 10 ta harf bo'lishi kerak";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || null,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
        return;
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setFieldErrors({});
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Serverga ulanib bo'lmadi. Qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-semibold mb-6">Xabar yuborish</h2>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Xabaringiz yuborildi! Tez orada javob beramiz.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
            Ismingiz
          </label>
          <Input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: "" })); }}
            placeholder="Ismingizni kiriting"
            className="rounded-xl h-11"
          />
          {fieldErrors.name && (
            <p className="text-[11px] text-red-500 mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
            placeholder="sizning@email.uz"
            className="rounded-xl h-11"
          />
          {fieldErrors.email && (
            <p className="text-[11px] text-red-500 mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium mb-1.5">
            Mavzu <span className="text-muted-foreground">(ixtiyoriy)</span>
          </label>
          <Input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Xabar mavzusi"
            className="rounded-xl h-11"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5">
            Xabar
          </label>
          <textarea
            id="contact-message"
            rows={4}
            value={message}
            onChange={(e) => { setMessage(e.target.value); setFieldErrors((p) => ({ ...p, message: "" })); }}
            placeholder="Xabaringizni yozing..."
            className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 resize-none"
          />
          {fieldErrors.message && (
            <p className="text-[11px] text-red-500 mt-1">{fieldErrors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Yuborilmoqda...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Yuborish
            </>
          )}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          Biz 24 soat ichida javob beramiz
        </p>
      </form>
    </div>
  );
}
