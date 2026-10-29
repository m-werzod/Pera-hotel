"use client";

import { useState, useSyncExternalStore } from "react";
import type { MediaVideo } from "@/config/hotel";
import type { Locale } from "@/lib/i18n/config";

type HeroMediaProps = {
  video: MediaVideo;
  locale: Locale;
};

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

const WIDE = "(min-width: 768px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Subscribed through `useSyncExternalStore` rather than an effect that calls
 * `setState`: the browser capability check is external state, reading it this
 * way avoids a cascading render on mount, and it re-evaluates when the
 * viewport is resized or the motion preference changes.
 */
function subscribe(onChange: () => void): () => void {
  const wide = window.matchMedia(WIDE);
  const motion = window.matchMedia(REDUCED_MOTION);
  wide.addEventListener("change", onChange);
  motion.addEventListener("change", onChange);
  return () => {
    wide.removeEventListener("change", onChange);
    motion.removeEventListener("change", onChange);
  };
}

function getSnapshot(): boolean {
  if (window.matchMedia(REDUCED_MOTION).matches) return false;
  if (!window.matchMedia(WIDE).matches) return false;

  const connection = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (connection?.saveData === true) return false;
  if (
    connection?.effectiveType !== undefined &&
    ["slow-2g", "2g", "3g"].includes(connection.effectiveType)
  ) {
    return false;
  }

  return true;
}

/** The server renders no video — the poster image is already in place. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Mounts the hero's background video only when it is actually worth loading:
 * tablet width or wider, no reduced-motion preference, and not on a metered
 * or slow connection. Until then (and if any check fails, or playback errors)
 * the poster image already rendered by `HeroSection` stays in place — that is
 * the fallback, so the hero can never be blank.
 */
export function HeroMedia({ video, locale }: HeroMediaProps) {
  const capable = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  if (!capable || failed) return null;

  return (
    <video
      src={video.src}
      poster={video.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      onError={() => setFailed(true)}
      className={[
        "absolute inset-0 size-full object-cover transition-opacity duration-1000",
        ready ? "opacity-100" : "opacity-0",
      ].join(" ")}
      // Accepted so call sites stay symmetric with the image path and a
      // localised track can be added later without changing them.
      data-locale={locale}
    />
  );
}
