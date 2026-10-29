/**
 * Interface strings, written by hand in each language — not machine-translated
 * fragments. Hotel *facts* are not here; they live in `config/hotel.ts`.
 *
 * Every locale must implement `Dictionary` in full; TypeScript enforces it.
 */

import type { Locale } from "./config";

/**
 * Dictionaries must stay plain data: the whole object is handed to client
 * components, and functions cannot cross the server/client boundary. Strings
 * that need a value interpolated use `{name}` placeholders and `fmt` below.
 */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export type BookingStrings = {
  eyebrow: string;
  heading: string;
  lede: string;
  fields: {
    checkIn: string;
    checkOut: string;
    guests: string;
    name: string;
    phone: string;
    note: string;
  };
  placeholders: { name: string; phone: string; note: string };
  optional: string;
  fewerGuests: string;
  moreGuests: string;
  /** Placeholders: {nights}, {guests} */
  summary: string;
  submit: string;
  submitting: string;
  disclaimer: string;
  errors: Record<
    "required" | "pastDate" | "order" | "tooFar" | "guests" | "name" | "phone" | "tooLong",
    string
  >;
  sent: { heading: string; body: string; again: string };
  manual: {
    heading: string;
    body: string;
    telegram: string;
    call: string;
    copy: string;
    copied: string;
  };
};

export type Dictionary = {
  nav: {
    about: string;
    gallery: string;
    rooms: string;
    facilities: string;
    booking: string;
    location: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
    menuTitle: string;
    skipToContent: string;
    languageLabel: string;
  };
  actions: {
    call: string;
    callShort: string;
    callAria: string;
    viewRooms: string;
    exploreHotel: string;
    getDirections: string;
    directionsAria: string;
    inquireByPhone: string;
    openGallery: string;
    viewAllPhotos: string;
    playVideo: string;
    backToTop: string;
  };
  gallery: {
    eyebrow: string;
    heading: string;
    lede: string;
    all: string;
    rail: {
      label: string;
      next: string;
      previous: string;
      swipeHint: string;
      /** Precedes an attribution handle, e.g. "Video: @someone". */
      creditPrefix: string;
    };
    categories: {
      exterior: string;
      entrance: string;
      rooms: string;
      interiors: string;
      facilities: string;
    };
    lightbox: {
      title: string;
      next: string;
      previous: string;
      close: string;
      /** Placeholders: {current}, {total} */
      counter: string;
    };
  };
  rooms: {
    eyebrow: string;
    heading: string;
    lede: string;
    perNight: string;
    /**
     * Placeholder: {count}. Phrased as a label rather than "{count} guests"
     * so it stays grammatical for every number in all three languages —
     * Russian in particular inflects after 1, 2–4 and 5+.
     */
    guests: string;
    amenitiesLabel: string;
    priceOnRequest: string;
  };
  facilities: {
    eyebrow: string;
    heading: string;
    lede: string;
  };
  highlights: {
    eyebrow: string;
    heading: string;
  };
  location: {
    eyebrow: string;
    heading: string;
    lede: string;
    addressLabel: string;
    addressPending: string;
    arrivalLabel: string;
    mapPending: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    lede: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    followLabel: string;
  };
  booking: BookingStrings;
  hero: {
    headline: string;
    subhead: string;
    scrollHint: string;
  };
  footer: {
    navLabel: string;
    /** Placeholder: {year} */
    rights: string;
    builtNote: string;
  };
  a11y: {
    mainLandmark: string;
    heroLandmark: string;
    logoAlt: string;
  };
};

