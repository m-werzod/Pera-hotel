import { contact } from "@/config/hotel";

/**
 * Pulls the Telegram handle out of the configured social links, so the
 * booking deep link and the footer link can never drift apart.
 *
 * Returns the bare username (no `@`, no URL), or null when no Telegram
 * account is configured — callers then hide the Telegram route rather than
 * building a link to nowhere.
 */
export function getTelegramHandle(): string | null {
  const entry = contact.social.find((item) => item.id === "telegram");
  if (!entry) return null;

  const match = entry.href.match(/t\.me\/(?:@)?([A-Za-z0-9_]{3,})/);
  return match?.[1] ?? null;
}
