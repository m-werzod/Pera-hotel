/**
 * Locale configuration.
 *
 * Uzbek (Latin) is the default and is served at the site root `/`.
 * Russian and English live at `/ru` and `/en`.
 */

export const locales = ["uz", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

/**
 * TODO(owner): change this if the hotel prefers Russian as the default.
 * Written with `satisfies` rather than `: Locale` so the literal type is
 * preserved — `secondaryLocales` below depends on it.
 */
export const defaultLocale = "uz" satisfies Locale;

export type SecondaryLocale = Exclude<Locale, typeof defaultLocale>;

/** Non-default locales — these are the ones that get their own URL segment. */
export const secondaryLocales: SecondaryLocale[] = locales.filter(
  (l): l is SecondaryLocale => l !== defaultLocale,
);

export const localeMeta: Record<
  Locale,
  { name: string; shortName: string; htmlLang: string; ogLocale: string }
> = {
  uz: { name: "Oʻzbekcha", shortName: "UZ", htmlLang: "uz", ogLocale: "uz_UZ" },
  ru: { name: "Русский", shortName: "RU", htmlLang: "ru", ogLocale: "ru_RU" },
  en: { name: "English", shortName: "EN", htmlLang: "en", ogLocale: "en_US" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The site path for a locale: `/` for the default, `/ru` or `/en` otherwise. */
export function localePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

/** Prefix a hash/anchor with the correct locale root, e.g. `/ru#rooms`. */
export function localeHref(locale: Locale, hash?: string): string {
  const base = localePath(locale);
  if (!hash) return base;
  return base === "/" ? `/${hash}` : `${base}${hash}`;
}