const uz: Dictionary = {
  nav: {
    about: "Mehmonxona",
    gallery: "Galereya",
    rooms: "Xonalar",
    facilities: "Qulayliklar",
    booking: "Bron qilish",
    location: "Manzil",
    contact: "Aloqa",
    openMenu: "Menyuni ochish",
    closeMenu: "Menyuni yopish",
    menuTitle: "Menyu",
    skipToContent: "Asosiy mazmunga oʻtish",
    languageLabel: "Til",
  },
  actions: {
    call: "Mehmonxonaga qoʻngʻiroq qilish",
    callShort: "Qoʻngʻiroq",
    callAria: "Mehmonxonaga qoʻngʻiroq qilish",
    viewRooms: "Xonalarni koʻrish",
    exploreHotel: "Mehmonxona bilan tanishish",
    getDirections: "Yoʻlni koʻrsatish",
    directionsAria: "Google Maps’da yoʻlni koʻrsatish",
    inquireByPhone: "Qoʻngʻiroq qilib soʻrash",
    openGallery: "Rasmni kattalashtirish",
    viewAllPhotos: "Barcha suratlar",
    playVideo: "Videoni ijro etish",
    backToTop: "Yuqoriga qaytish",
  },
  gallery: {
    eyebrow: "Galereya",
    heading: "Mehmonxona suratlari",
    lede: "Kirish qismi, interyer va xonalarning haqiqiy suratlari.",
    all: "Hammasi",
    rail: {
      label: "Mehmonxona video va suratlari",
      next: "Keyingisi",
      previous: "Oldingisi",
      swipeHint: "Koʻproq koʻrish uchun chapga suring",
      creditPrefix: "Video:",
    },
    categories: {
      exterior: "Tashqi koʻrinish",
      entrance: "Kirish",
      rooms: "Xonalar",
      interiors: "Interyer",
      facilities: "Qulayliklar",
    },
    lightbox: {
      title: "Galereya",
      next: "Keyingi surat",
      previous: "Oldingi surat",
      close: "Yopish",
      counter: "{current} / {total}",
    },
  },
  rooms: {
    eyebrow: "Joylashuv",
    heading: "Xonalar",
    lede: "Boʻsh joylar va narxlarni aniqlashtirish uchun qabulxonaga qoʻngʻiroq qiling.",
    perNight: "kecha",
    guests: "Sigʻimi: {count} kishi",
    amenitiesLabel: "Xonada",
    priceOnRequest: "Narxi soʻrov asosida",
  },
  facilities: {
    eyebrow: "Qulayliklar",
    heading: "Mehmonlar uchun",
    lede: "Mehmonxona tomonidan tasdiqlangan xizmatlar.",
  },
  highlights: {
    eyebrow: "Nega PERA HOTEL",
    heading: "Bizni tanlash sabablari",
  },
  location: {
    eyebrow: "Manzil",
    heading: "Bizni qanday topasiz",
    lede: "Mehmonxona Toshkentning Chilonzor mavzesida joylashgan.",
    addressLabel: "Manzil",
    addressPending: "Aniq koʻcha manzilini qabulxonadan soʻrang.",
    arrivalLabel: "Kelish boʻyicha",
    mapPending: "Xarita qabulxona aniq nuqtani tasdiqlagandan soʻng qoʻshiladi.",
  },
  contact: {
    eyebrow: "Aloqa",
    heading: "Biz bilan bogʻlaning",
    lede: "Xonalar, narxlar va boʻsh joylar haqida toʻgʻridan-toʻgʻri soʻrang.",
    phoneLabel: "Telefon",
    emailLabel: "Elektron pochta",
    hoursLabel: "Ish vaqti",
    followLabel: "Ijtimoiy tarmoqlar",
  },
  booking: {
    eyebrow: "Bron qilish",
    heading: "Xona bron qiling",
    lede: "Sanalarni tanlang va soʻrov qoldiring — qabulxona siz bilan bogʻlanib, boʻsh joy va narxni tasdiqlaydi.",
    fields: {
      checkIn: "Kelish sanasi",
      checkOut: "Ketish sanasi",
      guests: "Mehmonlar soni",
      name: "Ismingiz",
      phone: "Telefon raqamingiz",
      note: "Qoʻshimcha izoh",
    },
    placeholders: {
      name: "Ism va familiya",
      phone: "+998 __ ___ __ __",
      note: "Masalan: ertalabki yetib kelish, qoʻshimcha karavot",
    },
    optional: "(ixtiyoriy)",
    fewerGuests: "Mehmonlar sonini kamaytirish",
    moreGuests: "Mehmonlar sonini oshirish",
    summary: "{nights} tun · {guests} mehmon",
    submit: "Soʻrov yuborish",
    submitting: "Yuborilmoqda…",
    disclaimer:
      "Bu bron soʻrovi. Joy qabulxona tasdiqlagandan soʻng band qilinadi — toʻlov talab qilinmaydi.",
    errors: {
      required: "Bu maydonni toʻldiring.",
      pastDate: "Oʻtgan sanani tanlab boʻlmaydi.",
      order: "Ketish sanasi kelish sanasidan keyin boʻlishi kerak.",
      tooFar: "Bu muddat juda uzoq — qabulxonaga qoʻngʻiroq qiling.",
      guests: "Mehmonlar sonini 1 dan 20 gacha kiriting.",
      name: "Ismingizni toʻliqroq yozing.",
      phone: "Telefon raqamini toʻgʻri kiriting.",
      tooLong: "Matn juda uzun.",
    },
    sent: {
      heading: "Soʻrovingiz yuborildi",
      body: "Qabulxona tez orada siz bilan bogʻlanadi. Shoshilinch boʻlsa, toʻgʻridan-toʻgʻri qoʻngʻiroq qiling.",
      again: "Yana bir soʻrov yuborish",
    },
    manual: {
      heading: "Soʻrovingiz tayyor",
      body: "Uni bir bosishda Telegram orqali yuboring yoki qabulxonaga qoʻngʻiroq qilib ayting.",
      telegram: "Telegram orqali yuborish",
      call: "Qoʻngʻiroq qilish",
      copy: "Matnni nusxalash",
      copied: "Nusxalandi",
    },
  },
  hero: {
    headline: "Toshkentda sizni kutamiz",
    subhead: "Chilonzorda joylashgan mehmonxona. Boʻsh joylar haqida qoʻngʻiroq orqali bilib oling.",
    scrollHint: "Pastga suring",
  },
  footer: {
    navLabel: "Sayt boʻlimlari",
    rights: "© {year} PERA HOTEL. Barcha huquqlar himoyalangan.",
    builtNote: "Toshkent, Oʻzbekiston",
  },
  a11y: {
    mainLandmark: "Asosiy mazmun",
    heroLandmark: "Mehmonxona haqida qisqacha",
    logoAlt: "PERA HOTEL logotipi",
  },
};

