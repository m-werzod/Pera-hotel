"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { RailItem } from "@/lib/media";
import type { Locale } from "@/lib/i18n/config";
import { fmt, type Dictionary } from "@/lib/i18n/dictionaries";

type MediaLightboxProps = {
  items: RailItem[];
  index: number;
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

const SWIPE_THRESHOLD_PX = 48;

/**
 * Full-screen viewer for both photographs and clips.
 *
 * Modal dialog semantics throughout: focus moves in on open and is trapped,
 * Escape and the backdrop close it, arrow keys page through, and touch swipes
 * work. A clip starts playing with sound on open — opening it is a deliberate
 * act, so nothing autoplays silently behind the visitor's back — and is torn
 * down when paging away so audio never continues over a different item.
 */
export function MediaLightbox({
  items,
  index,
  locale,
  dict,
  onClose,
  onNavigate,
}: MediaLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [mediaError, setMediaError] = useState(false);

  const total = items.length;
  const current = items[index];

  const goTo = useCallback(
    (delta: number) => {
      setMediaError(false);
      onNavigate((index + delta + total) % total);
    },
    [index, total, onNavigate],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case "ArrowRight":
          event.preventDefault();
          goTo(1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          goTo(-1);
          break;
        case "Tab": {
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
          if (!focusable || focusable.length === 0) return;
          const first = focusable[0]!;
          const last = focusable[focusable.length - 1]!;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [goTo, onClose]);

  // Start playback whenever a clip becomes the current item.
  useEffect(() => {
    if (current?.kind !== "video") return;
    const node = videoRef.current;
    if (!node) return;
    node.play().catch(() => {
      /* Blocked autoplay simply leaves the controls for the visitor. */
    });
  }, [current]);

  if (!current) return null;

  const controlClass =
    "inline-flex size-12 items-center justify-center rounded-full border border-sand/25 " +
    "bg-ink/70 text-ivory backdrop-blur-sm transition-colors duration-200 " +
    "hover:border-champagne hover:text-champagne-light";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={dict.gallery.lightbox.title}
      className="fixed inset-0 z-100 flex flex-col bg-ink/97 backdrop-blur-md"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start === null || end === undefined || total < 2) return;
        const delta = end - start;
        if (Math.abs(delta) > SWIPE_THRESHOLD_PX) goTo(delta < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 sm:px-6">
        <p aria-live="polite" className="text-sm tabular-nums text-sand-deep">
          {fmt(dict.gallery.lightbox.counter, { current: index + 1, total })}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.gallery.lightbox.close}
          className={controlClass}
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
        {mediaError ? (
          <p className="max-w-sm text-center text-sm text-sand-deep">{current.alt[locale]}</p>
        ) : current.kind === "video" ? (
          <video
            // `key` forces a fresh element per clip, which stops the previous
            // one's audio dead instead of letting it bleed into the next.
            key={current.src}
            ref={videoRef}
            src={current.src}
            poster={current.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={current.alt[locale]}
            onError={() => setMediaError(true)}
            className="max-h-full w-auto max-w-full rounded-lg bg-ink"
          />
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt[locale]}
            width={current.width}
            height={current.height}
            quality={88}
            sizes="(min-width: 640px) 90vw, 100vw"
            onError={() => setMediaError(true)}
            className="max-h-full w-auto max-w-full rounded-lg object-contain"
          />
        )}

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label={dict.gallery.lightbox.previous}
              className={`absolute top-1/2 left-2 -translate-y-1/2 sm:left-4 ${controlClass}`}
            >
              <ChevronLeft className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label={dict.gallery.lightbox.next}
              className={`absolute top-1/2 right-2 -translate-y-1/2 sm:right-4 ${controlClass}`}
            >
              <ChevronRight className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      <div className="px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-sm text-sand-deep">
          {current.caption?.[locale] ?? current.alt[locale]}
        </p>
        {current.credit ? (
          <p className="mt-1 text-xs text-stone">
            {dict.gallery.rail.creditPrefix} {current.credit}
          </p>
        ) : null}
      </div>
    </div>
  );
}
