import { facilities } from "@/config/hotel";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { sectionIds } from "@/lib/navigation";
import { Icon } from "./ui/icon";
import { SectionHeading } from "./ui/section-heading";
import { Reveal } from "./ui/reveal";

type FacilitiesSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

/** Hidden until the owner confirms which services the hotel actually offers. */
export function FacilitiesSection({ locale, dict }: FacilitiesSectionProps) {
  if (facilities.length === 0) return null;

  return (
    <section
      id={sectionIds.facilities}
      className="scroll-mt-24 border-t border-sand/10 bg-ink-800 py-14 sm:py-20 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.facilities.eyebrow}
          heading={dict.facilities.heading}
          lede={dict.facilities.lede}
        />

        <ul className="mt-8 grid sm:mt-10 grid-cols-2 gap-px overflow-hidden rounded-lg border border-sand/12 bg-sand/12 lg:mt-12 lg:grid-cols-4">
          {facilities.map((facility, index) => (
            <li key={facility.id}>
              <Reveal delay={index * 70} className="h-full">
                <div className="flex h-full flex-col gap-3 bg-ink-800 p-5 sm:p-6">
                  <Icon name={facility.icon} className="size-6 text-champagne" />
                  <h3 className="font-sans text-sm font-medium text-ivory sm:text-base">
                    {facility.name[locale]}
                  </h3>
                  {facility.description ? (
                    <p className="text-sm leading-relaxed text-sand-deep">
                      {facility.description[locale]}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
