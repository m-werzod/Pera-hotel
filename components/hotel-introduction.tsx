import Image from "next/image";
import { intro, media } from "@/config/hotel";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { sectionIds } from "@/lib/navigation";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";
import { CallLink } from "./ui/call-link";

type HotelIntroductionProps = {
  locale: Locale;
  dict: Dictionary;
};

export function HotelIntroduction({ locale, dict }: HotelIntroductionProps) {
  // Only show an accent image if it is genuinely a different photograph from
  // the hero. With a single supplied image, repeating it here would make the
  // page look padded rather than considered.
  const accent =
    media.gallery.find((item) => item.src !== media.hero.image.src) ?? null;

  return (
    <section
      id={sectionIds.about}
      className="scroll-mt-24 border-t border-sand/10 bg-ink py-14 sm:py-20 lg:py-32"
    >
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className={accent ? "lg:col-span-7" : "lg:col-span-9"}>
          <SectionHeading eyebrow={intro.eyebrow[locale]} heading={intro.heading[locale]} />

          <div className="mt-8 flex flex-col gap-5">
            {intro.body.map((paragraph, index) => (
              <Reveal key={index} delay={80 * (index + 1)}>
                <p className="max-w-xl text-base leading-[1.75] text-sand sm:text-lg">
                  {paragraph[locale]}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={240} className="mt-9">
            <CallLink
              label={dict.actions.call}
              ariaLabel={dict.actions.callAria}
              variant="outline"
            />
          </Reveal>
        </div>

        {accent ? (
          <Reveal delay={120} className="lg:col-span-5">
            <figure className="relative aspect-4/5 overflow-hidden rounded-lg">
              <Image
                src={accent.src}
                alt={accent.alt[locale]}
                fill
                loading="lazy"
                quality={78}
                sizes="(min-width: 1024px) 38vw, 100vw"
                style={{ objectPosition: accent.objectPosition ?? "center" }}
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-sand/15 ring-inset"
              />
            </figure>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
