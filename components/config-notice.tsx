"use client";

import { useState } from "react";
import { ChevronDown, TriangleAlert } from "lucide-react";
import { configStatus } from "@/config/hotel";
import { isSiteUrlConfigured } from "@/config/site";

type Item = { key: string; label: string; done: boolean };

/**
 * Development-only checklist of everything still waiting on the hotel owner.
 *
 * It never renders in a production build, so visitors never see it — and it
 * exists so that a missing fact is visible to whoever is working on the site
 * instead of quietly turning into invented content.
 */
export function ConfigNotice({
  bookingDeliveryConfigured = false,
}: {
  /**
   * Passed down from the server as a plain boolean — the Telegram token
   * itself must never cross into the client bundle.
   */
  bookingDeliveryConfigured?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV === "production") return null;

  const items: Item[] = [
    { key: "phone", label: "Official phone number", done: configStatus.phone },
    { key: "address", label: "Exact street address", done: configStatus.streetAddress },
    { key: "coordinates", label: "Verified map pin / Google Maps place URL", done: configStatus.coordinates },
    { key: "heroVideo", label: "Hero or entrance video", done: configStatus.heroVideo },
    { key: "gallery", label: "Gallery photography (6+ images)", done: configStatus.galleryDepth },
    { key: "rooms", label: "Room categories, rates, amenities", done: configStatus.rooms },
    { key: "facilities", label: "Confirmed facilities", done: configStatus.facilities },
    { key: "email", label: "Public email address", done: configStatus.email },
    { key: "social", label: "Official social links", done: configStatus.social },
    { key: "domain", label: "NEXT_PUBLIC_SITE_URL (production domain)", done: isSiteUrlConfigured },
    {
      key: "booking",
      label: "TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (one-tap booking delivery)",
      done: bookingDeliveryConfigured,
    },
  ];

  const pending = items.filter((item) => !item.done);
  if (pending.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-4 z-90 max-w-[min(22rem,calc(100vw-2rem))] md:bottom-6 md:left-6">
      <div className="overflow-hidden rounded-lg border border-amber-500/40 bg-amber-950/95 text-amber-100 shadow-2xl backdrop-blur">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-xs font-medium"
        >
          <TriangleAlert className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          <span className="flex-1">
            {pending.length} item{pending.length === 1 ? "" : "s"} need owner input
          </span>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <div className="border-t border-amber-500/25 px-4 pt-3 pb-4">
            <ul className="flex flex-col gap-1.5 text-xs">
              {pending.map((item) => (
                <li key={item.key} className="flex gap-2">
                  <span aria-hidden="true">·</span>
                  {item.label}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.7rem] leading-relaxed text-amber-200/70">
              Edit <code className="font-mono">config/hotel.ts</code>. This panel is
              development-only and never ships to production.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
