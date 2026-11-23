import type { Metadata, Viewport } from "next";
import { qyxFontVariables } from "@/lib/qyx-fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interac Edition — QYX20",
  description: "Interac Edition for QYX20. Concept preview.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={qyxFontVariables}>
      <body className="qyx-root">{children}</body>
    </html>
  );
}
