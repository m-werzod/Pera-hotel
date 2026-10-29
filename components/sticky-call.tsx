"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { getPrimaryCallTarget } from "@/lib/phone";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type StickyCallProps = {
  dict: Dictionary;
};

/**
 * The persistent call-to-action.
 *
 * Mobile  вЂ” a fixed bottom bar that respects the safe-area inset and reserves
 *           its own height via `--contact-bar-height`, so it never covers page
 *           content or the footer.
 * Desktop вЂ” a floating pill in the bottom-right corner.
 *
 * Both share one `tel:` target resolved from `config/hotel.ts`, and both
 * render nothing when no valid number is configured.
 *
 * The animation is a slow, intermittent "breath" with a soft expanding ring
 * behind the icon вЂ” one cycle every seven seconds, not a constant pulse. It
 * runs on a decorative layer underneath the link, so it can never intercept a
 * tap, and `prefers-reduced-motion` disables it in `globals.css`.
 */
export function StickyCall({ dict }: StickyCallProps) {
  const target = getPrimaryCallTarget();
  const [visible, setVisible] = useState(false);

  // Appear once the visitor has moved past the hero, where a call button is
  // already prominent вЂ” so the two never compete for the same tap.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reserve space at the bottom of the page for the mobile bar.
  useEffect(() => {
    if (!target) return;
    const root = document.documentElement;
    const apply = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      root.style.setProperty("--contact-bar-height", isMobile ? "4.5rem" : "0px");
    };
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      root.style.setProperty("--contact-bar-height", "0px");
    };
  }, [target]);

  if (!target) return null;

  return (
    <>
      {/* ---- Mobile: fixed bottom contact bar ---- */}
      <div
        className={[
          "fixed inset-x-0 bottom-0 z-50 md:hidden",
          "border-t border-champagne/25 bg-ink/92 backdrop-blur-lg",
          "pb-[env(safe-area-inset-bottom)]",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          visible ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] tracking-[0.16em] text-stone uppercase">
              {dict.contact.phoneLabel}
            </p>
            <p className="truncate text-sm tabular-nums text-ivory">{target.display}</p>
          </div>

          <a
            href={target.href}
            data-call-cta=""
            aria-label={`${dict.actions.callAria} вЂ” ${target.display}`}
            className="animate-breathe relative inline-flex min-h-12 shrink-0 items-center gap-2.5
                       rounded-full bg-champagne px-6 font-medium text-ink
                       shadow-[0_6px_22px_-8px_rgba(201,163,92,0.95)]
                       transition-[background-color,transform] duration-300 active:scale-[0.97]"
          >
            <span
              aria-hidden="true"
              className="animate-ring pointer-events-none absolute inset-0 rounded-full border border-champagne-light"
            />
            <Phone className="size-[1.125rem] shrink-0" strokeWidth={2.25} aria-hidden="true" />
            <span>{dict.actions.callShort}</span>
          </a>
        </div>
      </div>

      {/* ---- Desktop: floating call pill ---- */}
      <a
        href={target.href}
        data-call-cta=""
        aria-label={`${dict.actions.callAria} вЂ” ${target.display}`}
        className={[
          "group fixed right-6 bottom-6 z-50 hidden items-center gap-3 md:inline-flex",
          "animate-breathe min-h-14 rounded-full bg-champagne pr-6 pl-5 font-medium text-ink",
          "shadow-[0_14px_40px_-12px_rgba(201,163,92,0.85)]",
          "transition-[transform,background-color,box-shadow,opacity] duration-500",
          "ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-champagne-light",
          "hover:shadow-[0_18px_48px_-12px_rgba(227,201,141,0.95)]",
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        ].join(" ")}
      >
        <span className="relative inline-flex size-9 items-center justify-center rounded-full bg-ink/12">
          <span
            aria-hidden="true"
            className="animate-ring pointer-events-none absolute inset-0 rounded-full border border-ink/35"
          />
          <Phone className="size-[1.125rem]" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm">{dict.actions.call}</span>
          <span className="text-xs tabular-nums opacity-70">{target.display}</span>
        </span>
      </a>
    </>
  );
}
