/**
 * Deployment-level configuration. Everything here is about *where the site
 * lives*, not about the hotel itself (that is `config/hotel.ts`).
 */

/**
 * Production origin, no trailing slash. Used for canonical URLs, Open Graph,
 * the sitemap and robots.txt.
 *
 * TODO(owner): set NEXT_PUBLIC_SITE_URL in the hosting environment once the
 * real domain is registered. The fallback below is only a placeholder so that
 * local builds produce valid absolute URLs.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://perahotel.uz"
).replace(/\/+$/, "");

export const isSiteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

/** Google Search Console / analytics IDs go here when they exist. */
export const verification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? null,
} as const;

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
