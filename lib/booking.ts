import type { Locale } from "@/lib/i18n/config";

/**
 * Booking request domain logic, shared by the client form and the server
 * action. Validation lives here once so the browser and the server apply
 * exactly the same rules — the client copy is for fast feedback, the server
 * copy is the one that actually protects us.
 */

export type BookingInput = {
  checkIn: string; // ISO yyyy-mm-dd, straight from <input type="date">
  checkOut: string;
  guests: number;
  name: string;
  phone: string;
  note: string;
};

/** Error *codes*, not messages — the dictionary supplies the wording. */
export type BookingErrorCode =
  | "required"
  | "pastDate"
  | "order"
  | "tooFar"
  | "guests"
  | "name"
  | "phone"
  | "tooLong";

export type BookingErrors = Partial<Record<keyof BookingInput, BookingErrorCode>>;

export const BOOKING_LIMITS = {
  maxGuests: 20,
  maxNights: 60,
  /** How far ahead a stay may be requested, in days. */
  maxLeadDays: 540,
  maxNameLength: 80,
  maxPhoneLength: 32,
  maxNoteLength: 500,
} as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

/** Today in UTC at midnight, so comparisons never straddle a timezone. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysIso(iso: string, days: number): string {
  const ms = parseIso(iso);
  if (ms === null) return iso;
  return new Date(ms + days * DAY_MS).toISOString().slice(0, 10);
}

function parseIso(value: string): number | null {
  if (!ISO_DATE.test(value)) return null;
  const ms = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(ms) ? null : ms;
}

export function nightsBetween(checkIn: string, checkOut: string): number | null {
  const a = parseIso(checkIn);
  const b = parseIso(checkOut);
  if (a === null || b === null) return null;
  const nights = Math.round((b - a) / DAY_MS);
  return nights > 0 ? nights : null;
}

/**
 * Validates a request. `now` is injectable so the server can pin the clock
 * and tests stay deterministic.
 */
export function validateBooking(
  input: BookingInput,
  now: string = todayIso(),
): BookingErrors {
  const errors: BookingErrors = {};
  const today = parseIso(now) ?? Date.parse("1970-01-01T00:00:00Z");

  const inMs = parseIso(input.checkIn);
  const outMs = parseIso(input.checkOut);

  if (!input.checkIn || inMs === null) errors.checkIn = "required";
  else if (inMs < today) errors.checkIn = "pastDate";
  else if (inMs - today > BOOKING_LIMITS.maxLeadDays * DAY_MS) errors.checkIn = "tooFar";

  if (!input.checkOut || outMs === null) errors.checkOut = "required";
  else if (inMs !== null && outMs <= inMs) errors.checkOut = "order";
  else if (inMs !== null && (outMs - inMs) / DAY_MS > BOOKING_LIMITS.maxNights) {
    errors.checkOut = "tooFar";
  }

  if (!Number.isInteger(input.guests) || input.guests < 1) errors.guests = "guests";
  else if (input.guests > BOOKING_LIMITS.maxGuests) errors.guests = "guests";

  const name = input.name.trim();
  if (!name) errors.name = "required";
  else if (name.length < 2) errors.name = "name";
  else if (name.length > BOOKING_LIMITS.maxNameLength) errors.name = "tooLong";

  // Deliberately permissive: guests write numbers in many shapes, and a
  // reachable-looking number beats turning away a real guest over formatting.
  const phoneDigits = input.phone.replace(/\D/g, "");
  if (!input.phone.trim()) errors.phone = "required";
  else if (phoneDigits.length < 7 || phoneDigits.length > 15) errors.phone = "phone";
  else if (input.phone.length > BOOKING_LIMITS.maxPhoneLength) errors.phone = "tooLong";

  if (input.note.length > BOOKING_LIMITS.maxNoteLength) errors.note = "tooLong";

  return errors;
}

export function hasErrors(errors: BookingErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Strips anything that could break out of a plain-text message: control
 * characters, and runs of whitespace that would let a sender pad one message
 * into looking like several. Never interpolate raw input without this.
 */
function clean(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function normalizeBooking(input: BookingInput): BookingInput {
  return {
    checkIn: clean(input.checkIn, 10),
    checkOut: clean(input.checkOut, 10),
    guests: Math.min(
      Math.max(Math.trunc(Number(input.guests) || 0), 0),
      BOOKING_LIMITS.maxGuests,
    ),
    name: clean(input.name, BOOKING_LIMITS.maxNameLength),
    phone: clean(input.phone, BOOKING_LIMITS.maxPhoneLength),
    note: clean(input.note, BOOKING_LIMITS.maxNoteLength),
  };
}

const LABELS: Record<Locale, Record<string, string>> = {
  uz: {
    title: "YANGI BRON SOʻROVI",
    checkIn: "Kelish",
    checkOut: "Ketish",
    nights: "Tunlar",
    guests: "Mehmonlar",
    name: "Ism",
    phone: "Telefon",
    note: "Izoh",
    source: "Manba",
  },
  ru: {
    title: "НОВАЯ ЗАЯВКА НА БРОНЬ",
    checkIn: "Заезд",
    checkOut: "Выезд",
    nights: "Ночей",
    guests: "Гостей",
    name: "Имя",
    phone: "Телефон",
    note: "Комментарий",
    source: "Источник",
  },
  en: {
    title: "NEW BOOKING REQUEST",
    checkIn: "Check-in",
    checkOut: "Check-out",
    nights: "Nights",
    guests: "Guests",
    name: "Name",
    phone: "Phone",
    note: "Note",
    source: "Source",
  },
};

/**
 * The single message format, used for the Telegram delivery, the deep link
 * and the clipboard copy alike — so reception always receives the same shape
 * regardless of which route the guest took.
 */
export function composeBookingMessage(
  input: BookingInput,
  locale: Locale,
  source = "perahotel site",
): string {
  const b = normalizeBooking(input);
  const t = LABELS[locale];
  const nights = nightsBetween(b.checkIn, b.checkOut);

  return [
    `${t.title} — PERA HOTEL`,
    "",
    `${t.checkIn}: ${b.checkIn}`,
    `${t.checkOut}: ${b.checkOut}`,
    nights ? `${t.nights}: ${nights}` : null,
    `${t.guests}: ${b.guests}`,
    "",
    `${t.name}: ${b.name}`,
    `${t.phone}: ${b.phone}`,
    b.note ? `${t.note}: ${b.note}` : null,
    "",
    `${t.source}: ${source}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}
