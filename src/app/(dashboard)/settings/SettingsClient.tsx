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
    </div>
  );
}
