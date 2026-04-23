"use client";

import { useCallback, useState } from "react";
import ListeningEntry from "./ListeningEntry";
import ListeningSession from "./ListeningSession";
import {
  getListeningClipsForSession,
  type ListeningClip,
} from "@/lib/db/listening";

type Screen = "entry" | "loading" | "session" | "empty";

export default function ListeningClient({
  totalClips,
  clipsPerLevel,
}: {
  totalClips: number;
  clipsPerLevel: Record<number, number>;
}) {
  const [screen, setScreen] = useState<Screen>("entry");
  const [clips, setClips] = useState<ListeningClip[]>([]);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const start = useCallback(async (hskLevel: number) => {
    setErrorMsg(null);
    setActiveLevel(hskLevel);
    setScreen("loading");
    try {
      const fetched = await getListeningClipsForSession(hskLevel, 50);
      if (fetched.length === 0) {
        setScreen("empty");
        return;
      }
      setClips(fetched);
      setScreen("session");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Yuklab bo'lmadi");
      setScreen("entry");
    }
  }, []);

  const backToEntry = useCallback(() => setScreen("entry"), []);

  if (screen === "loading") {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        Yuklanmoqda...
      </div>
    );
  }

  if (screen === "session") {
    return (
      <ListeningSession
        clips={clips}
        hskLevel={activeLevel}
        onExit={backToEntry}
      />
    );
  }

  if (screen === "empty") {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-3">
        <p className="text-muted-foreground">
          HSK {activeLevel} uchun audio kartochkalar topilmadi.
        </p>
        <button
          onClick={backToEntry}
          className="text-sm text-primary hover:underline"
        >
          ← Ortga
        </button>
      </div>
    );
  }

  return (
    <ListeningEntry
      totalClips={totalClips}
      clipsPerLevel={clipsPerLevel}
      onStart={start}
      errorMsg={errorMsg}
    />
  );
}
