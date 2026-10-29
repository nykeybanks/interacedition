"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type Device = "mobile" | "desktop";

export function PreviewPanel({ html, subject, preheader }: { html: string; subject: string; preheader: string }) {
  const [device, setDevice] = useState<Device>("mobile");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 rounded-md border border-border bg-void p-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Inbox preview</span>
        <span className="truncate text-sm font-semibold text-platinum">{subject}</span>
        <span className="truncate text-sm text-muted-foreground">{preheader}</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Render</span>
        <div role="radiogroup" aria-label="Preview device" className="flex gap-1 rounded-md border border-border bg-void p-1">
          {(
            [
              { id: "mobile", label: "Mobile", icon: Smartphone },
              { id: "desktop", label: "Desktop", icon: Monitor },
            ] as const
          ).map((option) => {
            const Icon = option.icon;
            const selected = option.id === device;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setDevice(option.id)}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-sm px-3 text-sm transition-colors transition-precise",
                  selected ? "bg-surface-elevated text-platinum ring-1 ring-accent/50" : "text-muted-foreground hover:text-platinum",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-void">
        <div className="no-scrollbar overflow-x-auto">
          <iframe
            title="Email preview"
            srcDoc={html}
            sandbox=""
            className="mx-auto block h-[720px] border-0 bg-void transition-[width] transition-precise"
            style={{ width: device === "mobile" ? "100%" : 680, maxWidth: device === "mobile" ? 390 : undefined }}
          />
        </div>
      </div>
    </div>
  );
}
