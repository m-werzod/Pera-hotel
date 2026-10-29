import Image from "next/image";
import { MapPin } from "lucide-react";
import { brand, location, media, rooms } from "@/config/hotel";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { sectionIds } from "@/lib/navigation";
import { CallLink } from "./ui/call-link";
import { SweepLink } from "./ui/sweep-link";
import { HeroMedia } from "./hero-media";

type HeroSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

export function HeroSection({ locale, dict }: HeroSectionProps) {
  const { image, video } = media.hero;
  const secondaryTarget = rooms.length > 0 ? sectionIds.rooms : sectionIds.gallery;
  const secondaryLabel =
    rooms.length > 0 ? dict.actions.viewRooms : dict.actions.exploreHotel;

  return (
    <section
      aria-label={dict.a11y.heroLandmark}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden
                 pt-24 pb-[calc(var(--contact-bar-height)+2.5rem)] sm:pb-16 lg:min-h-[92vh] lg:justify-center"
    >
      {/* Primary visual — the poster image is always present and is the video's
          fallback, so the hero can never render empty. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={image.src}
          alt={image.alt[locale]}
          fill
          priority
          fetchPriority="high"
          quality={82}
          sizes="100vw"
          style={{ objectPosition: image.objectPosition ?? "center" }}
          className="object-cover"
        />
        {video ? <HeroMedia video={video} locale={locale} /> : null}

        {/* Contrast scrim. Two layers: a vertical wash for the text block and a
            gentle overall darkening so the champagne accents stay legible. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/35
                     lg:bg-gradient-to-r lg:from-ink lg:via-ink/75 lg:to-ink/15"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/25" />
      </div>

      <div className="container-page">
        <div className="max-w-2xl">
          <Image
            src={brand.logo.src}
            alt={dict.a11y.logoAlt}
            width={brand.logo.width}
            height={brand.logo.height}
            priority
            sizes="(min-width: 1024px) 96px, 72px"
            className="mb-5 size-14 object-contain min-[380px]:size-18 lg:mb-6 lg:size-24"
          />

          <p className="flex items-center gap-2 text-xs tracking-[0.18em] text-champagne uppercase">
            <MapPin className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            {location.label[locale]}
          </p>

          {/* Steps down on the smallest phones so a long headline does not
              push the call-to-action off the first screen. */}
          <h1 className="mt-4 font-display text-[2.05rem] leading-[1.05] font-light text-ivory min-[380px]:text-[2.6rem] sm:text-6xl sm:leading-[1.03] lg:text-7xl">
            {dict.hero.headline}
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-sand sm:text-lg">
            {dict.hero.subhead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CallLink
              label={dict.actions.call}
              ariaLabel={dict.actions.callAria}
              size="lg"
              iconStyle="badge"
            />
            <SweepLink
              href={localeHref(locale, `#${secondaryTarget}`)}
              label={secondaryLabel}
              size="lg"
            />
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
      >
        <span className="animate-scroll-hint flex flex-col items-center gap-2 text-[0.6rem] tracking-[0.3em] text-sand-deep uppercase">
          {dict.hero.scrollHint}
          <span className="h-8 w-px bg-gradient-to-b from-champagne to-transparent" />
        </span>
      </div>
    </section>
  );
}
