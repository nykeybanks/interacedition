"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { dockLinks, findActiveLink } from "@/lib/navigation";
import { useLongPress, useSwipe } from "@/hooks/use-gestures";
import { usePreferences } from "@/components/providers/preferences-provider";
import { BrandMark } from "@/components/brand-mark";
import { NavOverlay } from "./nav-overlay";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { pulse } = usePreferences();
  const [open, setOpen] = useState(false);
  const [focusSearch, setFocusSearch] = useState(false);
  const active = findActiveLink(pathname);

  const openNav = useCallback(
    (withSearch = false) => {
      pulse(10);
      setFocusSearch(withSearch);
      setOpen(true);
    },
    [pulse],
  );
  const closeNav = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable='true']");
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openNav(true);
      } else if (!typing && event.key === "/") {
        event.preventDefault();
        openNav(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openNav]);

  const menuPress = useLongPress(() => openNav(true));
  const dockSwipe = useSwipe({ up: () => openNav(false) }, 32);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
          <Link href="/" className="flex shrink-0 items-center" aria-label="QYX20 Interact Edition home">
            <BrandMark asset="emblem" height={22} priority />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col border-l border-border pl-3">
            <span className="font-mono text-[10px] uppercase leading-none tracking-widest text-muted-foreground">
              {active?.sectionLabel ?? "Interact"}
            </span>
            <span className="truncate font-display text-sm uppercase leading-tight tracking-wider text-platinum">
              {active?.label ?? "QYX20"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => openNav(true)}
            className="hidden h-11 items-center gap-3 rounded-md border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors transition-precise hover:border-border-strong md:flex"
          >
            <Search className="size-4" aria-hidden="true" />
            Search
            <kbd className="rounded-sm border border-border px-1.5 font-mono text-[10px]">{"⌘K"}</kbd>
          </button>
          <button
            type="button"
            onClick={() => openNav(false)}
            {...menuPress}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex h-11 items-center gap-2 rounded-md border border-border-strong px-3 text-platinum transition-colors transition-precise hover:bg-surface-elevated active:scale-95"
          >
            <Menu className="size-5" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest">Menu</span>
          </button>
        </div>
      </header>

      <main id="main" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>

      <nav
        aria-label="Quick dock"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
        {...dockSwipe}
      >
        <div className="mx-auto flex h-1 w-10 translate-y-1.5 rounded-full bg-border-strong" aria-hidden="true" />
        <ul className="grid grid-cols-4">
          {dockLinks.map((item) => {
            const Icon = item.icon;
            const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => pulse(6)}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "relative flex h-16 flex-col items-center justify-center gap-1 transition-colors transition-precise active:scale-95",
                    current ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {current && <span className="absolute inset-x-6 top-0 h-px bg-accent" aria-hidden="true" />}
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <NavOverlay open={open} focusSearch={focusSearch} onClose={closeNav} />
    </div>
  );
}
