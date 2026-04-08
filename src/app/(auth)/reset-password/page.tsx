"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Parollar mos kelmaydi");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        const msg = updateError.message;
        const errorMap: Record<string, string> = {
          "New password should be different from the old password":
            "Yangi parol eski paroldan farqli bo'lishi kerak",
          "Password should be at least 6 characters":
            "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
          "Auth session missing":
            "Seans tugagan. Iltimos, parolni tiklash havolasini qayta so'rang.",
        };
        setError(errorMap[msg] || msg);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
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
              新
            </span>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold text-white mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Yangi parol
          </motion.h2>
          <motion.p
            className="text-white/70 mt-3 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Yangi parolni kiriting va o&apos;rganishni davom ettiring
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
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="hanzi-display text-2xl text-primary">汉</span>
              <span className="text-xl font-bold">HanziUz</span>
            </Link>
            <h1 className="text-2xl font-bold">Yangi parol o&apos;rnatish</h1>
            <p className="text-muted-foreground mt-1">
              Yangi parolingizni kiriting
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-600">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">
                    Parol muvaffaqiyatli o&apos;zgartirildi!
                  </span>
                </div>
                <p>Boshqaruv paneliga yo&apos;naltirilmoqdasiz...</p>
              </div>
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
                    htmlFor="new-password"
                    className="flex items-center gap-2 text-sm font-medium mb-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    Yangi parol
                  </label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Kamida 8 ta belgi"
                      required
                      minLength={8}
                      className="rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {newPassword.length > 0 && newPassword.length < 8 && (
                    <p className="text-[11px] text-red-500 mt-1">
                      Kamida 8 ta belgi kerak
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="flex items-center gap-2 text-sm font-medium mb-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    Parolni tasdiqlang
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Yangi parolni qaytadan kiriting"
                      required
                      className="rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword.length > 0 &&
                    newPassword !== confirmPassword && (
                      <p className="text-[11px] text-red-500 mt-1">
                        Parollar mos kelmaydi
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 text-base"
                >
                  {isLoading ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
