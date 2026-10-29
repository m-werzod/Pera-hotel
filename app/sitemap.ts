import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { localeMeta, localePath, locales } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages = Object.fromEntries(
    locales.map((code) => [localeMeta[code].htmlLang, absoluteUrl(localePath(code))]),
  );

  return locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "uz" ? 1 : 0.8,
    alternates: { languages },
  }));
}
