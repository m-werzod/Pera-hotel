import type { Metadata } from "next";
import { brand, location, media } from "@/config/hotel";
import { absoluteUrl, siteUrl, verification } from "@/config/site";
import { localeMeta, localePath, locales, type Locale } from "@/lib/i18n/config";

/**
 * Page copy for search results and social cards.
 *
 * Descriptive and location-led, with no claim the hotel has not confirmed —
 * no star rating, no "best in Tashkent", no amenity list.
 */
const seoCopy: Record<Locale, { title: string; description: string }> = {
  uz: {
    title: "PERA HOTEL — Chilonzor 8, Toshkent",
    description:
      "PERA HOTEL — Toshkentning Chilonzor mavzesidagi mehmonxona. Xonalar, narxlar va boʻsh joylar haqida bevosita qabulxonaga qoʻngʻiroq qiling.",
  },
  ru: {
    title: "PERA HOTEL — Чиланзар 8, Ташкент",
    description:
      "PERA HOTEL — отель в Чиланзарском районе Ташкента. Узнайте о номерах, ценах и свободных местах напрямую по телефону.",
  },
  en: {
    title: "PERA HOTEL — Chilonzor 8, Tashkent",
    description:
      "PERA HOTEL is a hotel in the Chilonzor district of Tashkent. Call reception directly about rooms, rates and availability.",
  },
};

/** hreflang map, so Google serves the right language per visitor. */
function alternateLanguages(): Record<string, string> {
  const entries = locales.map((code) => [
    localeMeta[code].htmlLang,
    absoluteUrl(localePath(code)),
  ]);
  return Object.fromEntries([...entries, ["x-default", absoluteUrl("/")]]);
}

export function buildMetadata(locale: Locale): Metadata {
  const copy = seoCopy[locale];
  const share = media.ogImage ?? media.hero.image;
  const path = localePath(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: copy.title,
    description: copy.description,
    applicationName: brand.name,
    alternates: {
      canonical: absoluteUrl(path),
      languages: alternateLanguages(),
    },
    openGraph: {
      type: "website",
      siteName: brand.name,
      title: copy.title,
      description: copy.description,
      url: absoluteUrl(path),
      locale: localeMeta[locale].ogLocale,
      images: [
        {
          url: absoluteUrl(share.src),
          width: share.width,
          height: share.height,
          alt: `${brand.name} — ${location.label[locale]}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [absoluteUrl(share.src)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    ...(verification.google ? { verification: { google: verification.google } } : {}),
  };
}
