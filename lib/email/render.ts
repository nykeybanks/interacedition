import { qyxBrandAssets } from "@/lib/brand";
import type { EmailFields, FooterPattern } from "./templates";

const palette = {
  void: "#000000",
  space: "#0A0A0A",
  charcoal: "#121212",
  graphite: "#1A1A1A",
  platinum: "#ECECEC",
  silver: "#C0C0C0",
  muted: "#8A8A8A",
  gold: "#C9A86A",
  champagne: "#E6C7A0",
  rule: "#262626",
} as const;

const fontDisplay = "'Orbitron', 'Segoe UI', Arial, sans-serif";
const fontBody = "'Exo 2', 'Segoe UI', Arial, sans-serif";
const fontUi = "'Inter', 'Segoe UI', Arial, sans-serif";
const fontMono = "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace";

export type MergeValues = Record<string, string>;

export const defaultMergeValues: MergeValues = {
  name: "Avery",
  reference: "QYX-20-48213",
  amount: "Sandbox amount",
  date: "28 Oct 2026, 14:20 UTC",
  device: "Mobile · Safari",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function applyMerge(value: string, merge: MergeValues) {
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => merge[key] ?? match);
}

function safeUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "mailto:"
      ? parsed.toString()
      : "#";
  } catch {
    return "#";
  }
}

const PATTERN_CELLS = 24;

function patternCellColor(pattern: FooterPattern, index: number) {
  if (pattern === "gridline") {
    if (index === 3) return palette.gold;
    return index % 2 === 0 ? palette.graphite : palette.charcoal;
  }
  if (pattern === "lattice") {
    if (index === 0 || index === PATTERN_CELLS - 1) return palette.gold;
    return index % 3 === 0 ? palette.rule : index % 2 === 0 ? palette.graphite : palette.charcoal;
  }
  const step = Math.floor((index / PATTERN_CELLS) * 4);
  if (index === PATTERN_CELLS - 1) return palette.gold;
  return [palette.charcoal, palette.graphite, palette.rule, "#333333"][step];
}

export function renderPatternRow(pattern: FooterPattern, height = 6) {
  const cells = Array.from({ length: PATTERN_CELLS }, (_, index) => {
    const color = patternCellColor(pattern, index);
    return `<td width="${(100 / PATTERN_CELLS).toFixed(3)}%" height="${height}" style="height:${height}px;background-color:${color};font-size:0;line-height:0;border-right:1px solid ${palette.void};">&nbsp;</td>`;
  }).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;table-layout:fixed;"><tr>${cells}</tr></table>`;
}

function paragraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin:0 0 16px 0;font-family:${fontBody};font-size:16px;line-height:26px;color:${palette.silver};">${escapeHtml(block).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

function detailTable(rows: EmailFields["detailRows"]) {
  const filled = rows.filter((row) => row.label.trim() || row.value.trim());
  if (filled.length === 0) return "";
  const body = filled
    .map(
      (row, index) => `<tr>
  <td style="padding:12px 16px;${index > 0 ? `border-top:1px solid ${palette.rule};` : ""}font-family:${fontMono};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${palette.muted};">${escapeHtml(row.label)}</td>
  <td align="right" style="padding:12px 16px;${index > 0 ? `border-top:1px solid ${palette.rule};` : ""}font-family:${fontMono};font-size:13px;color:${palette.platinum};">${escapeHtml(row.value)}</td>
</tr>`,
    )
    .join("");
  return `<table role="presentation" class="qyx-ledger" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid ${palette.rule};background-color:${palette.space};margin:8px 0 24px 0;">${body}</table>`;
}

export type RenderOptions = {
  fields: EmailFields;
  merge?: MergeValues;
  baseUrl: string;
  senderName?: string;
};

