/**
 * ============================================================================
 *  PERA HOTEL — CENTRAL CONFIGURATION
 * ============================================================================
 *
 *  This is the ONLY place hotel facts live. Phone numbers, address, media
 *  paths, rooms, facilities and social links are all read from here by every
 *  component. Never hard-code a phone number or address in a component.
 *
 *  RULES FOR WHOEVER EDITS THIS FILE:
 *   1. Only enter information the hotel owner has actually confirmed.
 *   2. Anything still unknown must stay `null` / `[]`. The UI hides or
 *      gracefully degrades every unconfigured item — it never shows a
 *      half-filled card or a dead button.
 *   3. `npm run dev` shows a "Configuration needed" panel listing everything
 *      still missing. It never renders in production.
 *
 *  Search this file for `TODO(owner)` to find everything still outstanding.
 * ============================================================================
 */

import type { Locale } from "@/lib/i18n/config";

/** Text that differs per language. Every locale must be filled in. */
export type Localized = Record<Locale, string>;

export type PhoneNumber = {
  /** E.164, digits only after the `+`. Used to build the `tel:` link. */
  e164: string;
  /** Pretty form shown to visitors. */
  display: string;
  /** Optional note, e.g. "Reception" / "Qabulxona". */
  label?: Localized;
};

export type MediaImage = {
  src: string;
  /** Meaningful alternative text — describes what is actually in the frame. */
  alt: Localized;
  /** Optional caption rendered under the image in the gallery. */
  caption?: Localized;
  width: number;
  height: number;
  /** CSS object-position, for frames where the subject is off-centre. */
  objectPosition?: string;
  category: "exterior" | "entrance" | "rooms" | "interiors" | "facilities";
};

export type MediaVideo = {
  src: string;
  /** Poster frame. Required — it is what mobile visitors see before playback. */
  poster: string;
  alt: Localized;
  caption?: Localized;
  width: number;
  height: number;
  category: "hero" | "entrance" | "rooms";
  /**
   * Set when the clip was made by someone other than the hotel, e.g.
   * "@hotel_voyage_pro". Rendered on the tile so third-party work is credited
   * rather than passed off as the hotel's own.
   */
  credit?: string;
};

export type Room = {
  id: string;
  name: Localized;
  description?: Localized;
  images: MediaImage[];
  /** Only list amenities the owner has confirmed for THIS room type. */
  amenities: Localized[];
  /** e.g. { adults: 2 } — leave null until confirmed. */
  capacity: number | null;
  /** Leave null until confirmed. Never estimate. */
  price: { amount: number; currency: "UZS" | "USD"; per: "night" } | null;
};

export type Facility = {
  id: string;
  /** Any icon name exported by lucide-react. */
  icon: string;
  name: Localized;
  description?: Localized;
};

export type Highlight = {
  id: string;
  icon: string;
  title: Localized;
  body: Localized;
};

// ---------------------------------------------------------------------------
// 1. BRAND
// ---------------------------------------------------------------------------

export const brand = {
  /** Never translate or re-case the brand name. */
  name: "PERA HOTEL",
  /** Used where the two words are stacked, e.g. the logo lockup. */
  nameParts: { primary: "PERA", secondary: "HOTEL" },
  logo: {
    src: "/images/brand/pera-hotel-logo.png",
    alt: "PERA HOTEL",
    width: 640,
    height: 640,
  },
  /** Square mark for favicons / app icons. Falls back to `logo` when null. */
  mark: null as { src: string; width: number; height: number } | null,
} as const;

// ---------------------------------------------------------------------------
// 2. CONTACT  —  ⚠ single source of truth for every tel: link on the site
// ---------------------------------------------------------------------------

export const contact = {
  /**
   * The FIRST entry is the primary number: it powers the sticky call button,
   * the header button, every "Call to inquire" action and the LocalBusiness
   * structured data.
   */
  phones: [
    {
      e164: "+998953735500",
      display: "+998 95 373 55 00",
    },
    // TODO(owner): add further numbers if reception uses more than one line.
  ] as PhoneNumber[],

  /** TODO(owner): confirm the public e-mail address, or leave null. */
  email: null as string | null,

  /**
   * TODO(owner): confirm reception hours. `null` renders nothing rather than
   * implying 24/7 availability.
   */
  receptionHours: null as Localized | null,

  /** Only add accounts that genuinely belong to the hotel. */
  /** Confirmed by the owner. */
  social: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/pera_hotel/" },
    { id: "telegram", label: "Telegram", href: "https://t.me/Pera_hotell" },
  ] as { id: string; label: string; href: string }[],
};

