import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PreferencesForm } from "@/components/settings/preferences-form";

export const metadata: Metadata = { title: "Preferences" };

const gestures = [
  { input: "Tap Menu", result: "Open full-screen navigation" },
  { input: "Long-press Menu", result: "Open navigation with search focused" },
  { input: "Swipe up on dock", result: "Open full-screen navigation" },
  { input: "Swipe left in menu", result: "Drill into the selected section" },
  { input: "Swipe right in menu", result: "Back one level, or close" },
  { input: "Swipe down in menu", result: "Close navigation" },
  { input: "Swipe left / right in Studio", result: "Move between Edit, Preview, Send" },
  { input: "⌘K · Ctrl K · /", result: "Search modules from anywhere" },
  { input: "Esc", result: "Back one level, then close" },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        eyebrow="System · Preferences"
        title="Motion and touch"
        description="Preferences are stored on this device. Your operating system's reduced-motion setting always takes priority."
      />
      <PreferencesForm />
      <section id="gestures" aria-labelledby="gesture-title" className="flex scroll-mt-24 flex-col gap-4">
        <h2 id="gesture-title" className="font-display text-xs uppercase tracking-widest text-platinum">
          Gesture guide
        </h2>
        <dl className="flex flex-col overflow-hidden rounded-md border border-border">
          {gestures.map((gesture) => (
            <div key={gesture.input} className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <dt className="font-mono text-xs uppercase tracking-widest text-accent">{gesture.input}</dt>
              <dd className="text-sm text-silver">{gesture.result}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
