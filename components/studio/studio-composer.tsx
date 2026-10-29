"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Eye, PenLine, RotateCcw, Send } from "lucide-react";
import { emailTemplates, getTemplate, type EmailFields, type TemplateId } from "@/lib/email/templates";
import { defaultMergeValues, renderEmail, type MergeValues } from "@/lib/email/render";
import { useSwipe } from "@/hooks/use-gestures";
import { usePreferences } from "@/components/providers/preferences-provider";
import { EditorPanel } from "./editor-panel";
import { PreviewPanel } from "./preview-panel";
import { SendPanel } from "./send-panel";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "edit", label: "Edit", icon: PenLine },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "send", label: "Send", icon: Send },
] as const;

type TabId = (typeof tabs)[number]["id"];

const subscribeNoop = () => () => {};

export function StudioComposer({
  initialTemplate,
  gridReady,
  primaryProvider,
  senderName,
}: {
  initialTemplate: TemplateId;
  gridReady: boolean;
  primaryProvider: string;
  senderName: string;
}) {
  const { pulse } = usePreferences();
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplate);
  const [fields, setFields] = useState<EmailFields>(() => structuredClone(getTemplate(initialTemplate).defaults));
  const [merge, setMerge] = useState<MergeValues>(defaultMergeValues);
  const [tab, setTab] = useState<TabId>("edit");

  const origin = useSyncExternalStore(subscribeNoop, () => window.location.origin, () => "");

  const rendered = useMemo(
    () => renderEmail({ fields, merge, baseUrl: origin, senderName }),
    [fields, merge, origin, senderName],
  );

  function selectTab(next: TabId) {
    pulse(5);
    setTab(next);
  }

  const tabIndex = tabs.findIndex((item) => item.id === tab);
  const swipe = useSwipe({
    left: () => tabIndex < tabs.length - 1 && selectTab(tabs[tabIndex + 1].id),
    right: () => tabIndex > 0 && selectTab(tabs[tabIndex - 1].id),
  }, 80);

  function loadTemplate(id: TemplateId) {
    setTemplateId(id);
    setFields(structuredClone(getTemplate(id).defaults));
    pulse(8);
  }

  const editor = (
    <EditorPanel
      fields={fields}
      merge={merge}
      onFieldChange={(key, value) => setFields((current) => ({ ...current, [key]: value }))}
      onMergeChange={(key, value) => setMerge((current) => ({ ...current, [key]: value }))}
    />
  );
  const preview = <PreviewPanel html={rendered.html} subject={rendered.subject} preheader={fields.preheader} />;
  const sender = <SendPanel fields={fields} merge={merge} gridReady={gridReady} primaryProvider={primaryProvider} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Template</span>
          <button
            type="button"
            onClick={() => loadTemplate(templateId)}
            className="flex h-11 items-center gap-2 rounded-md px-2 text-xs text-muted-foreground transition-colors transition-precise hover:text-platinum"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
        <div role="radiogroup" aria-label="Template" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {emailTemplates.map((template) => {
            const selected = template.id === templateId;
            return (
              <button
                key={template.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => loadTemplate(template.id)}
                className={cn(
                  "flex min-h-16 w-44 shrink-0 flex-col justify-center gap-1 rounded-md border px-3 text-left transition-colors transition-precise",
                  selected ? "border-accent/60 bg-surface-elevated" : "border-border bg-surface hover:border-border-strong",
                )}
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{template.category}</span>
                <span className="text-sm font-medium text-platinum">{template.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:hidden">
        <div
          role="tablist"
          aria-label="Studio panels"
          className="sticky top-16 z-30 -mx-4 grid grid-cols-3 border-y border-border bg-background/95 backdrop-blur-md"
        >
          {tabs.map((item) => {
            const Icon = item.icon;
            const selected = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`panel-${item.id}`}
                onClick={() => selectTab(item.id)}
                className={cn(
                  "relative flex h-12 items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-widest transition-colors transition-precise",
                  selected ? "text-platinum" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-4 bottom-0 h-px bg-accent transition-transform transition-precise",
                    selected ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            );
          })}
        </div>
        <div className="pt-6" {...swipe}>
          {tabs.map((item) => (
            <div
              key={item.id}
              role="tabpanel"
              id={`panel-${item.id}`}
              aria-labelledby={`tab-${item.id}`}
              hidden={item.id !== tab}
              className="qyx-rise"
            >
              {item.id === "edit" ? editor : item.id === "preview" ? preview : sender}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section aria-label="Editor" className="flex flex-col gap-6">
          {editor}
        </section>
        <section aria-label="Preview and send" className="sticky top-24 flex max-h-[calc(100dvh-7rem)] flex-col gap-8 self-start overflow-y-auto pr-1">
          {preview}
          <div className="border-t border-border pt-6">{sender}</div>
        </section>
      </div>
    </div>
  );
}
