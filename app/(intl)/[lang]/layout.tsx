import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { RootShell } from "../../root-shell";
import { buildMetadata } from "@/lib/metadata";
import { defaultLocale, isLocale, secondaryLocales } from "@/lib/i18n/config";
import "../../globals.css";

type Params = { lang: string };

export const viewport: Viewport = {
  themeColor: "#14120e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/** Only `/ru` and `/en` exist — the default locale lives at `/`. */
export function generateStaticParams(): Params[] {
  return secondaryLocales.map((lang) => ({ lang }));
}

/** Anything outside the generated params is a 404, not a rendered page. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;

  return {
    ...buildMetadata(locale),
    icons: {
      icon: [{ url: "/images/brand/pera-hotel-logo.png", type: "image/png" }],
      apple: [{ url: "/images/brand/pera-hotel-logo.png" }],
    },
  };
}

/** Root layout for the non-default locales, served at `/ru` and `/en`. */
export default async function IntlLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();

  return <RootShell locale={lang}>{children}</RootShell>;
}
