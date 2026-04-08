"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (resetError) {
        setError(
          resetError.message === "User not found"
            ? "Bu email ro'yxatdan o'tmagan"
            : resetError.message
        );
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-chinese text-[10rem] leading-none text-white/20 block">
              密
            </span>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold text-white mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Parolni tiklash
          </motion.h2>
          <motion.p
            className="text-white/70 mt-3 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Email manzilingizga havola yuboramiz
          </motion.p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kirish sahifasiga qaytish
          </Link>

          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="hanzi-display text-2xl text-primary">汉</span>
              <span className="text-xl font-bold">HanziUz</span>
            </Link>
            <h1 className="text-2xl font-bold">Parolni tiklash</h1>
            <p className="text-muted-foreground mt-1">
              Email manzilingizni kiriting va biz sizga parolni tiklash
              havolasini yuboramiz
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-600 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Email yuborildi!</span>
                </div>
                <p>
                  Pochtangizni tekshiring. Parolni tiklash havolasi{" "}
                  <strong>{email}</strong> manziliga yuborildi.
                </p>
                <p className="text-xs text-green-600/70">
                  Email kelmasa, spam papkasini tekshiring.
                </p>
              </div>
              <Link
                href="/login"
                className="block text-center text-sm text-primary hover:underline font-medium"
              >
                Kirish sahifasiga qaytish
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-medium mb-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    Elektron pochta
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sizning@email.uz"
                    required
                    className="rounded-xl h-11"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 text-base"
                >
                  {isLoading ? (
                    "Yuborilmoqda..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Havolani yuborish
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Parolingizni eslaysizmi?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Kirish
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