// ---------------------------------------------------------------------------
// 3. LOCATION
// ---------------------------------------------------------------------------

export const location = {
  /** Short label shown in the hero, header and footer. */
  label: {
    uz: "Chilonzor 8, Toshkent, Oʻzbekiston",
    ru: "Чиланзар 8, Ташкент, Узбекистан",
    en: "Chilonzor 8, Tashkent, Uzbekistan",
  } satisfies Localized,

  /** Confirmed by the owner: Chilonzor 8-mavze, 49-uy. */
  streetAddress: {
    uz: "Chilonzor 8-mavze, 49-uy",
    ru: "Чиланзар, 8-й квартал, дом 49",
    en: "Chilonzor 8th quarter, building 49",
  } as Localized | null,

  city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" } satisfies Localized,
  region: { uz: "Chilonzor tumani", ru: "Чиланзарский район", en: "Chilonzor District" } satisfies Localized,
  countryCode: "UZ",
  /** TODO(owner): postal code, if the hotel uses one. */
  postalCode: null as string | null,

  /**
   * TODO(owner): exact map pin.
   * Until the owner drops a real pin we do NOT publish coordinates — a wrong
   * pin sends guests to the wrong gate. While this is null the site links to a
   * Google Maps *search* for the hotel name instead of a fixed destination,
   * and the static map preview is replaced by the entrance photograph.
   */
  coordinates: null as { lat: number; lng: number } | null,

  /**
   * TODO(owner): paste the hotel's own Google Maps place URL here if it has a
   * verified Business Profile. It takes priority over the search fallback.
   */
  googleMapsUrl: null as string | null,

  /** TODO(owner): arrival instructions, landmarks, parking entrance, etc. */
  arrivalNotes: null as Localized | null,
};

// ---------------------------------------------------------------------------
// 4. MEDIA
// ---------------------------------------------------------------------------
//  Drop files into these folders and reference them here:
//
//    public/images/brand/      logo, social share image
//    public/images/exterior/   facade, street view, by day and by night
//    public/images/entrance/   the entrance itself — used for arrival guidance
//    public/images/rooms/      one subfolder-free flat list, named per room
//    public/images/interiors/  lobby, reception, corridors, stairs
//    public/images/facilities/ breakfast room, parking, anything confirmed
//    public/videos/hero/       cinematic background loop (+ poster image)
//    public/videos/entrance/   arrival walk-up clip
//    public/videos/rooms/      room walkthroughs
//
//  Width/height must match the real file so Next.js can reserve the space and
//  avoid layout shift.
// ---------------------------------------------------------------------------

/**
 * Annotated explicitly rather than with `satisfies`, so that optional fields
 * like `objectPosition` stay part of each item's type even when a particular
 * entry omits them. `satisfies` would narrow each literal to exactly the keys
 * it declares, and consumers reading `item.objectPosition` would not compile.
 */
export type HotelMedia = {
  hero: { image: MediaImage; video: MediaVideo | null };
  ogImage: { src: string; width: number; height: number } | null;
  gallery: MediaImage[];
  videos: MediaVideo[];
};

