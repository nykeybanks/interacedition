import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { BrandMark } from "@/components/brand-mark";
import { emailTemplates, footerPatterns } from "@/lib/email/templates";
import { renderPatternRow } from "@/lib/email/render";

export const metadata: Metadata = { title: "Template Library" };

export default function TemplatesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Email Studio · Library"
        title="Interact templates"
        description="Every template shares the same table-based structure, inline styles for client compatibility, and a QYX pattern footer with sender identity and preference links."
      />

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
        {emailTemplates.map((template) => {
          const pattern = footerPatterns.find((item) => item.id === template.defaults.footerPattern);
          return (
            <li key={template.id} className="bg-background">
              <Link
                href={`/studio?template=${template.id}`}
                className="group flex h-full flex-col gap-6 p-5 transition-colors transition-precise hover:bg-surface md:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <BrandMark asset={template.defaults.productMark} height={20} />
                  <ArrowUpRight
                    className="size-5 text-muted-foreground transition-transform transition-precise group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{template.category}</span>
                  <h2 className="font-display text-lg uppercase tracking-wider text-platinum">{template.name}</h2>
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">{template.description}</p>
                </div>
                <div className="mt-auto flex flex-col gap-2">
                  <span
                    aria-hidden="true"
                    className="block overflow-hidden rounded-sm"
                    dangerouslySetInnerHTML={{ __html: renderPatternRow(template.defaults.footerPattern, 6) }}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {pattern?.name} footer · {template.defaults.subject.length} char subject
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
