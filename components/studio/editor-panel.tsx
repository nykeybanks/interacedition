"use client";

import { Plus, Trash2 } from "lucide-react";
import type { EmailFields } from "@/lib/email/templates";
import { footerPatterns } from "@/lib/email/templates";
import { renderPatternRow, type MergeValues } from "@/lib/email/render";
import type { BrandAssetKey } from "@/lib/brand";
import { FieldGroup, SegmentedControl, TextAreaField, TextField } from "./field";
import { cn } from "@/lib/utils";

const markOptions: { value: BrandAssetKey; label: string }[] = [
  { value: "qyx20", label: "QYX20" },
  { value: "qyxpay", label: "QYXpay" },
  { value: "quantumyield", label: "QuantumYield" },
  { value: "qyxos", label: "QYXos" },
  { value: "qyxai", label: "QYXai" },
];

type EditorPanelProps = {
  fields: EmailFields;
  merge: MergeValues;
  onFieldChange: <K extends keyof EmailFields>(key: K, value: EmailFields[K]) => void;
  onMergeChange: (key: string, value: string) => void;
};

export function EditorPanel({ fields, merge, onFieldChange, onMergeChange }: EditorPanelProps) {
  function updateRow(index: number, key: "label" | "value", value: string) {
    onFieldChange(
      "detailRows",
      fields.detailRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup title="Envelope">
        <TextField label="Subject" value={fields.subject} onChange={(value) => onFieldChange("subject", value)} />
        <TextField
          label="Preheader"
          hint="Inbox preview text shown after the subject."
          value={fields.preheader}
          onChange={(value) => onFieldChange("preheader", value)}
        />
      </FieldGroup>

      <FieldGroup title="Identity">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Header mark</span>
          <div role="radiogroup" aria-label="Header mark" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {markOptions.map((option) => {
              const selected = option.value === fields.productMark;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onFieldChange("productMark", option.value)}
                  className={cn(
                    "h-11 shrink-0 rounded-md border px-4 font-mono text-xs uppercase tracking-widest transition-colors transition-precise",
                    selected ? "border-accent/60 bg-surface-elevated text-platinum" : "border-border text-muted-foreground hover:text-platinum",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <TextField label="Eyebrow" value={fields.eyebrow} onChange={(value) => onFieldChange("eyebrow", value)} />
      </FieldGroup>

      <FieldGroup title="Message">
        <TextField label="Headline" value={fields.headline} onChange={(value) => onFieldChange("headline", value)} />
        <TextField label="Greeting" value={fields.greeting} onChange={(value) => onFieldChange("greeting", value)} />
        <TextAreaField
          label="Body"
          hint="Separate paragraphs with a blank line. Merge tags like {{name}} are supported."
          value={fields.body}
          onChange={(value) => onFieldChange("body", value)}
          rows={8}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Button label" value={fields.ctaLabel} onChange={(value) => onFieldChange("ctaLabel", value)} />
          <TextField label="Button URL" type="url" value={fields.ctaUrl} onChange={(value) => onFieldChange("ctaUrl", value)} />
        </div>
      </FieldGroup>

      <FieldGroup title="Detail ledger">
        <ul className="flex flex-col gap-3">
          {fields.detailRows.map((row, index) => (
            <li key={index} className="flex items-end gap-2">
              <TextField
                label={`Label ${index + 1}`}
                value={row.label}
                onChange={(value) => updateRow(index, "label", value)}
                className="flex-1"
              />
              <TextField
                label={`Value ${index + 1}`}
                value={row.value}
                onChange={(value) => updateRow(index, "value", value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => onFieldChange("detailRows", fields.detailRows.filter((_, rowIndex) => rowIndex !== index))}
                className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors transition-precise hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                <span className="sr-only">Remove row {index + 1}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={fields.detailRows.length >= 8}
          onClick={() => onFieldChange("detailRows", [...fields.detailRows, { label: "", value: "" }])}
          className="flex h-11 items-center justify-center gap-2 rounded-md border border-dashed border-border-strong text-sm text-silver transition-colors transition-precise hover:border-accent/50 hover:text-platinum disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add row
        </button>
      </FieldGroup>

      <FieldGroup title="Pattern footer">
        <div role="radiogroup" aria-label="Footer pattern" className="flex flex-col gap-2">
          {footerPatterns.map((pattern) => {
            const selected = pattern.id === fields.footerPattern;
            return (
              <button
                key={pattern.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onFieldChange("footerPattern", pattern.id)}
                className={cn(
                  "flex flex-col gap-3 rounded-md border p-3 text-left transition-colors transition-precise",
                  selected ? "border-accent/60 bg-surface-elevated" : "border-border hover:border-border-strong",
                )}
              >
                <span
                  aria-hidden="true"
                  className="block overflow-hidden rounded-sm"
                  dangerouslySetInnerHTML={{ __html: renderPatternRow(pattern.id, 8) }}
                />
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-xs uppercase tracking-widest text-platinum">{pattern.name}</span>
                  <span className="text-right text-xs text-muted-foreground">{pattern.description}</span>
                </span>
              </button>
            );
          })}
        </div>
        <TextField
          label="Mailing address"
          hint="Required by anti-spam law for commercial email. Not specified until you add it."
          value={fields.mailingAddress}
          onChange={(value) => onFieldChange("mailingAddress", value)}
          placeholder="Not specified"
        />
        <TextField
          label="Preferences URL"
          type="url"
          value={fields.preferencesUrl}
          onChange={(value) => onFieldChange("preferencesUrl", value)}
          placeholder="https://"
        />
      </FieldGroup>

      <FieldGroup title="Merge values">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(merge).map(([key, value]) => (
            <TextField key={key} label={`{{${key}}}`} value={value} onChange={(next) => onMergeChange(key, next)} />
          ))}
        </div>
      </FieldGroup>

      <SegmentedControl
        label="Quick density"
        value={fields.detailRows.length > 0 ? "ledger" : "plain"}
        options={[
          { value: "ledger", label: "With ledger" },
          { value: "plain", label: "Plain" },
        ]}
        onChange={(value) =>
          onFieldChange("detailRows", value === "plain" ? [] : fields.detailRows.length ? fields.detailRows : [{ label: "Reference", value: "{{reference}}" }])
        }
      />
    </div>
  );
}
