export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-6">
      <span className="font-mono text-[11px] uppercase tracking-widest text-accent">{eyebrow}</span>
      <h1 className="font-display text-2xl uppercase leading-tight tracking-wider text-platinum text-balance md:text-4xl">{title}</h1>
      <p className="max-w-2xl font-body text-base leading-relaxed text-muted-foreground text-pretty">{description}</p>
    </header>
  );
}
