"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  isLoaded: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserData>({
  id: "",
  name: "",
  email: "",
  avatarUrl: "",
  initials: "U",
  isPremium: false,
  premiumExpiresAt: null,
  isLoaded: false,
  refetch: () => {},
});

function computeInitials(name: string, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email ? email[0].toUpperCase() : "U";
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<UserData, "refetch">>({
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
    initials: "U",
    isPremium: false,
    premiumExpiresAt: null,
    isLoaded: false,
  });

  const fetchUser = useCallback(async () => {
    const supabase = createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setUser((prev) => ({ ...prev, isLoaded: true }));
      return;
    }

    const meta = session.user.user_metadata;
    const name = meta?.full_name || meta?.name || "";
    const email = session.user.email || "";
    const avatarUrl = meta?.avatar_url || meta?.picture || "";

    // Fetch premium status from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, premium_expires_at")
      .eq("id", session.user.id)
      .single();

    const isPremium =
      profile?.is_premium === true &&
      profile?.premium_expires_at != null &&
      new Date(profile.premium_expires_at) > new Date();

    setUser({
      id: session.user.id,
      name,
      email,
      avatarUrl,
      initials: computeInitials(name, email),
      isPremium,
      premiumExpiresAt: profile?.premium_expires_at || null,
      isLoaded: true,
    });
  }, []);

  const lastFetchRef = useRef<number | null>(null);

  useEffect(() => {
    lastFetchRef.current = Date.now();
    fetchUser();
  }, [fetchUser]);

  // Refetch on window focus — debounced to at most once per 60s
  // (catches premium changes from other tabs/admin without hammering on alt-tab)
  useEffect(() => {
    const handleFocus = () => {
      if (!user.id) return;
      const now = Date.now();
      if (lastFetchRef.current !== null && now - lastFetchRef.current < 60_000)
        return;
      lastFetchRef.current = now;
      fetchUser();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user.id, fetchUser]);

  const value: UserData = { ...user, refetch: fetchUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
