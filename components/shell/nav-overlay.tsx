"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronRight, Search, X } from "lucide-react";
import { allNavLinks, navSections, findActiveLink, type NavSection } from "@/lib/navigation";
import { useSwipe } from "@/hooks/use-gestures";
import { usePreferences } from "@/components/providers/preferences-provider";
import { BrandMark } from "@/components/brand-mark";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

type NavOverlayProps = {
  open: boolean;
  focusSearch: boolean;
  onClose: () => void;
};

export function NavOverlay({ open, focusSearch, onClose }: NavOverlayProps) {
  const pathname = usePathname();
  const { pulse } = usePreferences();
  const active = findActiveLink(pathname);
  const [sectionId, setSectionId] = useState<string>(active?.sectionId ?? navSections[0].id);
  const [mobileLevel, setMobileLevel] = useState<1 | 2>(1);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const section = navSections.find((item) => item.id === sectionId) ?? navSections[0];

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setMobileLevel(1);
    if (active) setSectionId(active.sectionId);
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => (focusSearch ? searchRef.current : closeRef.current)?.focus());
    return () => {
      document.body.style.overflow = "";
      previous?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (mobileLevel === 2 && window.innerWidth < 768) setMobileLevel(1);
        else onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      const visible = Array.from(focusable).filter((element) => element.offsetParent !== null);
      if (visible.length === 0) return;
      const first = visible[0];
      const last = visible[visible.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, mobileLevel, onClose]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return allNavLinks.filter((link) =>
      [link.label, link.description, link.sectionLabel, ...(link.keywords ?? [])].join(" ").toLowerCase().includes(term),
    );
  }, [query]);

  const swipe = useSwipe({
    down: onClose,
    right: () => (mobileLevel === 2 ? setMobileLevel(1) : onClose()),
    left: () => mobileLevel === 1 && setMobileLevel(2),
  });

  function selectSection(item: NavSection) {
    pulse(6);
    setSectionId(item.id);
    setMobileLevel(2);
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Interact navigation"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-void/[0.97] backdrop-blur-md transition-[opacity,transform] transition-precise",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
      {...swipe}
    >
      <div className="qyx-gridline pointer-events-none absolute inset-0" aria-hidden="true" />

      <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-border px-4 md:px-8">
        <BrandMark asset="qyxLockup" height={28} />
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:inline">
            Esc to close
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-md border border-border text-platinum transition-colors transition-precise hover:border-border-strong hover:bg-surface-elevated active:scale-95"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Close navigation</span>
          </button>
        </div>
      </header>

      <div className="relative shrink-0 border-b border-border px-4 py-3 md:px-8">
        <label className="flex h-12 items-center gap-3 rounded-md border border-border bg-surface px-3 focus-within:border-accent/60">
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Search modules</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search modules, templates, settings"
            className="h-full flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
            {"⌘K"}
          </kbd>
        </label>
      </div>

      {query.trim() ? (
        <SearchResults results={results} pathname={pathname} onNavigate={onClose} />
      ) : (
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <nav
            aria-label="Sections"
            className={cn(
              "absolute inset-0 overflow-y-auto transition-transform transition-precise md:static md:w-80 md:shrink-0 md:translate-x-0 md:border-r md:border-border",
              mobileLevel === 2 ? "-translate-x-full" : "translate-x-0",
            )}
          >
            <ul className="flex flex-col">
              {navSections.map((item, index) => {
                const Icon = item.icon;
                const selected = item.id === section.id;
                return (
                  <li key={item.id} className="qyx-rise" style={{ animationDelay: `calc(${index} * 40ms)` }}>
                    <button
                      type="button"
                      onClick={() => selectSection(item)}
                      aria-current={selected ? "true" : undefined}
                      className={cn(
                        "group flex w-full items-center gap-4 border-b border-border px-4 py-5 text-left transition-colors transition-precise md:px-8",
                        selected ? "md:bg-surface" : "hover:bg-surface/60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-md border transition-colors transition-precise",
                          selected ? "border-accent/50 text-accent" : "border-border text-silver",
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="font-display text-lg uppercase tracking-wider text-platinum">{item.label}</span>
                        <span className="truncate font-body text-sm text-muted-foreground">{item.summary}</span>
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">{item.links.length}</span>
                      <ChevronRight className="size-4 text-muted-foreground md:hidden" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section
            aria-label={`${section.label} links`}
            className={cn(
              "absolute inset-0 overflow-y-auto transition-transform transition-precise md:static md:flex-1 md:translate-x-0",
              mobileLevel === 2 ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3 md:px-10 md:py-6">
              <button
                type="button"
                onClick={() => setMobileLevel(1)}
                className="flex size-11 items-center justify-center rounded-md border border-border text-silver md:hidden"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                <span className="sr-only">Back to sections</span>
              </button>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] uppercase tracking-widest text-accent">Section</span>
                <h2 className="font-display text-xl uppercase tracking-wider text-platinum md:text-3xl">{section.label}</h2>
              </div>
            </div>
            <ul key={section.id} className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
              {section.links.map((link, index) => {
                const current = active?.id === link.id;
                return (
                  <li key={link.id} className="qyx-rise bg-void" style={{ animationDelay: `calc(${index} * 50ms)` }}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "group flex min-h-32 flex-col justify-between gap-6 p-5 transition-colors transition-precise hover:bg-surface md:min-h-44 md:p-8",
                        current && "bg-surface",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-display text-base uppercase tracking-wider text-platinum md:text-xl">
                          {link.label}
                        </span>
                        <ArrowUpRight
                          className="size-5 text-muted-foreground transition-transform transition-precise group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className="font-body text-sm leading-relaxed text-muted-foreground text-pretty">{link.description}</p>
                        <div className="flex items-center gap-2">
                          <StatusBadge tone={link.status} />
                          {current && <StatusBadge tone="Primary" label="Current" />}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}

      <footer className="safe-bottom relative flex shrink-0 items-center justify-between border-t border-border px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:px-8">
        <span>Swipe down to close</span>
        <span className="md:hidden">{mobileLevel === 2 ? "Swipe right · back" : "Swipe left · open"}</span>
        <span className="hidden md:inline">QYX20 · Interact Edition</span>
      </footer>
    </div>
  );
}

function SearchResults({
  results,
  pathname,
  onNavigate,
}: {
  results: typeof allNavLinks;
  pathname: string;
  onNavigate: () => void;
}) {
  if (results.length === 0) {
    return (
      <div className="relative flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="font-display text-sm uppercase tracking-wider text-platinum">No matches</p>
        <p className="font-body text-sm text-muted-foreground">Try “studio”, “footer”, “grid”, or “motion”.</p>
      </div>
    );
  }
  return (
    <ul className="relative flex-1 overflow-y-auto" aria-live="polite">
      {results.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            onClick={onNavigate}
            aria-current={pathname === link.href ? "page" : undefined}
            className="flex min-h-16 items-center gap-4 border-b border-border px-4 py-4 transition-colors transition-precise hover:bg-surface md:px-8"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{link.sectionLabel}</span>
              <span className="text-base font-medium text-platinum">{link.label}</span>
              <span className="truncate font-body text-sm text-muted-foreground">{link.description}</span>
            </span>
            <StatusBadge tone={link.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
