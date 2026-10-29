"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type MotionMode = "immersive" | "balanced" | "reduced";

type Preferences = {
  motion: MotionMode;
  haptics: boolean;
  setMotion: (mode: MotionMode) => void;
  setHaptics: (enabled: boolean) => void;
  pulse: (pattern?: number | number[]) => void;
};

const STORAGE_KEY = "qyx-interact-preferences";

const PreferencesContext = createContext<Preferences | null>(null);

function readStored(): { motion: MotionMode; haptics: boolean } {
  if (typeof window === "undefined") return { motion: "balanced", haptics: true };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    const motion: MotionMode = ["immersive", "balanced", "reduced"].includes(parsed.motion) ? parsed.motion : "balanced";
    return { motion, haptics: parsed.haptics !== false };
  } catch {
    return { motion: "balanced", haptics: true };
  }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [motion, setMotionState] = useState<MotionMode>("balanced");
  const [haptics, setHapticsState] = useState(true);

  useEffect(() => {
    const stored = readStored();
    setMotionState(stored.motion);
    setHapticsState(stored.haptics);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motion;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ motion, haptics }));
  }, [motion, haptics]);

  const pulse = useCallback(
    (pattern: number | number[] = 8) => {
      if (!haptics || motion === "reduced") return;
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
    },
    [haptics, motion],
  );

  const value = useMemo<Preferences>(
    () => ({ motion, haptics, setMotion: setMotionState, setHaptics: setHapticsState, pulse }),
    [motion, haptics, pulse],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used inside PreferencesProvider");
  return context;
}
