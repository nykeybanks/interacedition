import { cn } from "@/lib/utils";

const tones = {
  Live: "border-success/40 text-success",
  Concept: "border-accent/40 text-accent",
  Planned: "border-border-strong text-muted-foreground",
  Ready: "border-success/40 text-success",
  Missing: "border-destructive/40 text-destructive",
  Warning: "border-warning/40 text-warning",
  Primary: "border-accent/40 text-accent",
  Fallback: "border-border-strong text-silver",
} as const;

export type StatusTone = keyof typeof tones;

export function StatusBadge({ tone, label, className }: { tone: StatusTone; label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-widest",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-current" />
      {label ?? tone}
    </span>
  );
}
