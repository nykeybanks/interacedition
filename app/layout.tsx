import type { Metadata, Viewport } from "next";
import { Exo_2, Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import { PreferencesProvider } from "@/components/providers/preferences-provider";
import { AppShell } from "@/components/shell/app-shell";
import "./globals.css";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const exo = Exo_2({ subsets: ["latin"], variable: "--font-exo", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: { default: "QYX20 Interact Edition", template: "%s · QYX20 Interact" },
  description:
    "QYX20 Interact Edition by QuantumYield — full-screen navigation, touch gestures, and an Email Studio that sends branded email through the delivery grid.",
  applicationName: "QYX20 Interact",
  manifest: "/manifest.json",
  icons: { icon: "/brand/q-emblem-silver-metallic.png", apple: "/brand/q-emblem-silver-metallic.png" },
  appleWebApp: { capable: true, title: "QYX20 Interact", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-motion="balanced"
      className={`bg-background ${orbitron.variable} ${inter.variable} ${exo.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans">
        <PreferencesProvider>
          <AppShell>{children}</AppShell>
        </PreferencesProvider>
      </body>
    </html>
  );
}
