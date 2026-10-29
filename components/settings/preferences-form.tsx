"use client";

import { usePreferences, type MotionMode } from "@/components/providers/preferences-provider";
import { cn } from "@/lib/utils";

const motionModes: { id: MotionMode; label: string; description: string }[] = [
  { id: "immersive", label: "Immersive", description: "Fuller transitions up to 400ms." },
  { id: "balanced", label: "Balanced", description: "Default timing, 180–380ms." },
  { id: "reduced", label: "Reduced", description: "Near-instant state changes, no haptics." },
];

export function PreferencesForm() {
  const { motion, setMotion, haptics, setHaptics, pulse } = usePreferences();

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="motion-title" className="flex flex-col gap-4">
        <h2 id="motion-title" className="font-display text-xs uppercase tracking-widest text-platinum">
          Motion
        </h2>
        <div role="radiogroup" aria-labelledby="motion-title" className="flex flex-col gap-2">
          {motionModes.map((mode) => {
            const selected = mode.id === motion;
            return (
              <button
                key={mode.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setMotion(mode.id)}
                className={cn(
                  "flex min-h-16 items-center gap-4 rounded-md border p-4 text-left transition-colors transition-precise",
                  selected ? "border-accent/60 bg-surface-elevated" : "border-border hover:border-border-strong",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-accent" : "border-border-strong",
                  )}
                >
                  {selected && <span className="size-2.5 rounded-full bg-accent" />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-base font-medium text-platinum">{mode.label}</span>
                  <span className="text-sm text-muted-foreground">{mode.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="haptics-title" className="flex items-center justify-between gap-4 rounded-md border border-border p-4">
        <div className="flex flex-col gap-0.5">
          <h2 id="haptics-title" className="text-base font-medium text-platinum">
            Haptic feedback
          </h2>
          <p className="text-sm text-muted-foreground">Short vibration on navigation and send. Supported on Android browsers.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={haptics}
          aria-labelledby="haptics-title"
          onClick={() => {
            setHaptics(!haptics);
            if (!haptics) pulse(12);
          }}
          className={cn(
            "relative h-8 w-14 shrink-0 rounded-full border transition-colors transition-precise",
            haptics ? "border-accent bg-accent/20" : "border-border-strong bg-void",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1 size-5 rounded-full transition-transform transition-precise",
              haptics ? "translate-x-7 bg-accent" : "translate-x-1 bg-silver",
            )}
          />
        </button>
      </section>
    </div>
  );
}
