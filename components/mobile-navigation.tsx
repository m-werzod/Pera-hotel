"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { location } from "@/config/hotel";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { NavItem } from "@/lib/navigation";
import { CallLink } from "./ui/call-link";
import { DirectionsLink } from "./ui/directions-link";

type MobileNavigationProps = {
  locale: Locale;
  dict: Dictionary;
  navItems: NavItem[];
};

/**
 * Full-screen mobile menu.
 *
 * Implements the usual dialog contract by hand rather than pulling in a
 * dependency: focus moves into the panel on open, Escape and backdrop close
 * it, Tab is trapped inside, background scroll is locked, and focus returns
 * to the trigger on close.
 */
export function MobileNavigation({ locale, dict, navItems }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Lock background scroll while the panel is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape to close, Tab trapped within the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus into the panel on open, and back to the trigger on close.
  // Skipped on mount so the menu button is not focused on page load.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (open) {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    } else {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
        className="inline-flex size-11 items-center justify-center rounded-full border border-sand/25
                   text-ivory transition-colors duration-300 hover:border-champagne hover:text-champagne-light
                   lg:hidden"
      >
        {open ? (
          <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
        )}
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label={dict.nav.menuTitle}
        // Keeps the collapsed panel out of the tab order and the a11y tree.
        inert={!open}
        className={[
          "fixed inset-x-0 top-16 z-45 mx-3 origin-top rounded-xl border border-sand/15",
          "bg-ink-800/97 p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
        ].join(" ")}
      >
        <nav aria-label={dict.nav.menuTitle}>
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={item.id} className={index > 0 ? "border-t border-sand/10" : ""}>
                <a
                  href={item.href}
                  onClick={close}
                  className="flex min-h-13 items-center justify-between py-1 font-display text-2xl
                             font-light text-ivory transition-colors duration-200 hover:text-champagne-light"
                >
                  {item.label}
                  <span className="text-xs tabular-nums text-stone" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-6 flex items-start gap-2 text-sm leading-snug text-sand-deep">
          <MapPin className="mt-0.5 size-4 shrink-0 text-champagne" strokeWidth={1.75} aria-hidden="true" />
          {location.label[locale]}
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <CallLink label={dict.actions.call} ariaLabel={dict.actions.callAria} size="md" />
          <DirectionsLink
            label={dict.actions.getDirections}
            ariaLabel={dict.actions.directionsAria}
            size="md"
          />
        </div>
      </div>
    </>
  );
}
