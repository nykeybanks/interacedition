import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { StatusBadge } from "@/components/ui/status-badge";
import { navSections } from "@/lib/navigation";
import { getGridStatus } from "@/lib/email/grid";
import { renderPatternRow } from "@/lib/email/render";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const status = getGridStatus();

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border">
        <div className="qyx-gridline pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:px-8 md:py-20">
          <div className="qyx-rise flex items-center gap-3">
            <BrandMark asset="qyx20" height={22} priority />
            <span className="h-4 w-px bg-border-strong" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">Interact Edition</span>
          </div>
          <h1
            className="qyx-rise font-display text-3xl uppercase leading-tight tracking-wider text-platinum text-balance md:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            Every module, one command surface.
          </h1>
          <p
            className="qyx-rise max-w-xl font-body text-base leading-relaxed text-muted-foreground text-pretty md:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Full-screen, multi-level navigation built for touch, and an Email Studio that composes Interact-branded
            messages and routes them through the delivery grid.
          </p>
          <div className="qyx-rise flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "180ms" }}>
            <Link
              href="/studio"
              className="flex h-14 items-center justify-between gap-6 rounded-md bg-accent px-5 font-display text-sm uppercase tracking-widest text-accent-foreground transition-opacity transition-precise hover:opacity-90"
            >
              Open Email Studio
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href="/grid"
              className="flex h-14 items-center justify-between gap-6 rounded-md border border-border-strong px-5 font-display text-sm uppercase tracking-widest text-platinum transition-colors transition-precise hover:bg-surface"
            >
              Grid status
              <StatusBadge tone={status.ready ? "Ready" : "Warning"} label={status.ready ? "Ready" : "Setup"} />
            </Link>
          </div>
        </div>
        <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: renderPatternRow("gridline", 4) }} />
      </section>

      <section aria-labelledby="modules" className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 md:px-8 md:py-12">
        <div className="flex items-baseline justify-between">
          <h2 id="modules" className="font-display text-xs uppercase tracking-widest text-platinum">
            Module index
          </h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            {navSections.reduce((total, section) => total + section.links.length, 0)} destinations
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {navSections.map((section) => {
            const Icon = section.icon;
            return (
              <li key={section.id} className="flex flex-col gap-4 bg-background p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md border border-border text-silver">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-sm uppercase tracking-widest text-platinum">{section.label}</h3>
                </div>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">{section.summary}</p>
                <ul className="mt-auto flex flex-col border-t border-border">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="group flex min-h-11 items-center justify-between gap-3 border-b border-border py-2 text-sm text-silver transition-colors transition-precise last:border-b-0 hover:text-platinum"
                      >
                        {link.label}
                        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-accent" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Tip — swipe up on the dock or press ⌘K to open navigation.
        </p>
      </section>
    </div>
  );
}
