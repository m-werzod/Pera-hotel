import { brand, location } from "@/config/hotel";

export type MapDestination = {
  /** Link that opens directions in Google Maps. */
  directionsHref: string;
  /** Link that opens the place/area in Google Maps. */
  placeHref: string;
  /**
   * `true` when the link points at a verified pin or place page.
   * `false` when it is only a name search — the UI then says so rather than
   * implying the pin is exact.
   */
  isExact: boolean;
};

/**
 * Builds map links from whatever location data is actually confirmed.
 *
 * Priority:
 *   1. An owner-supplied Google Maps place URL — always the most accurate.
 *   2. Confirmed coordinates.
 *   3. A plain Google Maps *search* for the hotel name and district.
 *
 * We never fabricate coordinates to make a pin appear.
 */
export function getMapDestination(): MapDestination {
  if (location.googleMapsUrl) {
    return {
      directionsHref: location.googleMapsUrl,
      placeHref: location.googleMapsUrl,
      isExact: true,
    };
  }

  if (location.coordinates) {
    const { lat, lng } = location.coordinates;
    const coords = `${lat},${lng}`;
    return {
      directionsHref: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coords)}`,
      placeHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`,
      isExact: true,
    };
  }

  // No verified pin yet, so search by name plus the confirmed street address.
  // Google resolves this reliably; a guessed coordinate would not.
  const query = location.streetAddress
    ? `${brand.name}, ${location.streetAddress.en}, ${location.city.en}, Uzbekistan`
    : `${brand.name}, ${location.label.en}`;
  const search = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return {
    directionsHref: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`,
    placeHref: search,
    isExact: false,
  };
}
