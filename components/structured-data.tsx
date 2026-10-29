import { brand, contact, location, media } from "@/config/hotel";
import { absoluteUrl, siteUrl } from "@/config/site";
import { getMapDestination } from "@/lib/maps";
import { getAllCallTargets } from "@/lib/phone";
import { localePath, localeMeta, type Locale } from "@/lib/i18n/config";

type StructuredDataProps = {
  locale: Locale;
};

/**
 * LodgingBusiness schema built strictly from confirmed facts.
 *
 * Anything unverified is omitted rather than guessed: no `streetAddress`
 * while only the district is known, no `geo` without a real pin, and never an
 * `aggregateRating`, `starRating`, `priceRange` or `openingHours` — inventing
 * those is both dishonest and a structured-data policy violation.
 */
export function StructuredData({ locale }: StructuredDataProps) {
  const phones = getAllCallTargets();
  const map = getMapDestination();

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${siteUrl}/#hotel`,
    name: brand.name,
    url: absoluteUrl(localePath(locale)),
    image: absoluteUrl(media.hero.image.src),
    logo: absoluteUrl(brand.logo.src),
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city[locale],
      addressRegion: location.region[locale],
      addressCountry: location.countryCode,
      ...(location.streetAddress ? { streetAddress: location.streetAddress[locale] } : {}),
      ...(location.postalCode ? { postalCode: location.postalCode } : {}),
    },
  };

  if (phones.length > 0) {
    schema.telephone = phones[0]!.e164;
    if (phones.length > 1) {
      schema.contactPoint = phones.map((phone) => ({
        "@type": "ContactPoint",
        telephone: phone.e164,
        contactType: "reservations",
      }));
    }
  }

  if (contact.email) schema.email = contact.email;
  if (location.coordinates) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
    };
  }
  if (map.isExact) schema.hasMap = map.placeHref;
  if (contact.social.length > 0) {
    schema.sameAs = contact.social.map((item) => item.href);
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: brand.name,
    inLanguage: localeMeta[locale].htmlLang,
    publisher: { "@id": `${siteUrl}/#hotel` },
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from typed objects we build ourselves — no user input, and
      // `<` is escaped so the payload cannot close the script tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([schema, websiteSchema]).replace(/</g, "\\u003c"),
      }}
    />
  );
}
