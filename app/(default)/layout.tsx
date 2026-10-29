import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { RootShell } from "../root-shell";
import { buildMetadata } from "@/lib/metadata";
import { defaultLocale } from "@/lib/i18n/config";
import "../globals.css";

export const viewport: Viewport = {
  themeColor: "#14120e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // Never block pinch-zoom; some guests rely on it to read.
  maximumScale: 5,
};

export const metadata: Metadata = {
  ...buildMetadata(defaultLocale),
  icons: {
    icon: [{ url: "/images/brand/pera-hotel-logo.png", type: "image/png" }],
    apple: [{ url: "/images/brand/pera-hotel-logo.png" }],
  },
};

/** Root layout for the default locale, served at `/`. */
export default function DefaultLocaleLayout({ children }: { children: ReactNode }) {
  return <RootShell locale={defaultLocale}>{children}</RootShell>;
}
