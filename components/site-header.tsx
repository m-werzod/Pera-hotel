"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { brand, location } from "@/config/hotel";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { NavItem } from "@/lib/navigation";
import { CallLink } from "./ui/call-link";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNavigation } from "./mobile-navigation";

type SiteHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  navItems: NavItem[];
};

export function SiteHeader({ locale, dict, navItems }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color]",
        "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-b",
        scrolled
          ? "border-sand/12 bg-ink/88 backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-ink/70 to-transparent",
      ].join(" ")}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link
          href={localePath(locale)}
          className="flex items-center gap-3 rounded-sm"
          aria-label={brand.name}
        >
          <Image
            src={brand.logo.src}
            alt=""
            width={brand.logo.width}
            height={brand.logo.height}
            priority
            sizes="40px"
            className="size-8 rounded-sm object-contain lg:size-10"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-light tracking-[0.18em] text-ivory sm:text-lg sm:tracking-[0.2em] lg:text-xl">
              {brand.nameParts.primary}
            </span>
            <span className="mt-0.5 text-[0.5rem] font-medium tracking-[0.42em] text-champagne lg:text-[0.55rem]">
              {brand.nameParts.secondary}
            </span>
          </span>
        </Link>

        <nav aria-label={dict.nav.menuTitle} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="relative py-2 text-sm text-sand transition-colors duration-300 hover:text-ivory
                             after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left
                             after:scale-x-0 after:bg-champagne after:transition-transform after:duration-300
                             hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-1.5 text-xs text-stone xl:flex">
            <MapPin className="size-3.5 text-champagne" strokeWidth={1.75} aria-hidden="true" />
            {location.label[locale]}
          </span>

          <LanguageSwitcher locale={locale} label={dict.nav.languageLabel} />

          {/* Visibility is controlled by this wrapper, not by a `hidden` class
              on the link itself: `CallLink`'s own `inline-flex` and `hidden`
              are both display utilities, and which one wins depends on their
              order in the stylesheet, not in the class attribute. */}
          <span className="hidden sm:block">
            <CallLink
              label={dict.actions.callShort}
              ariaLabel={dict.actions.callAria}
              size="sm"
            />
          </span>

          <MobileNavigation locale={locale} dict={dict} navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
