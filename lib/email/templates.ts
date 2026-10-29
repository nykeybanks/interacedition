import type { BrandAssetKey } from "@/lib/brand";

export type TemplateId = "welcome" | "payment" | "security" | "update";

export type FooterPattern = "gridline" | "signal" | "lattice";

export type EmailFields = {
  subject: string;
  preheader: string;
  eyebrow: string;
  headline: string;
  greeting: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  detailRows: { label: string; value: string }[];
  productMark: BrandAssetKey;
  footerPattern: FooterPattern;
  mailingAddress: string;
  preferencesUrl: string;
};

export type EmailTemplate = {
  id: TemplateId;
  name: string;
  category: "Onboarding" | "Transactional" | "Security" | "Announcement";
  description: string;
  defaults: EmailFields;
};

const sharedFooter = {
  mailingAddress: "",
  preferencesUrl: "",
};

export const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Interact Welcome",
    category: "Onboarding",
    description: "First-touch onboarding message introducing the Interact Edition.",
    defaults: {
      subject: "Welcome to the QYX20 Interact Edition",
      preheader: "Your access to the Interact Edition is ready.",
      eyebrow: "QYX20 · INTERACT EDITION",
      headline: "Precision access, now active.",
      greeting: "Hello {{name}},",
      body: "Your QYX20 Interact Edition workspace is ready. Navigate every module from a single full-screen command surface, compose branded communication in the Email Studio, and route delivery through the grid.\n\nThis edition is a prototype environment. Features marked Concept or Planned are not yet available.",
      ctaLabel: "Open Interact",
      ctaUrl: "https://qyx.app",
      detailRows: [
        { label: "Edition", value: "Interact" },
        { label: "Status", value: "Prototype" },
      ],
      productMark: "qyx20",
      footerPattern: "gridline",
      ...sharedFooter,
    },
  },
  {
    id: "payment",
    name: "QYXpay Confirmation",
    category: "Transactional",
    description: "Receipt-style confirmation with a structured reference ledger.",
    defaults: {
      subject: "QYXpay confirmation — Ref {{reference}}",
      preheader: "A record of your QYXpay activity.",
      eyebrow: "QYXPAY · CONFIRMATION",
      headline: "Activity recorded.",
      greeting: "Hello {{name}},",
      body: "This message confirms activity on your QYXpay sandbox account. No action is required. QYX will never ask you to share a password, PIN, or security answer by email.",
      ctaLabel: "View activity",
      ctaUrl: "https://qyx.app",
      detailRows: [
        { label: "Reference", value: "{{reference}}" },
        { label: "Amount", value: "{{amount}}" },
        { label: "Date", value: "{{date}}" },
        { label: "Environment", value: "Sandbox" },
      ],
      productMark: "qyxpay",
      footerPattern: "lattice",
      ...sharedFooter,
    },
  },
  {
    id: "security",
    name: "Security Notice",
    category: "Security",
    description: "Sign-in or device notice with clear, non-alarming next steps.",
    defaults: {
      subject: "New sign-in to your QYX account",
      preheader: "Review a recent sign-in to your account.",
      eyebrow: "QUANTUMYIELD · SECURITY",
      headline: "New sign-in detected.",
      greeting: "Hello {{name}},",
      body: "We noticed a new sign-in to your account. If this was you, no action is needed. If you do not recognize this activity, open your account directly from the QYX app — do not reply to this email with personal information.",
      ctaLabel: "Review activity",
      ctaUrl: "https://qyx.app",
      detailRows: [
        { label: "Device", value: "{{device}}" },
        { label: "Time", value: "{{date}}" },
      ],
      productMark: "quantumyield",
      footerPattern: "signal",
      ...sharedFooter,
    },
  },
  {
    id: "update",
    name: "Edition Update",
    category: "Announcement",
    description: "Release note announcement with a module summary.",
    defaults: {
      subject: "Interact Edition update: full-screen navigation",
      preheader: "A new command surface for every module.",
      eyebrow: "QYX20 · RELEASE NOTE",
      headline: "One surface. Every module.",
      greeting: "Hello {{name}},",
      body: "The Interact Edition now ships a full-screen, multi-level navigation system with touch gestures, a mobile command dock, and keyboard shortcuts.\n\nThe Email Studio lets your team compose and send branded messages with the QYX gridline footer.",
      ctaLabel: "See what changed",
      ctaUrl: "https://qyx.app",
      detailRows: [
        { label: "Navigation", value: "Full-screen, multi-level" },
        { label: "Touch", value: "Swipe, long-press, haptics" },
        { label: "Studio", value: "Compose, preview, send" },
      ],
      productMark: "qyx20",
      footerPattern: "gridline",
      ...sharedFooter,
    },
  },
];

export function getTemplate(id: TemplateId) {
  return emailTemplates.find((template) => template.id === id) ?? emailTemplates[0];
}

export const footerPatterns: { id: FooterPattern; name: string; description: string }[] = [
  { id: "gridline", name: "Gridline", description: "Even graphite cells with a single gold registration mark." },
  { id: "signal", name: "Signal", description: "Ascending cell rhythm suited to security and system notices." },
  { id: "lattice", name: "Lattice", description: "Alternating ledger cells for transactional receipts." },
];
