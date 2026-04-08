"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    });
    if (error) {
      setError("Google orqali kirish amalga oshmadi");
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      const msg = signInError.message;
      const errorMap: Record<string, string> = {
        "Invalid login credentials": "Email yoki parol noto'g'ri",
        "Email not confirmed": "Email tasdiqlanmagan. Pochta qutingizni tekshiring yoki qayta ro'yxatdan o'ting.",
        "Invalid email or password": "Email yoki parol noto'g'ri",
        "Too many requests": "Juda ko'p urinish. Biroz kutib, qaytadan urinib ko'ring.",
        "User not found": "Bu email bilan foydalanuvchi topilmadi",
      };
      setError(errorMap[msg] || msg);
      setIsLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
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
              汉
            </span>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold text-white mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Xush kelibsiz!
          </motion.h2>
          <motion.p
            className="text-white/70 mt-3 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            O&apos;rganishni davom ettiring
          </motion.p>
        </div>
        {["学", "习", "好", "的"].map((char, i) => (
          <motion.span
            key={char}
            className="absolute font-chinese text-6xl text-white/[0.06]"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        ))}
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
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Bosh sahifa
          </Link>

          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="hanzi-display text-2xl text-primary">汉</span>
              <span className="text-xl font-bold">HanziUz</span>
            </Link>
            <h1 className="text-2xl font-bold">Kirish</h1>
            <p className="text-muted-foreground mt-1">
              Hisobingizga kiring va o&apos;rganishni davom ettiring
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
              >
                Elektron pochta
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="sizning@email.uz"
                required
                className="rounded-xl h-11"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
              >
                Parol
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parolingizni kiriting"
                  required
                  className="rounded-xl h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Parolni ko'rsatish"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Parolni unutdingizmi?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 text-base"
            >
              {isLoading ? "Kirish..." : "Kirish"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">
                yoki
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border bg-card hover:bg-secondary text-sm font-medium transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isGoogleLoading ? "Yuklanmoqda..." : "Google orqali kirish"}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Hisobingiz yo&apos;qmi?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
