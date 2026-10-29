import Link from "next/link";
import { localeMeta, locales, localePath, type Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
  className?: string;
};

/**
 * Three real locales, three real URLs — no JavaScript, no cookie, no flash of
 * the wrong language. Each option is a plain link with `hrefLang`, which also
 * tells search engines how the translations relate.
 */
export function LanguageSwitcher({ locale, label, className = "" }: LanguageSwitcherProps) {
  return (
    <nav
      aria-label={label}
      className={`flex items-center rounded-full border border-sand/20 p-0.5 ${className}`}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={localePath(code)}
            hrefLang={localeMeta[code].htmlLang}
            lang={localeMeta[code].htmlLang}
            aria-current={active ? "true" : undefined}
            title={localeMeta[code].name}
            className={[
              // Narrower on small phones so the header never overflows at 320px.
              "inline-flex h-9 min-w-8 items-center justify-center rounded-full px-1.5",
              "sm:min-w-9 sm:px-2",
              "text-[0.7rem] font-medium tracking-wider transition-colors duration-300",
              active
                ? "bg-champagne text-ink"
                : "text-sand-deep hover:text-ivory",
            ].join(" ")}
          >
            <span aria-hidden="true">{localeMeta[code].shortName}</span>
            <span className="sr-only">{localeMeta[code].name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
