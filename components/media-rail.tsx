"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { RailItem } from "@/lib/media";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type MediaRailProps = {
  items: RailItem[];
  locale: Locale;
  dict: Dictionary;
  onOpen: (index: number) => void;
};

/**
 * Horizontally scrolling media rail.
 *
 * Scrolling is native `overflow-x` with CSS scroll snapping, so touch flicks,
 * trackpad swipes, shift+wheel and the arrow buttons all work without a
 * carousel library or any JavaScript gesture handling. Each tile is a real
 * button, so Tab moves through them and the browser scrolls the focused tile
 * into view on its own.
 *
 * The arrows are a desktop affordance only — they are hidden on touch widths,
 * where swiping is the natural gesture — and they disable themselves at each
 * end rather than looping, so the rail never feels like it lost your place.
 */
export function MediaRail({ items, locale, dict, onOpen }: MediaRailProps) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // 2px of slack: sub-pixel widths otherwise leave the end arrow enabled.
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges, items.length]);

  const scrollByTile = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const tile = el.querySelector("li");
    const step = tile ? tile.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  const arrowClass =
    "inline-flex size-11 items-center justify-center rounded-full border border-sand/25 " +
    "bg-ink-800/80 text-ivory backdrop-blur-sm transition-[color,border-color,opacity] " +
    "duration-300 hover:border-champagne hover:text-champagne-light " +
    "disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="relative">
      {/* Desktop arrows. Hidden where swiping is the natural gesture. */}
      <div className="mb-5 hidden justify-end gap-2 md:flex">
        <button
          type="button"
          onClick={() => scrollByTile(-1)}
          disabled={atStart}
          aria-label={dict.gallery.rail.previous}
          className={arrowClass}
        >
          <ChevronLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByTile(1)}
          disabled={atEnd}
          aria-label={dict.gallery.rail.next}
          className={arrowClass}
        >
          <ChevronRight className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <ul
        ref={scrollerRef}
        onScroll={updateEdges}
        aria-label={dict.gallery.rail.label}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5
                   pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0
                   [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className="w-[70vw] max-w-[280px] shrink-0 snap-start sm:w-[244px] lg:w-[268px]"
          >
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={`${item.kind === "video" ? dict.actions.playVideo : dict.actions.openGallery} — ${item.alt[locale]}`}
              className="group relative block w-full overflow-hidden rounded-xl bg-ink-800"
              style={{ aspectRatio: "9 / 16" }}
            >
              <Image
                src={item.kind === "video" ? item.poster : item.src}
                alt={item.alt[locale]}
                fill
                loading={index < 2 ? "eager" : "lazy"}
                quality={72}
                sizes="(min-width: 1024px) 268px, (min-width: 640px) 244px, 70vw"
                style={{
                  objectPosition: item.kind === "image" ? item.objectPosition : undefined,
                }}
                className="object-cover transition-transform duration-[900ms]
                           ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />

              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent"
              />

              {item.kind === "video" ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 inline-flex size-14 -translate-x-1/2
                             -translate-y-1/2 items-center justify-center rounded-full
                             border border-ivory/35 bg-ink/40 text-ivory backdrop-blur-sm
                             transition-[transform,background-color,border-color,color]
                             duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                             group-hover:scale-110 group-hover:border-champagne
                             group-hover:bg-champagne group-hover:text-ink"
                >
                  <Play className="ml-0.5 size-5 fill-current" strokeWidth={1.5} />
                </span>
              ) : null}

              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-left">
                {item.caption ? (
                  <span className="text-sm leading-snug font-medium text-ivory">
                    {item.caption[locale]}
                  </span>
                ) : null}
                {item.credit ? (
                  <span className="text-[0.65rem] tracking-wide text-sand-deep/90">
                    {dict.gallery.rail.creditPrefix} {item.credit}
                  </span>
                ) : null}
              </span>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-sand/15 ring-inset"
              />
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-stone md:hidden">{dict.gallery.rail.swipeHint}</p>
    </div>
  );
}