export function renderEmail({ fields, merge = defaultMergeValues, baseUrl, senderName = "QuantumYield" }: RenderOptions) {
  const m = (value: string) => applyMerge(value, merge);
  const origin = baseUrl.replace(/\/$/, "");
  const mark = qyxBrandAssets[fields.productMark];
  const emblem = qyxBrandAssets.emblem;
  const markWidth = Math.min(160, mark.width);
  const markHeight = Math.round((mark.height / mark.width) * markWidth);
  const emblemWidth = 54;
  const emblemHeight = Math.round((emblem.height / emblem.width) * emblemWidth);
  const year = new Date().getFullYear();

  const subject = m(fields.subject);
  const detailRows = fields.detailRows.map((row) => ({ label: m(row.label), value: m(row.value) }));
  const ctaUrl = safeUrl(m(fields.ctaUrl));
  const preferencesUrl = fields.preferencesUrl.trim() ? safeUrl(m(fields.preferencesUrl)) : "";
  const address = fields.mailingAddress.trim();

  const cta = fields.ctaLabel.trim()
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 8px 0;"><tr>
  <td style="background-color:${palette.gold};border-radius:4px;">
    <a href="${escapeHtml(ctaUrl)}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${fontUi};font-size:14px;font-weight:600;letter-spacing:0.5px;color:${palette.space};text-decoration:none;">${escapeHtml(m(fields.ctaLabel))}</a>
  </td></tr></table>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>${escapeHtml(subject)}</title>
<style>
  @media only screen and (max-width: 620px) {
    .qyx-container { width: 100% !important; }
    .qyx-pad { padding-left: 20px !important; padding-right: 20px !important; }
    .qyx-outer { padding: 16px 8px !important; }
    .qyx-ledger td { padding-left: 12px !important; padding-right: 12px !important; }
    .qyx-headline { font-size: 24px !important; line-height: 32px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${palette.void};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${palette.void};">${escapeHtml(m(fields.preheader))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${palette.void};">
<tr><td align="center" class="qyx-outer" style="padding:32px 12px;">
  <table role="presentation" class="qyx-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${palette.charcoal};border:1px solid ${palette.rule};">
    <tr><td class="qyx-pad" style="padding:28px 40px 24px 40px;border-bottom:1px solid ${palette.rule};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td align="left" valign="middle"><img src="${origin}${mark.src}" width="${markWidth}" height="${markHeight}" alt="${escapeHtml(mark.alt)}" style="display:block;border:0;outline:none;width:${markWidth}px;height:${markHeight}px;" /></td>
        <td align="right" valign="middle" style="font-family:${fontMono};font-size:10px;letter-spacing:2px;color:${palette.muted};text-transform:uppercase;">Interact</td>
      </tr></table>
    </td></tr>
    <tr><td class="qyx-pad" style="padding:40px 40px 8px 40px;">
      <p style="margin:0 0 16px 0;font-family:${fontMono};font-size:11px;letter-spacing:2.5px;color:${palette.gold};text-transform:uppercase;">${escapeHtml(m(fields.eyebrow))}</p>
      <h1 class="qyx-headline" style="margin:0 0 24px 0;font-family:${fontDisplay};font-size:30px;line-height:38px;font-weight:600;color:${palette.platinum};letter-spacing:0.5px;">${escapeHtml(m(fields.headline))}</h1>
      <p style="margin:0 0 16px 0;font-family:${fontBody};font-size:16px;line-height:26px;color:${palette.platinum};">${escapeHtml(m(fields.greeting))}</p>
      ${paragraphs(m(fields.body))}
      ${detailTable(detailRows)}
      ${cta}
    </td></tr>
    <tr><td class="qyx-pad" style="padding:32px 40px 0 40px;">
      <p style="margin:0;font-family:${fontBody};font-size:14px;line-height:22px;color:${palette.muted};">— ${escapeHtml(senderName)}</p>
    </td></tr>
    <tr><td style="padding:40px 0 0 0;">${renderPatternRow(fields.footerPattern)}</td></tr>
    <tr><td class="qyx-pad" style="padding:28px 40px 32px 40px;background-color:${palette.space};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="top" width="${emblemWidth + 16}" style="padding-right:16px;"><img src="${origin}${emblem.src}" width="${emblemWidth}" height="${emblemHeight}" alt="${escapeHtml(emblem.alt)}" style="display:block;border:0;width:${emblemWidth}px;height:${emblemHeight}px;" /></td>
        <td valign="top" style="font-family:${fontUi};font-size:12px;line-height:19px;color:${palette.muted};">
          <p style="margin:0 0 6px 0;font-family:${fontDisplay};font-size:11px;letter-spacing:2px;color:${palette.silver};text-transform:uppercase;">QuantumYield · QYX20 Interact Edition</p>
          <p style="margin:0 0 6px 0;">You are receiving this message because you have a QYX account or requested updates from QuantumYield. QYX will never ask for your password, PIN, or security answers by email.</p>
          ${address ? `<p style="margin:0 0 6px 0;">${escapeHtml(address)}</p>` : ""}
          <p style="margin:0;">${preferencesUrl ? `<a href="${escapeHtml(preferencesUrl)}" style="color:${palette.champagne};text-decoration:underline;">Manage preferences</a> · ` : ""}&copy; ${year} QuantumYield</p>
        </td>
      </tr></table>
    </td></tr>
    <tr><td>${renderPatternRow(fields.footerPattern, 3)}</td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    m(fields.eyebrow),
    "",
    m(fields.headline),
    "",
    m(fields.greeting),
    "",
    m(fields.body),
    "",
    ...detailRows.filter((row) => row.label || row.value).map((row) => `${row.label}: ${row.value}`),
    "",
    fields.ctaLabel ? `${m(fields.ctaLabel)}: ${ctaUrl}` : "",
    "",
    `— ${senderName}`,
    "",
    "QuantumYield · QYX20 Interact Edition",
    "QYX will never ask for your password, PIN, or security answers by email.",
    address,
    preferencesUrl ? `Manage preferences: ${preferencesUrl}` : "",
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n");

  return { subject, html, text };
}