export const media: HotelMedia = {
  /**
   * The hero visual. `video` takes priority on desktop when present; mobile
   * always loads the poster/image first and only fetches video on request.
   *
   * TODO(owner): supply the entrance video → set `video` and keep `image` as
   * the fallback/poster.
   */
  hero: {
    image: {
      src: "/images/entrance/pera-hotel-entrance-night.webp",
      alt: {
        uz: "PERA HOTEL ning kechqurun yoritilgan kirish qismi",
        ru: "Освещённый вход отеля PERA HOTEL вечером",
        en: "The illuminated entrance of PERA HOTEL at night",
      },
      width: 640,
      height: 640,
      objectPosition: "center 42%",
      category: "entrance",
    },
    video: null,
  },

  /** Image used for the social share card. Falls back to the hero image. */
  ogImage: null,

  /**
   * Gallery items, in display order. Mix exterior / entrance / rooms /
   * interiors freely — the gallery filters by `category` automatically and
   * only shows filter chips for categories that actually have images.
   *
   * TODO(owner): add room, interior and facility photography.
   */
  gallery: [
    {
      src: "/images/entrance/pera-hotel-entrance-night.webp",
      alt: {
        uz: "PERA HOTEL ning kechqurun yoritilgan kirish qismi va zinapoyasi",
        ru: "Освещённый вход и лестница отеля PERA HOTEL вечером",
        en: "The illuminated entrance and steps of PERA HOTEL at night",
      },
      caption: {
        uz: "Kechki yoritishdagi asosiy kirish",
        ru: "Главный вход в вечерней подсветке",
        en: "The main entrance under evening light",
      },
      width: 640,
      height: 640,
      category: "entrance",
    },
  ],

  /**
   * Standalone videos, shown as a featured player in the gallery section.
   * Nothing is fetched until the visitor presses play (`preload="none"`), so
   * these never cost a mobile visitor bandwidth on page load.
   */
  videos: [
    {
      src: "/videos/rooms/pera-room-tour.mp4",
      poster: "/images/rooms/pera-room-tour-poster.jpg",
      alt: {
        uz: "PERA HOTEL xonasi boʻylab video sayr",
        ru: "Видеопрогулка по номеру PERA HOTEL",
        en: "A video walkthrough of a room at PERA HOTEL",
      },
      caption: {
        uz: "Xona boʻylab sayr",
        ru: "Прогулка по номеру",
        en: "Inside a room",
      },
      width: 720,
      height: 1280,
      category: "rooms",
    },
    {
      src: "/videos/rooms/pera-room-03.mp4",
      poster: "/images/rooms/pera-room-03-poster.jpg",
      alt: {
        uz: "PERA HOTEL xonasi: keng karavot va yoritilgan interyer",
        ru: "Номер PERA HOTEL: широкая кровать и подсвеченный интерьер",
        en: "A room at PERA HOTEL with a wide bed and warm lighting",
      },
      caption: {
        uz: "Xona va interyer",
        ru: "Номер и интерьер",
        en: "Room and interior",
      },
      width: 720,
      height: 1280,
      category: "rooms",
    },
    {
      src: "/videos/rooms/pera-room-02.mp4",
      poster: "/images/rooms/pera-room-02-poster.jpg",
      alt: {
        uz: "PERA HOTEL xonasi: karavot, oʻtirgich va yumshoq yoritish",
        ru: "Номер PERA HOTEL: кровать, кресло и мягкое освещение",
        en: "A room at PERA HOTEL with a bed, an armchair and soft lighting",
      },
      caption: {
        uz: "Xonadagi qulayliklar",
        ru: "Удобства в номере",
        en: "Inside the room",
      },
      width: 720,
      height: 1280,
      category: "rooms",
    },
    // ----------------------------------------------------------------------
    // HELD BACK pending the owner's confirmation of rights.
    //
    // This clip genuinely shows the PERA HOTEL entrance, but it was filmed and
    // published by @hotel_voyage_pro, not by the hotel, and it carries a
    // burned-in "Yangi yil uchun bomba skidka" (New Year discount) overlay
    // that is no longer current. The file is already in
    // `public/videos/entrance/`, so enabling it is just uncommenting this.
    //
    // {
    //   src: "/videos/entrance/pera-entrance-winter.mp4",
    //   poster: "/images/entrance/pera-entrance-winter-poster.jpg",
    //   alt: {
    //     uz: "PERA HOTEL ning qishki bezakdagi kirish qismi",
    //     ru: "Вход PERA HOTEL в зимнем убранстве",
    //     en: "The entrance of PERA HOTEL in winter decoration",
    //   },
    //   caption: {
    //     uz: "Kirish qismi, qish faslida",
    //     ru: "Вход отеля зимой",
    //     en: "The entrance in winter",
    //   },
    //   width: 720,
    //   height: 1280,
    //   category: "entrance",
    //   credit: "@hotel_voyage_pro",
    // },
    // ----------------------------------------------------------------------
  ],
};

// ---------------------------------------------------------------------------
// 5. EDITORIAL COPY
// ---------------------------------------------------------------------------
//  Deliberately free of factual claims. Nothing here states a star rating,
//  a distance, a year, an award or a facility. Replace with the owner's own
//  wording as soon as it is available.
// ---------------------------------------------------------------------------

export const intro = {
  eyebrow: {
    uz: "Mehmondoʻstlik",
    ru: "Гостеприимство",
    en: "Hospitality",
  } satisfies Localized,
  heading: {
    uz: "Toshkentdagi xotirjam toʻxtash joyingiz",
    ru: "Ваша спокойная остановка в Ташкенте",
    en: "Your calm stop in Tashkent",
  } satisfies Localized,
  body: [
    {
      uz: "PERA HOTEL — Toshkentning Chilonzor mavzesida joylashgan mehmonxona. Biz mehmonlarni samimiy kutib olish, tartibli xonalar va sokin muhit bilan taʼminlashga eʼtibor qaratamiz.",
      ru: "PERA HOTEL — отель в Чиланзарском районе Ташкента. Мы делаем ставку на радушную встречу гостей, ухоженные номера и спокойную атмосферу.",
      en: "PERA HOTEL is a hotel in the Chilonzor district of Tashkent. Our focus is a warm welcome, well-kept rooms and a quiet atmosphere.",
    },
    {
      uz: "Xonalar, narxlar va boʻsh joylar haqida eng aniq maʼlumotni telefon orqali olasiz — qabulxona sizga yordam beradi.",
      ru: "Самую точную информацию о номерах, ценах и наличии мест вы получите по телефону — администратор всегда поможет.",
      en: "For the most accurate information on rooms, rates and availability, call us — reception will help you directly.",
    },
  ] satisfies Localized[],
};

