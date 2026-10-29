import { rooms } from "@/config/hotel";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { sectionIds } from "@/lib/navigation";
import { RoomCard } from "./room-card";
import { SectionHeading } from "./ui/section-heading";
import { Reveal } from "./ui/reveal";

type RoomsSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

/**
 * Hidden until the owner confirms real room categories in `config/hotel.ts`.
 * An empty rooms grid is worse than no section at all, and inventing
 * categories is not an option.
 */
export function RoomsSection({ locale, dict }: RoomsSectionProps) {
  if (rooms.length === 0) return null;

  return (
    <section
      id={sectionIds.rooms}
      className="scroll-mt-24 border-t border-sand/10 bg-ink py-14 sm:py-20 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.rooms.eyebrow}
          heading={dict.rooms.heading}
          lede={dict.rooms.lede}
        />

        <ul className="mt-8 grid sm:mt-10 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <li key={room.id} className="h-full">
              <Reveal delay={index * 90} className="h-full">
                <RoomCard room={room} locale={locale} dict={dict} priority={index === 0} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
