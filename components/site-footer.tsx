import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { brand, contact, location } from "@/config/hotel";
import { getAllCallTargets } from "@/lib/phone";
import { localePath, type Locale } from "@/lib/i18n/config";
import { fmt, type Dictionary } from "@/lib/i18n/dictionaries";
import type { NavItem } from "@/lib/navigation";
import { SocialIcon } from "./ui/social-icon";

type SiteFooterProps = {
  locale: Locale;
  dict: Dictionary;
  navItems: NavItem[];
};

export function SiteFooter({ locale, dict, navItems }: SiteFooterProps) {
  const callTargets = getAllCallTargets();
  const year = new Date().getFullYear();

  return (
    <footer
      // Clears the mobile contact bar so the copyright is never hidden behind it.
      className="border-t border-sand/12 bg-ink-800 pt-14 pb-[calc(var(--contact-bar-height)+2.5rem)] sm:pt-16"
    >
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-2">
            <Link
              href={localePath(locale)}
              className="inline-flex items-center gap-3"
              aria-label={brand.name}
            >
              <Image
                src={brand.logo.src}
                alt=""
                width={brand.logo.width}
                height={brand.logo.height}
                loading="lazy"
                sizes="48px"
                className="size-12 object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-light tracking-[0.2em] text-ivory">
                  {brand.nameParts.primary}
                </span>
                <span className="mt-1 text-[0.55rem] font-medium tracking-[0.42em] text-champagne">
                  {brand.nameParts.secondary}
                </span>
              </span>
            </Link>

            <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-sand-deep">
              <MapPin className="mt-0.5 size-4 shrink-0 text-champagne" strokeWidth={1.75} aria-hidden="true" />
              {location.streetAddress?.[locale] ?? location.label[locale]}
            </p>
          </div>

          <nav aria-label={dict.footer.navLabel}>
            <h2 className="eyebrow mb-4">{dict.footer.navLabel}</h2>
            {/* Links are given a comfortable tap height rather than relying on
                the text box, which is only ~17px tall. */}
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-sm text-sand-deep transition-colors duration-200 hover:text-ivory"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow mb-4">{dict.contact.phoneLabel}</h2>
            <ul className="flex flex-col">
              {callTargets.map((target) => (
                <li key={target.e164}>
                  <a
                    href={target.href}
                    data-call-cta=""
                    className="inline-flex min-h-10 items-center text-sm tabular-nums text-ivory transition-colors duration-200 hover:text-champagne-light"
                  >
                    {target.display}
                  </a>
                </li>
              ))}
              {contact.email ? (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex min-h-10 items-center text-sm break-all text-sand-deep transition-colors duration-200 hover:text-ivory"
                  >
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>

            {contact.social.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-4">
                {contact.social.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 text-sm text-sand-deep transition-colors duration-200 hover:text-ivory"
                    >
                      <SocialIcon id={item.id} instanceId={`footer-${item.id}`} className="size-5" />
                      {item.label}
                      <ArrowUpRight className="size-3" strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-sand/10 pt-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>{fmt(dict.footer.rights, { year })}</p>
          <p>{dict.footer.builtNote}</p>
        </div>
      </div>
    </footer>
  );
}