// ---------------------------------------------------------------------------
// 6. ROOMS  —  empty until the owner confirms categories
// ---------------------------------------------------------------------------
//  The rooms section hides itself entirely while this array is empty, so no
//  invented category, rate or bed configuration ever reaches a visitor.
//
//  TODO(owner): fill in real categories. Template:
//
//  {
//    id: "standard-double",
//    name: { uz: "Standart ikki kishilik", ru: "Стандартный двухместный", en: "Standard Double" },
//    description: { uz: "...", ru: "...", en: "..." },
//    images: [{ src: "/images/rooms/standard-double-01.jpg", alt: {...},
//               width: 1600, height: 1067, category: "rooms" }],
//    amenities: [
//      { uz: "Konditsioner", ru: "Кондиционер", en: "Air conditioning" },
//    ],
//    capacity: 2,
//    price: { amount: 450000, currency: "UZS", per: "night" },
//  }
// ---------------------------------------------------------------------------

export const rooms: Room[] = [];

// ---------------------------------------------------------------------------
// 7. FACILITIES  —  empty until confirmed
// ---------------------------------------------------------------------------
//  TODO(owner): confirm which of these the hotel actually offers, then add
//  them here. Do not add anything that has not been confirmed.
//
//  { id: "wifi",      icon: "Wifi",       name: { uz: "Bepul Wi-Fi", ru: "Бесплатный Wi-Fi", en: "Free Wi-Fi" } }
//  { id: "parking",   icon: "CircleParking", name: { uz: "Avtoturargoh", ru: "Парковка", en: "Parking" } }
//  { id: "breakfast", icon: "Coffee",     name: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" } }
//  { id: "reception", icon: "Clock",      name: { uz: "24/7 qabulxona", ru: "Ресепшн 24/7", en: "24/7 reception" } }
// ---------------------------------------------------------------------------

export const facilities: Facility[] = [];

// ---------------------------------------------------------------------------
// 8. "WHY PERA" HIGHLIGHTS
// ---------------------------------------------------------------------------
//  Only claims that are true by construction are listed by default: the
//  location, and the fact that you can reach reception by phone. No review
//  scores, guest counts, awards or superlatives.
//
//  TODO(owner): supply genuine differentiators to extend this list.
// ---------------------------------------------------------------------------

export const highlights: Highlight[] = [
  {
    id: "location",
    icon: "MapPin",
    title: {
      uz: "Chilonzorda joylashgan",
      ru: "Расположение в Чиланзаре",
      en: "Set in Chilonzor",
    },
    body: {
      uz: "Mehmonxona Toshkentning Chilonzor mavzesida, 8-kvartalda joylashgan.",
      ru: "Отель находится в 8-м квартале Чиланзарского района Ташкента.",
      en: "The hotel is located in quarter 8 of Tashkent's Chilonzor district.",
    },
  },
  {
    id: "direct",
    icon: "PhoneCall",
    title: {
      uz: "Toʻgʻridan-toʻgʻri bogʻlanish",
      ru: "Прямая связь",
      en: "Talk to us directly",
    },
    body: {
      uz: "Vositachilarsiz: bir bosishda qabulxonaga qoʻngʻiroq qiling va savollaringizga javob oling.",
      ru: "Без посредников: одно нажатие — и вы говорите с администратором отеля.",
      en: "No intermediaries: one tap connects you straight to the hotel's reception.",
    },
  },
];

// ---------------------------------------------------------------------------
// 9. DERIVED HELPERS — do not edit below unless you change the shapes above
// ---------------------------------------------------------------------------

export const primaryPhone: PhoneNumber | null = contact.phones[0] ?? null;

/** True when every fact a public, non-misleading site needs is configured. */
export const configStatus = {
  phone: contact.phones.length > 0,
  streetAddress: location.streetAddress !== null,
  coordinates: location.coordinates !== null,
  heroVideo: media.hero.video !== null,
  galleryDepth: media.gallery.length >= 6,
  rooms: rooms.length > 0,
  facilities: facilities.length > 0,
  social: contact.social.length > 0,
  email: contact.email !== null,
} as const;
