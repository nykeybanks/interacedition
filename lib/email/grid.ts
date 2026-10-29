import "server-only";

export type ProviderId = "sendgrid" | "resend";

export type GridMessage = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey: string;
};

export type GridResult =
  | { ok: true; provider: ProviderId; id: string | null }
  | { ok: false; provider: ProviderId | null; error: string };

export type ProviderStatus = {
  id: ProviderId;
  name: string;
  configured: boolean;
  role: "primary" | "fallback";
  missing: string[];
};

const DEFAULT_SENDER_NAME = "QuantumYield";
const APPROVED_SENDER_NAME = /^(QuantumYield|QYX(20|os|pay|ai|\.app)?)(\s[\w .·-]{0,40})?$/i;

// Display names outside the QYX family could impersonate third-party financial brands,
// so unapproved SENDER_NAME values are ignored rather than sent.
function sender() {
  const email = process.env.RESEND_FROM_EMAIL ?? process.env.NEXT_PUBLIC_SENDER_EMAIL ?? "";
  const requested = process.env.SENDER_NAME?.trim() ?? "";
  const approved = requested !== "" && APPROVED_SENDER_NAME.test(requested);
  return { email, name: approved ? requested : DEFAULT_SENDER_NAME, overridden: requested !== "" && !approved };
}

export function getGridStatus() {
  const { email, name, overridden } = sender();
  const sendgridConfigured = Boolean(process.env.SENDGRID_API_KEY);
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  const providers: ProviderStatus[] = [
    {
      id: "sendgrid",
      name: "SendGrid",
      configured: sendgridConfigured,
      role: sendgridConfigured ? "primary" : "fallback",
      missing: sendgridConfigured ? [] : ["SENDGRID_API_KEY"],
    },
    {
      id: "resend",
      name: "Resend",
      configured: resendConfigured,
      role: sendgridConfigured ? "fallback" : "primary",
      missing: resendConfigured ? [] : ["RESEND_API_KEY"],
    },
  ];

  providers.sort((a, b) => (a.role === "primary" ? -1 : b.role === "primary" ? 1 : 0));

  return {
    senderEmail: email,
    senderName: name,
    senderNameOverridden: overridden,
    senderConfigured: Boolean(email),
    providers,
    ready: Boolean(email) && (sendgridConfigured || resendConfigured),
  };
}

async function sendViaSendGrid(message: GridMessage): Promise<GridResult> {
  const { email, name } = sender();
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: message.to.map((address) => ({ email: address })) }],
      from: { email, name },
      reply_to: message.replyTo ? { email: message.replyTo } : undefined,
      subject: message.subject,
      content: [
        { type: "text/plain", value: message.text },
        { type: "text/html", value: message.html },
      ],
      custom_args: { idempotency_key: message.idempotencyKey, edition: "interact" },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return { ok: false, provider: "sendgrid", error: `SendGrid rejected the message (${response.status}). ${detail.slice(0, 200)}` };
  }
  return { ok: true, provider: "sendgrid", id: response.headers.get("x-message-id") };
}

async function sendViaResend(message: GridMessage): Promise<GridResult> {
  const { email, name } = sender();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": message.idempotencyKey,
    },
    body: JSON.stringify({
      from: `${name} <${email}>`,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
      tags: [{ name: "edition", value: "interact" }],
    }),
  });

  const payload = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
  if (!response.ok) {
    return {
      ok: false,
      provider: "resend",
      error: `Resend rejected the message (${response.status}). ${payload?.message ?? ""}`.trim(),
    };
  }
  return { ok: true, provider: "resend", id: payload?.id ?? null };
}

export async function sendThroughGrid(message: GridMessage): Promise<GridResult> {
  const status = getGridStatus();
  if (!status.senderConfigured) {
    return { ok: false, provider: null, error: "Sender address is not configured. Set RESEND_FROM_EMAIL." };
  }

  const route = status.providers.filter((provider) => provider.configured);
  if (route.length === 0) {
    return { ok: false, provider: null, error: "No delivery provider is configured on the grid." };
  }

  let lastError: GridResult | null = null;
  for (const provider of route) {
    const result = provider.id === "sendgrid" ? await sendViaSendGrid(message) : await sendViaResend(message);
    if (result.ok) return result;
    lastError = result;
  }
  return lastError ?? { ok: false, provider: null, error: "Delivery failed." };
}
