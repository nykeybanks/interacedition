import { NextResponse } from "next/server";
import { sendRequestSchema } from "@/lib/email/schema";
import { renderEmail, defaultMergeValues } from "@/lib/email/render";
import { getGridStatus, sendThroughGrid } from "@/lib/email/grid";

function resolveBaseUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured && /^https?:\/\//.test(configured)) return configured;
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  const requiredKey = process.env.STUDIO_SEND_KEY;
  if (requiredKey && request.headers.get("x-studio-key") !== requiredKey) {
    return NextResponse.json({ error: "Studio send key is missing or incorrect." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = sendRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const { to, replyTo, fields, merge, idempotencyKey } = parsed.data;
  const status = getGridStatus();
  const email = renderEmail({
    fields,
    merge: { ...defaultMergeValues, ...merge },
    baseUrl: resolveBaseUrl(request),
    senderName: status.senderName,
  });

  const result = await sendThroughGrid({
    to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    replyTo: replyTo || undefined,
    idempotencyKey,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error, provider: result.provider }, { status: 502 });
  }
  return NextResponse.json({ id: result.id, provider: result.provider, to, subject: email.subject });
}
