"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

interface UserData {
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
}

const UserContext = createContext<UserData>({
  name: "",
  email: "",
  avatarUrl: "",
  initials: "U",
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData>({
    name: "",
    email: "",
    avatarUrl: "",
    initials: "U",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        const meta = authUser.user_metadata;
        const name = meta?.full_name || meta?.name || "";
        const email = authUser.email || "";
        const avatarUrl = meta?.avatar_url || meta?.picture || "";

        const initials = name
          ? name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : email
            ? email[0].toUpperCase()
            : "U";

        setUser({ name, email, avatarUrl, initials });
      }
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
