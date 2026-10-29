import { contact, primaryPhone, type PhoneNumber } from "@/config/hotel";

/**
 * Normalise a phone number into a value that is safe inside a `tel:` URI.
 * Strips spaces, dashes, brackets and anything else a human might type, and
 * keeps a single leading `+`.
 */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/** A phone number is usable if it has a country code and a plausible length. */
export function isValidPhone(input: string): boolean {
  const normalized = normalizePhone(input);
  return /^\+\d{8,15}$/.test(normalized);
}

export function telHref(input: string): string {
  return `tel:${normalizePhone(input)}`;
}

export type CallTarget = {
  /** `tel:` URI, ready for an anchor's href. */
  href: string;
  /** Human-readable number, exactly as configured. */
  display: string;
  /** E.164, for structured data. */
  e164: string;
};

/**
 * The single resolver every call-to-action uses. Returns `null` when no valid
 * number is configured, so callers can render a non-interactive state instead
 * of a dead `tel:` link.
 */
export function getPrimaryCallTarget(): CallTarget | null {
  return toCallTarget(primaryPhone);
}

export function getAllCallTargets(): CallTarget[] {
  return contact.phones
    .map(toCallTarget)
    .filter((t): t is CallTarget => t !== null);
}

function toCallTarget(phone: PhoneNumber | null): CallTarget | null {
  if (!phone || !isValidPhone(phone.e164)) return null;
  const e164 = normalizePhone(phone.e164);
  return {
    href: `tel:${e164}`,
    display: phone.display || e164,
    e164,
  };
}
