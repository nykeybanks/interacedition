import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { StudioComposer } from "@/components/studio/studio-composer";
import { getGridStatus } from "@/lib/email/grid";
import { emailTemplates, type TemplateId } from "@/lib/email/templates";

export const metadata: Metadata = { title: "Email Studio" };

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  const { template } = await searchParams;
  const initialTemplate = (emailTemplates.find((item) => item.id === template)?.id ?? "welcome") as TemplateId;
  const status = getGridStatus();
  const primary = status.providers.find((provider) => provider.configured)?.name ?? "the grid";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        eyebrow="Email Studio · Compose"
        title="Interact email studio"
        description="Compose an Interact-branded message, preview it on mobile and desktop, and send it through the delivery grid with the QYX pattern footer."
      />
      <StudioComposer
        initialTemplate={initialTemplate}
        gridReady={status.ready}
        primaryProvider={primary}
        senderName={status.senderName}
      />
    </div>
  );
}
