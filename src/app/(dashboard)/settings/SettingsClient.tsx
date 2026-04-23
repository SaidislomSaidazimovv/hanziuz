"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Settings,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Target,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/lib/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

export default function SettingsClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const userData = useUser();

  // Load user data from context
  useEffect(() => {
    if (userData.isLoaded) {
      setName(userData.name);
      setEmail(userData.email);
      setAvatarUrl(userData.avatarUrl);
      setIsLoading(false);
    }
  }, [userData.isLoaded, userData.name, userData.email, userData.avatarUrl]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      setError("Faqat rasm fayllari ruxsat etiladi");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Rasm hajmi 2MB dan oshmasligi kerak");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Foydalanuvchi topilmadi");

      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${user.id}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatara")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatara")
        .getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Rasm yuklashda xatolik"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          name: name,
        },
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Saqlashda xatolik"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email
      ? email[0].toUpperCase()
      : "U";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">Sozlamalar</h1>
        </div>
        <p className="text-muted-foreground">
          Profil ma&apos;lumotlarini boshqaring
        </p>
      </motion.div>

      {/* Success message */}
      {success && (
        <motion.div
          className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-600 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Muvaffaqiyatli saqlandi!
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Avatar section */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Profil rasmi</h2>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium">Rasmni o&apos;zgartirish</p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG yoki GIF. Maksimum 2MB.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-2 text-xs text-primary hover:underline font-medium"
            >
              {isUploading ? "Yuklanmoqda..." : "Rasm yuklash"}
            </button>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="font-semibold">Shaxsiy ma&apos;lumotlar</h2>

        <div>
          <label
            htmlFor="settings-name"
            className="flex items-center gap-2 text-sm font-medium mb-1.5"
          >
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            Ism
          </label>
          <Input
            id="settings-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ismingizni kiriting"
            className="rounded-xl h-11"
          />
        </div>

        <div>
          <label
            htmlFor="settings-email"
            className="flex items-center gap-2 text-sm font-medium mb-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            Email
          </label>
          <Input
            id="settings-email"
            type="email"
            value={email}
            disabled
            className="rounded-xl h-11 opacity-60"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Emailni o&apos;zgartirish hozircha mavjud emas
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saqlanmoqda...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Saqlash
            </>
          )}
        </Button>
      </div>

      {/* Daily goal */}
      <DailyGoalSection userId={userData.id} />

      {/* Password change */}
      <PasswordChangeSection />
    </div>
  );
}

const GOAL_PRESETS = [
  { value: 25, label: "Oson", hint: "~1 dars" },
  { value: 50, label: "Odatiy", hint: "~2 dars" },
  { value: 100, label: "Jiddiy", hint: "~4 dars" },
  { value: 150, label: "Ustivor", hint: "~6 dars" },
];

function DailyGoalSection({ userId }: { userId: string }) {
  const [goal, setGoal] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("daily_goal_xp")
        .eq("id", userId)
        .single();
      if (!cancelled) {
        setGoal(
          (data as { daily_goal_xp: number | null } | null)?.daily_goal_xp ?? 50
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function save(value: number) {
    if (value === goal) return;
    setError(null);
    setSaving(value);
    const prev = goal;
    setGoal(value); // optimistic
    try {
      const supabase = createClient();
      const { error: updErr } = await supabase
        .from("profiles")
        .update({ daily_goal_xp: value })
        .eq("id", userId);
      if (updErr) throw updErr;
    } catch {
      setGoal(prev);
      setError("Saqlab bo'lmadi");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <div>
        <h2 className="font-semibold flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Kunlik maqsad
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Har kuni qancha XP to&apos;plashni maqsad qilasiz?
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {GOAL_PRESETS.map((preset) => {
          const active = goal === preset.value;
          const isSaving = saving === preset.value;
          return (
            <button
              key={preset.value}
              onClick={() => save(preset.value)}
              disabled={saving !== null}
              className={`rounded-xl border p-3 text-left transition-colors ${
                active
                  ? "border-primary bg-primary/10"
                  : "bg-card hover:bg-secondary/50"
              } ${saving !== null && !isSaving ? "opacity-40" : ""}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">{preset.value} XP</p>
                {isSaving && (
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {preset.label}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {preset.hint}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PasswordChangeSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!currentPassword) return "Joriy parolni kiriting";
    if (newPassword.length < 8) return "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak";
    if (newPassword !== confirmPassword) return "Yangi parollar mos kelmaydi";
    if (currentPassword === newPassword) return "Yangi parol joriy paroldan farqli bo'lishi kerak";
    return null;
  };

  const handleChangePassword = async () => {
    const validationError = validate();
    if (validationError) {
      setPwError(validationError);
      return;
    }

    setIsChanging(true);
    setPwError(null);
    setPwSuccess(false);

    try {
      const supabase = createClient();

      // Verify current password by re-authenticating
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Foydalanuvchi topilmadi");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        setPwError("Joriy parol noto'g'ri");
        setIsChanging(false);
        return;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPwError(updateError.message);
        setIsChanging(false);
        return;
      }

      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSuccess(false), 5000);
    } catch (err) {
      setPwError(
        err instanceof Error ? err.message : "Parolni o'zgartirishda xatolik"
      );
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <h2 className="font-semibold flex items-center gap-2">
        <Lock className="w-4 h-4 text-muted-foreground" />
        Parolni o&apos;zgartirish
      </h2>

      {pwSuccess && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Parol muvaffaqiyatli o&apos;zgartirildi
        </div>
      )}

      {pwError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
          {pwError}
        </div>
      )}

      <div>
        <label htmlFor="current-pw" className="block text-sm font-medium mb-1.5">
          Joriy parol
        </label>
        <div className="relative">
          <Input
            id="current-pw"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => { setCurrentPassword(e.target.value); setPwError(null); }}
            placeholder="Joriy parolingiz"
            className="rounded-xl h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="new-pw" className="block text-sm font-medium mb-1.5">
          Yangi parol
        </label>
        <div className="relative">
          <Input
            id="new-pw"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setPwError(null); }}
            placeholder="Kamida 8 ta belgi"
            className="rounded-xl h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {newPassword.length > 0 && newPassword.length < 8 && (
          <p className="text-[11px] text-red-500 mt-1">Kamida 8 ta belgi kerak</p>
        )}
      </div>

      <div>
        <label htmlFor="confirm-pw" className="block text-sm font-medium mb-1.5">
          Yangi parolni tasdiqlang
        </label>
        <div className="relative">
          <Input
            id="confirm-pw"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setPwError(null); }}
            placeholder="Yangi parolni qaytadan kiriting"
            className="rounded-xl h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirmPassword.length > 0 && newPassword !== confirmPassword && (
          <p className="text-[11px] text-red-500 mt-1">Parollar mos kelmaydi</p>
        )}
      </div>

      <Button
        onClick={handleChangePassword}
        disabled={isChanging}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
      >
        {isChanging ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            O&apos;zgartirilmoqda...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Parolni yangilash
          </>
        )}
      </Button>
    </div>
  );
}
