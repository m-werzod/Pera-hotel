import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { localeMeta, type Locale } from "@/lib/i18n/config";

/**
 * Display serif for headings. Cyrillic is included so Russian headings render
 * in the same typeface instead of falling back to a system serif.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-cormorant",
  preload: true,
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

/**
 * The shared `<html>` / `<body>` shell.
 *
 * There is one root layout per locale (see `app/(default)` and `app/(intl)`)
 * purely so that `<html lang>` is correct in the server-rendered HTML — which
 * is what screen readers and search engines read. Everything else about the
 * shell lives here, once.
 */
export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <html
      lang={localeMeta[locale].htmlLang}
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <head>
        {/* Scroll-reveal is an enhancement only: without JavaScript nothing
            may stay hidden, so force every revealed element visible. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: "[data-reveal]{opacity:1 !important;transform:none !important}",
            }}
          />
        </noscript>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
