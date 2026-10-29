"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import type { EmailFields } from "@/lib/email/templates";
import type { MergeValues } from "@/lib/email/render";
import { usePreferences } from "@/components/providers/preferences-provider";
import { TextField } from "./field";
import { cn } from "@/lib/utils";

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; provider: string; id: string | null; to: string[] }
  | { kind: "error"; message: string };

type LogEntry = { at: string; subject: string; to: string[]; provider: string };

export function SendPanel({
  fields,
  merge,
  gridReady,
  primaryProvider,
}: {
  fields: EmailFields;
  merge: MergeValues;
  gridReady: boolean;
  primaryProvider: string;
}) {
  const { pulse } = usePreferences();
  const [recipients, setRecipients] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [studioKey, setStudioKey] = useState("");
  const [state, setState] = useState<SendState>({ kind: "idle" });
  const [log, setLog] = useState<LogEntry[]>([]);

  const list = recipients
    .split(/[,\s;]+/)
    .map((value) => value.trim())
    .filter(Boolean);

  async function send() {
    if (list.length === 0) {
      setState({ kind: "error", message: "Add at least one recipient." });
      return;
    }
    setState({ kind: "sending" });
    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(studioKey ? { "x-studio-key": studioKey } : {}) },
        body: JSON.stringify({ to: list, replyTo, fields, merge, idempotencyKey: crypto.randomUUID() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Delivery failed.");
      pulse([10, 40, 10]);
      setState({ kind: "success", provider: payload.provider, id: payload.id, to: payload.to });
      setLog((entries) => [
        { at: new Date().toLocaleTimeString(), subject: payload.subject, to: payload.to, provider: payload.provider },
        ...entries,
      ]);
    } catch (error) {
      pulse(30);
      setState({ kind: "error", message: error instanceof Error ? error.message : "Delivery failed." });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          "flex items-start gap-3 rounded-md border p-4",
          gridReady ? "border-success/30 bg-success/5" : "border-warning/40 bg-warning/5",
        )}
      >
        {gridReady ? (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
        ) : (
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
        )}
        <div className="flex flex-col gap-1">
          <p className="font-display text-xs uppercase tracking-widest text-platinum">
            {gridReady ? "Grid ready" : "Grid requires configuration"}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {gridReady
              ? `Messages route through ${primaryProvider} first, with automatic failover when a second provider is configured.`
              : "Add a delivery provider and sender address in project settings before sending."}
          </p>
        </div>
      </div>

      <TextField
        label="Recipients"
        hint="Up to 5 addresses, separated by commas."
        type="email"
        value={recipients}
        onChange={setRecipients}
        placeholder="name@example.com"
      />
      <TextField label="Reply-to (optional)" type="email" value={replyTo} onChange={setReplyTo} placeholder="Not specified" />
      <TextField
        label="Studio send key"
        hint="Required only when STUDIO_SEND_KEY is configured on the server."
        type="password"
        value={studioKey}
        onChange={setStudioKey}
      />

      <button
        type="button"
        onClick={send}
        disabled={state.kind === "sending" || !gridReady}
        className="flex h-14 items-center justify-center gap-3 rounded-md bg-accent font-display text-sm uppercase tracking-widest text-accent-foreground transition-[transform,opacity] transition-precise hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state.kind === "sending" ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-5" aria-hidden="true" />
        )}
        {state.kind === "sending" ? "Routing through grid" : `Send to ${list.length || 0}`}
      </button>

      <div aria-live="polite" className="min-h-0">
        {state.kind === "success" && (
          <p className="flex items-start gap-2 rounded-md border border-success/30 bg-success/5 p-3 text-sm text-platinum">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            Accepted by {state.provider} for {state.to.join(", ")}
            {state.id ? ` · ID ${state.id}` : ""}
          </p>
        )}
        {state.kind === "error" && (
          <p role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-platinum">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            {state.message}
          </p>
        )}
      </div>

      <section aria-labelledby="session-log" className="flex flex-col gap-3">
        <h3 id="session-log" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Session log
        </h3>
        {log.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
            No messages sent in this session.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
            {log.map((entry, index) => (
              <li key={index} className="flex flex-col gap-1 p-3">
                <span className="truncate text-sm text-platinum">{entry.subject}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {entry.at} · {entry.provider} · {entry.to.length} recipient{entry.to.length === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
