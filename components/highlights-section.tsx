import { highlights } from "@/config/hotel";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { sectionIds } from "@/lib/navigation";
import { Icon } from "./ui/icon";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

type HighlightsSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

/**
 * Deliberately short. It only carries claims the hotel can stand behind —
 * no review scores, guest counts, awards or superlatives. Extend
 * `highlights` in `config/hotel.ts` once the owner supplies real
 * differentiators.
 */
export function HighlightsSection({ locale, dict }: HighlightsSectionProps) {
  if (highlights.length === 0) return null;

  return (
    <section
      id={sectionIds.highlights}
      className="scroll-mt-24 border-t border-sand/10 bg-ink py-14 sm:py-20 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.highlights.eyebrow}
          heading={dict.highlights.heading}
          align="center"
        />

        <ul className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-14">
          {highlights.map((highlight, index) => (
            <li key={highlight.id}>
              <Reveal delay={index * 90} className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-lg border border-sand/12 bg-ink-800 p-6 sm:p-7">
                  <span className="inline-flex size-11 items-center justify-center rounded-full border border-champagne/30 bg-champagne/8 text-champagne">
                    <Icon name={highlight.icon} className="size-5" />
                  </span>
                  <h3 className="font-display text-xl font-light text-ivory sm:text-2xl">
                    {highlight.title[locale]}
                  </h3>
                  <p className="text-sm leading-relaxed text-sand-deep sm:text-base">
                    {highlight.body[locale]}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
