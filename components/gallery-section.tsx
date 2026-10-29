"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { getRailItems } from "@/lib/media";
import { sectionIds } from "@/lib/navigation";
import { MediaRail } from "./media-rail";
import { MediaLightbox } from "./media-lightbox";
import { SectionHeading } from "./ui/section-heading";
import { Reveal } from "./ui/reveal";

type GallerySectionProps = {
  locale: Locale;
  dict: Dictionary;
};

/** Hides itself entirely when no media has been supplied. */
export function GallerySection({ locale, dict }: GallerySectionProps) {
  const items = getRailItems();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const close = () => {
    const index = openIndex;
    setOpenIndex(null);
    // Return focus to the tile that opened the viewer.
    if (index !== null) {
      requestAnimationFrame(() => {
        railRef.current
          ?.querySelectorAll<HTMLButtonElement>("li button")
          [index]?.focus({ preventScroll: true });
      });
    }
  };

  return (
    <section
      id={sectionIds.gallery}
      className="scroll-mt-24 overflow-hidden border-t border-sand/10 bg-ink-800 py-14 sm:py-20 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.gallery.eyebrow}
          heading={dict.gallery.heading}
          lede={dict.gallery.lede}
        />

        <Reveal delay={100} className="mt-8 sm:mt-12">
          <div ref={railRef}>
            <MediaRail items={items} locale={locale} dict={dict} onOpen={setOpenIndex} />
          </div>
        </Reveal>
      </div>

      {openIndex !== null ? (
        <MediaLightbox
          items={items}
          index={openIndex}
          locale={locale}
          dict={dict}
          onClose={close}
          onNavigate={setOpenIndex}
        />
      ) : null}
    </section>
  );
}
