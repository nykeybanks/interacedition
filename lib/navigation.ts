import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Hand,
  LayoutGrid,
  Mail,
  Network,
  PenSquare,
  Settings2,
  Orbit,
} from "lucide-react";

export type NavStatus = "Live" | "Concept" | "Planned";

export type NavLink = {
  id: string;
  label: string;
  href: string;
  description: string;
  status: NavStatus;
  keywords?: string[];
};

export type NavSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  summary: string;
  links: NavLink[];
};

export const navSections: NavSection[] = [
  {
    id: "command",
    label: "Command",
    icon: LayoutGrid,
    summary: "Edition overview and system readiness.",
    links: [
      {
        id: "home",
        label: "Overview",
        href: "/",
        description: "Interact Edition control surface and module index.",
        status: "Live",
        keywords: ["home", "dashboard", "start"],
      },
      {
        id: "grid",
        label: "Delivery Grid",
        href: "/grid",
        description: "Provider routing, sender identity, and configuration readiness.",
        status: "Live",
        keywords: ["sendgrid", "resend", "provider", "delivery"],
      },
    ],
  },
  {
    id: "studio",
    label: "Email Studio",
    icon: Mail,
    summary: "Compose, preview, and send Interact-branded email.",
    links: [
      {
        id: "compose",
        label: "Compose",
        href: "/studio",
        description: "Edit content, preview across devices, and send through the grid.",
        status: "Live",
        keywords: ["write", "email", "send", "editor"],
      },
      {
        id: "templates",
        label: "Template Library",
        href: "/studio/templates",
        description: "Interact templates with the QYX gridline pattern footer.",
        status: "Live",
        keywords: ["layouts", "footer", "pattern"],
      },
    ],
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    icon: Orbit,
    summary: "QuantumYield product lines referenced by this edition.",
    links: [
      {
        id: "ecosystem-index",
        label: "Product Lines",
        href: "/ecosystem",
        description: "QYX20, QYXpay, QYXos, and QYXai — status shown per product.",
        status: "Concept",
        keywords: ["qyx20", "qyxpay", "qyxos", "qyxai"],
      },
    ],
  },
  {
    id: "system",
    label: "System",
    icon: Settings2,
    summary: "Motion, haptics, and gesture preferences.",
    links: [
      {
        id: "settings",
        label: "Preferences",
        href: "/settings",
        description: "Immersive, Balanced, or Reduced motion and touch feedback.",
        status: "Live",
        keywords: ["motion", "haptics", "preferences"],
      },
      {
        id: "gestures",
        label: "Gesture Guide",
        href: "/settings#gestures",
        description: "Swipe, long-press, and keyboard shortcuts for navigation.",
        status: "Live",
        keywords: ["touch", "swipe", "shortcuts", "keyboard"],
      },
    ],
  },
];

export const dockLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Overview", icon: Activity },
  { href: "/studio", label: "Compose", icon: PenSquare },
  { href: "/grid", label: "Grid", icon: Network },
  { href: "/settings", label: "Touch", icon: Hand },
];

export const allNavLinks = navSections.flatMap((section) =>
  section.links.map((link) => ({ ...link, sectionId: section.id, sectionLabel: section.label })),
);

export function findActiveLink(pathname: string) {
  return (
    allNavLinks.find((link) => link.href === pathname) ??
    allNavLinks.find((link) => link.href !== "/" && pathname.startsWith(link.href))
  );
}
