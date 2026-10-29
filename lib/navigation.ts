import { facilities, highlights, media, rooms } from "@/config/hotel";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export type NavItem = { id: string; href: string; label: string };

export const sectionIds = {
  about: "about",
  gallery: "gallery",
  rooms: "rooms",
  facilities: "facilities",
  booking: "booking",
  highlights: "why",
  location: "location",
  contact: "contact",
} as const;

/**
 * Navigation is derived from what is actually configured, so a link never
 * points at a section that chose to hide itself.
 */
export function getNavItems(locale: Locale, dict: Dictionary): NavItem[] {
  const items: Omit<NavItem, "href">[] = [
    { id: sectionIds.about, label: dict.nav.about },
  ];

  if (media.gallery.length > 0 || media.videos.length > 0) {
    items.push({ id: sectionIds.gallery, label: dict.nav.gallery });
  }
  if (rooms.length > 0) {
    items.push({ id: sectionIds.rooms, label: dict.nav.rooms });
  }
  if (facilities.length > 0) {
    items.push({ id: sectionIds.facilities, label: dict.nav.facilities });
  }

  // Booking is always present — it needs no configured data to work.
  items.push({ id: sectionIds.booking, label: dict.nav.booking });

  items.push(
    { id: sectionIds.location, label: dict.nav.location },
    { id: sectionIds.contact, label: dict.nav.contact },
  );

  return items.map((item) => ({ ...item, href: localeHref(locale, `#${item.id}`) }));
}

export const hasHighlights = highlights.length > 0;
