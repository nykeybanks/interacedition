import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BrandMark } from "@/components/brand-mark";
import { StatusBadge } from "@/components/ui/status-badge";
import type { BrandAssetKey } from "@/lib/brand";

export const metadata: Metadata = { title: "Product Lines" };

const products: { mark: BrandAssetKey; name: string; role: string }[] = [
  { mark: "qyx20", name: "QYX20™", role: "Edition line hosting the Interact navigation and Email Studio." },
  { mark: "qyxpay", name: "QYXpay™", role: "Payments product. Templates here use sandbox wording only." },
  { mark: "qyxos", name: "QYXos™", role: "Operating environment. Not connected to this edition." },
  { mark: "qyxai", name: "QYXai™", role: "Intelligence layer. Not connected to this edition." },
];

export default function EcosystemPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Ecosystem · Product Lines"
        title="QuantumYield product lines"
        description="Product marks available to the Email Studio header. Status describes this edition only and makes no claim about availability elsewhere."
      />
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {products.map((product) => (
          <li key={product.mark} className="flex flex-col gap-6 bg-background p-5 md:p-8">
            <div className="flex h-10 items-center">
              <BrandMark asset={product.mark} height={product.mark === "qyxpay" ? 36 : 28} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-sm uppercase tracking-widest text-platinum">{product.name}</h2>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">{product.role}</p>
            </div>
            <StatusBadge tone="Concept" />
          </li>
        ))}
      </ul>
    </div>
  );
}
