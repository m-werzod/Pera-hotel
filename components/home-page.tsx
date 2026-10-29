import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNavItems } from "@/lib/navigation";
import { BookingSection } from "./booking-section";
import { ConfigNotice } from "./config-notice";
import { ContactSection } from "./contact-section";
import { FacilitiesSection } from "./facilities-section";
import { GallerySection } from "./gallery-section";
import { HeroSection } from "./hero-section";
import { HighlightsSection } from "./highlights-section";
import { HotelIntroduction } from "./hotel-introduction";
import { LocationSection } from "./location-section";
import { RoomsSection } from "./rooms-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { StickyCall } from "./sticky-call";
import { StructuredData } from "./structured-data";

type HomePageProps = {
  locale: Locale;
};

/**
 * One page composition, rendered at `/`, `/ru` and `/en`.
 *
 * Every section below decides for itself whether it has enough configured
 * data to render, so the page stays coherent at any stage of the owner's
 * asset handover.
 */
export function HomePage({ locale }: HomePageProps) {
  const dict = getDictionary(locale);
  const navItems = getNavItems(locale, dict);

  return (
    <>
      <StructuredData locale={locale} />

      <a
        href="#main"
        className="sr-only rounded-full bg-champagne px-5 py-3 text-sm font-medium text-ink
                   focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100"
      >
        {dict.nav.skipToContent}
      </a>

      <SiteHeader locale={locale} dict={dict} navItems={navItems} />

      <main id="main" aria-label={dict.a11y.mainLandmark}>
        <HeroSection locale={locale} dict={dict} />
        <HotelIntroduction locale={locale} dict={dict} />
        <GallerySection locale={locale} dict={dict} />
        <RoomsSection locale={locale} dict={dict} />
        <FacilitiesSection locale={locale} dict={dict} />
        <BookingSection locale={locale} dict={dict} />
        <HighlightsSection locale={locale} dict={dict} />
        <LocationSection locale={locale} dict={dict} />
        <ContactSection locale={locale} dict={dict} />
      </main>

      <SiteFooter locale={locale} dict={dict} navItems={navItems} />

      <StickyCall dict={dict} />
      <ConfigNotice
        bookingDeliveryConfigured={Boolean(
          process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
        )}
      />
    </>
  );
}
