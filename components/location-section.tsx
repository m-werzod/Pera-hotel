import Image from "next/image";
import { Info, MapPin } from "lucide-react";
import { location, media } from "@/config/hotel";
import { getMapDestination } from "@/lib/maps";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { sectionIds } from "@/lib/navigation";
import { DirectionsLink } from "./ui/directions-link";
import { CallLink } from "./ui/call-link";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

type LocationSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

export function LocationSection({ locale, dict }: LocationSectionProps) {
  const map = getMapDestination();
  // The entrance photograph is the arrival cue while no verified pin exists:
  // a guest recognising the facade beats a map pin dropped at a guess.
  const entrancePhoto =
    media.gallery.find((item) => item.category === "entrance") ?? media.hero.image;

  return (
    <section
      id={sectionIds.location}
      className="scroll-mt-24 border-t border-sand/10 bg-ink-800 py-14 sm:py-20 lg:py-28"
    >
      <div className="container-page grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow={dict.location.eyebrow}
            heading={dict.location.heading}
            lede={dict.location.lede}
          />

          <Reveal delay={100} className="mt-8">
            <dl className="flex flex-col gap-6 border-t border-sand/12 pt-6">
              <div>
                <dt className="eyebrow mb-2">{dict.location.addressLabel}</dt>
                <dd className="flex items-start gap-2.5 text-base leading-relaxed text-ivory">
                  <MapPin
                    className="mt-1 size-4 shrink-0 text-champagne"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>
                    {location.streetAddress ? (
                      <>
                        <span className="block">{location.streetAddress[locale]}</span>
                        <span className="block text-sand-deep">{location.label[locale]}</span>
                      </>
                    ) : (
                      <>
                        <span className="block">{location.label[locale]}</span>
                        <span className="mt-1 block text-sm text-stone">
                          {dict.location.addressPending}
                        </span>
                      </>
                    )}
                  </span>
                </dd>
              </div>

              {location.arrivalNotes ? (
                <div>
                  <dt className="eyebrow mb-2">{dict.location.arrivalLabel}</dt>
                  <dd className="text-sm leading-relaxed text-sand">
                    {location.arrivalNotes[locale]}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
              <DirectionsLink
                label={dict.actions.getDirections}
                ariaLabel={dict.actions.directionsAria}
                variant="solid"
              />
              <CallLink
                label={dict.actions.callShort}
                ariaLabel={dict.actions.callAria}
                variant="outline"
              />
            </div>

            {!map.isExact ? (
              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-stone">
                <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {dict.location.mapPending}
              </p>
            ) : null}
          </Reveal>
        </div>

        <Reveal delay={140} className="lg:col-span-7">
          <a
            href={map.placeHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={dict.actions.directionsAria}
            className="group relative block aspect-4/3 overflow-hidden rounded-lg bg-ink sm:aspect-16/10 lg:aspect-4/3"
          >
            <Image
              src={entrancePhoto.src}
              alt={entrancePhoto.alt[locale]}
              fill
              loading="lazy"
              quality={78}
              sizes="(min-width: 1024px) 55vw, 100vw"
              style={{ objectPosition: entrancePhoto.objectPosition ?? "center" }}
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
            />
            <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-5 sm:p-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-sand/20 bg-ink/75 px-4 py-2 text-sm text-ivory backdrop-blur-sm">
                <MapPin className="size-4 text-champagne" strokeWidth={2} aria-hidden="true" />
                {location.label[locale]}
              </span>
              <span className="inline-flex items-center rounded-full bg-champagne px-4 py-2 text-sm font-medium text-ink transition-colors duration-300 group-hover:bg-champagne-light">
                {dict.actions.getDirections}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-sand/15 ring-inset"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