const ru: Dictionary = {
  nav: {
    about: "Об отеле",
    gallery: "Галерея",
    rooms: "Номера",
    facilities: "Услуги",
    booking: "Бронирование",
    location: "Адрес",
    contact: "Контакты",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    menuTitle: "Меню",
    skipToContent: "Перейти к содержанию",
    languageLabel: "Язык",
  },
  actions: {
    call: "Позвонить в отель",
    callShort: "Позвонить",
    callAria: "Позвонить в отель",
    viewRooms: "Посмотреть номера",
    exploreHotel: "Познакомиться с отелем",
    getDirections: "Построить маршрут",
    directionsAria: "Построить маршрут в Google Maps",
    inquireByPhone: "Уточнить по телефону",
    openGallery: "Открыть фото",
    viewAllPhotos: "Все фотографии",
    playVideo: "Воспроизвести видео",
    backToTop: "Наверх",
  },
  gallery: {
    eyebrow: "Галерея",
    heading: "Фотографии отеля",
    lede: "Настоящие снимки входа, интерьеров и номеров.",
    all: "Все",
    rail: {
      label: "Видео и фотографии отеля",
      next: "Следующее",
      previous: "Предыдущее",
      swipeHint: "Листайте влево, чтобы увидеть больше",
      creditPrefix: "Видео:",
    },
    categories: {
      exterior: "Снаружи",
      entrance: "Вход",
      rooms: "Номера",
      interiors: "Интерьеры",
      facilities: "Услуги",
    },
    lightbox: {
      title: "Галерея",
      next: "Следующее фото",
      previous: "Предыдущее фото",
      close: "Закрыть",
      counter: "{current} / {total}",
    },
  },
  rooms: {
    eyebrow: "Размещение",
    heading: "Номера",
    lede: "Чтобы уточнить наличие мест и цены, позвоните на ресепшн.",
    perNight: "ночь",
    guests: "Мест: {count}",
    amenitiesLabel: "В номере",
    priceOnRequest: "Цена по запросу",
  },
  facilities: {
    eyebrow: "Услуги",
    heading: "Для гостей",
    lede: "Услуги, подтверждённые отелем.",
  },
  highlights: {
    eyebrow: "Почему PERA HOTEL",
    heading: "Причины выбрать нас",
  },
  location: {
    eyebrow: "Адрес",
    heading: "Как нас найти",
    lede: "Отель находится в Чиланзарском районе Ташкента.",
    addressLabel: "Адрес",
    addressPending: "Точный адрес уточните у администратора.",
    arrivalLabel: "Как добраться",
    mapPending: "Карта появится после подтверждения точной точки на карте.",
  },
  contact: {
    eyebrow: "Контакты",
    heading: "Свяжитесь с нами",
    lede: "Спросите напрямую о номерах, ценах и свободных местах.",
    phoneLabel: "Телефон",
    emailLabel: "Эл. почта",
    hoursLabel: "Часы работы",
    followLabel: "Мы в соцсетях",
  },
  booking: {
    eyebrow: "Бронирование",
    heading: "Забронировать номер",
    lede: "Выберите даты и оставьте заявку — администратор свяжется с вами и подтвердит наличие мест и цену.",
    fields: {
      checkIn: "Дата заезда",
      checkOut: "Дата выезда",
      guests: "Количество гостей",
      name: "Ваше имя",
      phone: "Ваш телефон",
      note: "Дополнительно",
    },
    placeholders: {
      name: "Имя и фамилия",
      phone: "+998 __ ___ __ __",
      note: "Например: ранний заезд, дополнительная кровать",
    },
    optional: "(необязательно)",
    fewerGuests: "Уменьшить количество гостей",
    moreGuests: "Увеличить количество гостей",
    summary: "{nights} ноч. · {guests} гост.",
    submit: "Отправить заявку",
    submitting: "Отправляем…",
    disclaimer:
      "Это заявка на бронь. Номер закрепляется после подтверждения администратором — оплата не требуется.",
    errors: {
      required: "Заполните это поле.",
      pastDate: "Нельзя выбрать прошедшую дату.",
      order: "Дата выезда должна быть позже даты заезда.",
      tooFar: "Слишком большой срок — позвоните на ресепшн.",
      guests: "Укажите от 1 до 20 гостей.",
      name: "Напишите имя полностью.",
      phone: "Укажите корректный номер телефона.",
      tooLong: "Слишком длинный текст.",
    },
    sent: {
      heading: "Заявка отправлена",
      body: "Администратор свяжется с вами в ближайшее время. Если вопрос срочный — позвоните напрямую.",
      again: "Отправить ещё одну заявку",
    },
    manual: {
      heading: "Заявка готова",
      body: "Отправьте её одним нажатием в Telegram или продиктуйте администратору по телефону.",
      telegram: "Отправить в Telegram",
      call: "Позвонить",
      copy: "Скопировать текст",
      copied: "Скопировано",
    },
  },
  hero: {
    headline: "Ждём вас в Ташкенте",
    subhead: "Отель в Чиланзаре. О свободных местах узнайте по телефону.",
    scrollHint: "Листайте вниз",
  },
  footer: {
    navLabel: "Разделы сайта",
    rights: "© {year} PERA HOTEL. Все права защищены.",
    builtNote: "Ташкент, Узбекистан",
  },
  a11y: {
    mainLandmark: "Основное содержание",
    heroLandmark: "Коротко об отеле",
    logoAlt: "Логотип PERA HOTEL",
  },
};

