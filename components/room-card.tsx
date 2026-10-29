import Image from "next/image";
import { Check, Users } from "lucide-react";
import type { Room } from "@/config/hotel";
import type { Locale } from "@/lib/i18n/config";
import { fmt, type Dictionary } from "@/lib/i18n/dictionaries";
import { CallLink } from "./ui/call-link";

type RoomCardProps = {
  room: Room;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
};

const priceFormatters: Record<"UZS" | "USD", Intl.NumberFormat> = {
  UZS: new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }),
};

/**
 * Renders only what is configured. Capacity, price, amenities and the
 * description each disappear when absent rather than showing a placeholder —
 * a guest must never read an invented rate or bed count.
 */
export function RoomCard({ room, locale, dict, priority = false }: RoomCardProps) {
  const cover = room.images[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-sand/12 bg-ink">
      {cover ? (
        <div className="relative aspect-3/2 overflow-hidden bg-ink-800">
          <Image
            src={cover.src}
            alt={cover.alt[locale]}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            quality={76}
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
            style={{ objectPosition: cover.objectPosition ?? "center" }}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-display text-2xl font-light text-ivory">{room.name[locale]}</h3>

          {room.price ? (
            <p className="text-sm text-champagne">
              <span className="font-medium tabular-nums">
                {priceFormatters[room.price.currency].format(room.price.amount)}
              </span>
              <span className="text-sand-deep"> / {dict.rooms.perNight}</span>
            </p>
          ) : (
            <p className="text-sm text-sand-deep">{dict.rooms.priceOnRequest}</p>
          )}
        </div>

        {room.capacity !== null ? (
          <p className="flex items-center gap-2 text-sm text-sand-deep">
            <Users className="size-4 text-champagne" strokeWidth={1.75} aria-hidden="true" />
            {fmt(dict.rooms.guests, { count: room.capacity })}
          </p>
        ) : null}

        {room.description ? (
          <p className="text-sm leading-relaxed text-sand">{room.description[locale]}</p>
        ) : null}

        {room.amenities.length > 0 ? (
          <div>
            <h4 className="eyebrow mb-2.5">{dict.rooms.amenitiesLabel}</h4>
            <ul className="flex flex-col gap-1.5">
              {room.amenities.map((amenity, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-sand-deep">
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-champagne"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  {amenity[locale]}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-auto pt-2">
          <CallLink
            label={dict.actions.inquireByPhone}
            ariaLabel={`${room.name[locale]} — ${dict.actions.callAria}`}
            variant="outline"
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}
