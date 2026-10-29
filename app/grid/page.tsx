import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { getGridStatus } from "@/lib/email/grid";

export const metadata: Metadata = { title: "Delivery Grid" };
export const dynamic = "force-dynamic";

export default function GridPage() {
  const status = getGridStatus();
  const protectedSend = Boolean(process.env.STUDIO_SEND_KEY);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Command · Delivery Grid"
        title="Delivery grid"
        description="The grid routes each message to the first configured provider and fails over to the next one. Readiness reflects server configuration only — no deliverability claims are made here."
      />

      <section aria-labelledby="route" className="flex flex-col gap-4">
        <h2 id="route" className="font-display text-xs uppercase tracking-widest text-platinum">
          Route order
        </h2>
        <ol className="flex flex-col overflow-hidden rounded-md border border-border">
          {status.providers.map((provider, index) => (
            <li key={provider.id} className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
              <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-base font-medium text-platinum">{provider.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {provider.configured ? "Credential present" : `Requires ${provider.missing.join(", ")}`}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge tone={provider.configured ? "Ready" : "Missing"} label={provider.configured ? "Ready" : "Not set"} />
                <StatusBadge tone={provider.role === "primary" ? "Primary" : "Fallback"} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="identity" className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
        <h2 id="identity" className="sr-only">
          Sender identity
        </h2>
        <div className="flex flex-col gap-2 bg-background p-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sender name</span>
          <span className="text-platinum">{status.senderName}</span>
          {status.senderNameOverridden ? (
            <span className="text-xs leading-relaxed text-warning">
              SENDER_NAME is not a QYX family name and was replaced. Update it in project settings.
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 bg-background p-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sender address</span>
          <span className="break-all font-mono text-sm text-platinum">{status.senderEmail || "Not specified"}</span>
        </div>
        <div className="flex flex-col gap-2 bg-background p-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Overall</span>
          <StatusBadge tone={status.ready ? "Ready" : "Warning"} label={status.ready ? "Ready to send" : "Requires configuration"} />
        </div>
      </section>

      <section
        className={`flex items-start gap-3 rounded-md border p-4 ${protectedSend ? "border-success/30" : "border-warning/40 bg-warning/5"}`}
      >
        {protectedSend ? (
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
        ) : (
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xs uppercase tracking-widest text-platinum">
            {protectedSend ? "Send endpoint protected" : "Send endpoint unprotected"}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {protectedSend
              ? "Requests must include the studio send key."
              : "Set STUDIO_SEND_KEY in project settings before publishing so only your team can send from the studio."}
          </p>
        </div>
      </section>

      <Link
        href="/studio"
        className="flex h-14 items-center justify-between rounded-md border border-border-strong px-4 text-platinum transition-colors transition-precise hover:bg-surface"
      >
        <span className="font-display text-sm uppercase tracking-widest">Open Email Studio</span>
        <ArrowRight className="size-5 text-accent" aria-hidden="true" />
      </Link>
    </div>
  );
}