const en: Dictionary = {
  nav: {
    about: "The hotel",
    gallery: "Gallery",
    rooms: "Rooms",
    facilities: "Facilities",
    booking: "Booking",
    location: "Location",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Menu",
    skipToContent: "Skip to main content",
    languageLabel: "Language",
  },
  actions: {
    call: "Call the hotel",
    callShort: "Call",
    callAria: "Call the hotel",
    viewRooms: "View rooms",
    exploreHotel: "Explore the hotel",
    getDirections: "Get directions",
    directionsAria: "Get directions on Google Maps",
    inquireByPhone: "Call to inquire",
    openGallery: "Open photo",
    viewAllPhotos: "All photos",
    playVideo: "Play video",
    backToTop: "Back to top",
  },
  gallery: {
    eyebrow: "Gallery",
    heading: "Photographs of the hotel",
    lede: "Genuine images of the entrance, the interiors and the rooms.",
    all: "All",
    rail: {
      label: "Hotel videos and photographs",
      next: "Next",
      previous: "Previous",
      swipeHint: "Swipe to see more",
      creditPrefix: "Video:",
    },
    categories: {
      exterior: "Exterior",
      entrance: "Entrance",
      rooms: "Rooms",
      interiors: "Interiors",
      facilities: "Facilities",
    },
    lightbox: {
      title: "Gallery",
      next: "Next photo",
      previous: "Previous photo",
      close: "Close",
      counter: "{current} of {total}",
    },
  },
  rooms: {
    eyebrow: "Accommodation",
    heading: "Rooms",
    lede: "Call reception to confirm availability and rates.",
    perNight: "night",
    guests: "Sleeps {count}",
    amenitiesLabel: "In the room",
    priceOnRequest: "Rate on request",
  },
  facilities: {
    eyebrow: "Facilities",
    heading: "For our guests",
    lede: "Services confirmed by the hotel.",
  },
  highlights: {
    eyebrow: "Why PERA HOTEL",
    heading: "Reasons to choose us",
  },
  location: {
    eyebrow: "Location",
    heading: "Finding us",
    lede: "The hotel is in the Chilonzor district of Tashkent.",
    addressLabel: "Address",
    addressPending: "Please ask reception for the exact street address.",
    arrivalLabel: "Arriving",
    mapPending: "The map will be added once the exact pin is confirmed.",
  },
  contact: {
    eyebrow: "Contact",
    heading: "Get in touch",
    lede: "Ask us directly about rooms, rates and availability.",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Hours",
    followLabel: "Follow us",
  },
  booking: {
    eyebrow: "Booking",
    heading: "Request a room",
    lede: "Pick your dates and send a request — reception will call you back to confirm availability and the rate.",
    fields: {
      checkIn: "Check-in date",
      checkOut: "Check-out date",
      guests: "Guests",
      name: "Your name",
      phone: "Your phone number",
      note: "Anything else",
    },
    placeholders: {
      name: "First and last name",
      phone: "+998 __ ___ __ __",
      note: "For example: early arrival, extra bed",
    },
    optional: "(optional)",
    fewerGuests: "Fewer guests",
    moreGuests: "More guests",
    summary: "{nights} nights · {guests} guests",
    submit: "Send request",
    submitting: "Sending…",
    disclaimer:
      "This is a booking request. The room is held once reception confirms it — no payment is taken here.",
    errors: {
      required: "Please fill in this field.",
      pastDate: "That date has already passed.",
      order: "Check-out must be after check-in.",
      tooFar: "That stay is too long — please call reception.",
      guests: "Enter between 1 and 20 guests.",
      name: "Please write your full name.",
      phone: "Please enter a valid phone number.",
      tooLong: "That text is too long.",
    },
    sent: {
      heading: "Request sent",
      body: "Reception will get back to you shortly. If it is urgent, please call us directly.",
      again: "Send another request",
    },
    manual: {
      heading: "Your request is ready",
      body: "Send it to us in one tap on Telegram, or read it to reception over the phone.",
      telegram: "Send on Telegram",
      call: "Call the hotel",
      copy: "Copy the text",
      copied: "Copied",
    },
  },
  hero: {
    headline: "We look forward to welcoming you in Tashkent",
    subhead: "A hotel in Chilonzor. Call us to check availability.",
    scrollHint: "Scroll",
  },
  footer: {
    navLabel: "Site sections",
    rights: "© {year} PERA HOTEL. All rights reserved.",
    builtNote: "Tashkent, Uzbekistan",
  },
  a11y: {
    mainLandmark: "Main content",
    heroLandmark: "Hotel at a glance",
    logoAlt: "PERA HOTEL logo",
  },
};

const dictionaries: Record<Locale, Dictionary> = { uz, ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

