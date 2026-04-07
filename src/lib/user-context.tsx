"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
  isLoaded: boolean;
}

const UserContext = createContext<UserData>({
  id: "",
  name: "",
  email: "",
  avatarUrl: "",
  initials: "U",
  isLoaded: false,
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
  const [user, setUser] = useState<UserData>({
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
    initials: "U",
    isLoaded: false,
  });

  useEffect(() => {
    const supabase = createClient();

    // Step 1: Read session from cookie (instant, no network)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        const name = meta?.full_name || meta?.name || "";
        const email = session.user.email || "";
        const avatarUrl = meta?.avatar_url || meta?.picture || "";

        setUser({
          id: session.user.id,
          name,
          email,
          avatarUrl,
          initials: computeInitials(name, email),
          isLoaded: true,
        });
      } else {
        setUser((prev) => ({ ...prev, isLoaded: true }));
      }
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
