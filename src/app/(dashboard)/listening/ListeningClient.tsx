"use client";

import { useCallback, useState } from "react";
import ListeningEntry from "./ListeningEntry";
import ListeningSession from "./ListeningSession";
import {
  getListeningClipsForSession,
  type ListeningClip,
  type ListeningMode,
} from "@/lib/db/listening";

type Screen = "entry" | "loading" | "session" | "empty";

export interface UserListeningProgress {
  attemptedClips: number;
  totalAttempts: number;
  totalCorrect: number;
  accuracyPct: number;
}

export default function ListeningClient({
  totalClips,
  clipsPerLevel,
  userProgress,
}: {
  totalClips: number;
  clipsPerLevel: Record<number, number>;
  userProgress: UserListeningProgress;
}) {
  const [screen, setScreen] = useState<Screen>("entry");
  const [clips, setClips] = useState<ListeningClip[]>([]);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [activeMode, setActiveMode] = useState<ListeningMode>("word");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const start = useCallback(async (hskLevel: number, mode: ListeningMode) => {
    setErrorMsg(null);
    setActiveLevel(hskLevel);
    setActiveMode(mode);
    setScreen("loading");
    try {
      const fetched = await getListeningClipsForSession(hskLevel, 100);
      // For tone mode, restrict to single-character clips so questions test
      // a single syllable's tone, not a compound.
      const pool =
        mode === "tone"
          ? fetched.filter((c) => [...c.transcript_zh].length === 1)
          : fetched;
      if (pool.length < 4) {
        setScreen("empty");
        return;
      }
      setClips(pool);
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
        mode={activeMode}
        onExit={backToEntry}
      />
    );
  }

  if (screen === "empty") {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-3">
        <p className="text-muted-foreground">
          {activeMode === "tone"
            ? `HSK ${activeLevel} uchun bir bo'g'inli audio kartochkalar yetarli emas.`
            : `HSK ${activeLevel} uchun audio kartochkalar topilmadi.`}
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
      userProgress={userProgress}
      onStart={start}
      errorMsg={errorMsg}
    />
  );
}
