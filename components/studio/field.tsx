import { useId } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-md border border-border bg-void px-3 text-base text-foreground placeholder:text-muted-foreground transition-colors transition-precise hover:border-border-strong focus:border-accent/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

type BaseProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function TextField({ label, hint, value, onChange, placeholder, className, type = "text" }: BaseProps & { type?: string }) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputClass, "h-12")}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextAreaField({ label, hint, value, onChange, placeholder, className, rows = 6 }: BaseProps & { rows?: number }) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputClass, "py-3 font-body leading-relaxed")}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 border-b border-border pb-6">
      <legend className="mb-4 font-display text-xs uppercase tracking-widest text-platinum">{title}</legend>
      {children}
    </fieldset>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-md border border-border bg-void p-1">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-10 flex-1 rounded-sm px-3 text-sm transition-colors transition-precise",
                selected ? "bg-surface-elevated text-platinum ring-1 ring-accent/50" : "text-muted-foreground hover:text-platinum",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
