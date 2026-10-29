import { z } from "zod";
import { qyxBrandAssets } from "@/lib/brand";

const brandKeys = Object.keys(qyxBrandAssets) as [keyof typeof qyxBrandAssets, ...(keyof typeof qyxBrandAssets)[]];

export const emailFieldsSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(200),
  preheader: z.string().max(200),
  eyebrow: z.string().max(80),
  headline: z.string().trim().min(1, "Headline is required").max(140),
  greeting: z.string().max(120),
  body: z.string().max(5000),
  ctaLabel: z.string().max(60),
  ctaUrl: z.string().max(500),
  detailRows: z.array(z.object({ label: z.string().max(60), value: z.string().max(120) })).max(8),
  productMark: z.enum(brandKeys),
  footerPattern: z.enum(["gridline", "signal", "lattice"]),
  mailingAddress: z.string().max(240),
  preferencesUrl: z.string().max(500),
});

export const sendRequestSchema = z.object({
  to: z.array(z.email("Enter a valid email address")).min(1, "Add at least one recipient").max(5, "Maximum 5 recipients"),
  replyTo: z.union([z.email(), z.literal("")]).optional(),
  fields: emailFieldsSchema,
  merge: z.record(z.string().max(40), z.string().max(200)).optional(),
  idempotencyKey: z.string().min(8).max(100),
});

export type SendRequest = z.infer<typeof sendRequestSchema>;
