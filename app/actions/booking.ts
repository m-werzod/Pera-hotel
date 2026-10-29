"use server";

import {
  composeBookingMessage,
  hasErrors,
  normalizeBooking,
  validateBooking,
  type BookingErrors,
  type BookingInput,
} from "@/lib/booking";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Where a submitted request ends up.
 *
 *  - "telegram": delivered straight to the hotel's Telegram. Requires
 *    TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment.
 *  - "manual":   no delivery channel is configured (or Telegram rejected the
 *    message), so the guest is handed the composed text plus a one-tap
 *    Telegram link and a call button. Nothing is silently dropped, and the
 *    UI never claims a request was received when it was not.
 */
export type BookingResult =
  | { status: "invalid"; errors: BookingErrors }
  | { status: "sent" }
  | { status: "manual"; message: string };

const TELEGRAM_TIMEOUT_MS = 8000;

export async function submitBooking(
  raw: BookingInput,
  rawLocale: string,
): Promise<BookingResult> {
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  // Re-validate server-side. The client check is only for fast feedback; this
  // is the one that counts, because anything can POST to a server action.
  const input = normalizeBooking(raw);
  const errors = validateBooking(input);
  if (hasErrors(errors)) return { status: "invalid", errors };

  const message = composeBookingMessage(input, locale);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return { status: "manual", message };

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Plain text, no parse_mode: guest input can then never be read as
        // Telegram markup, so there is nothing to escape or get wrong.
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      console.error("Telegram delivery failed:", response.status);
      return { status: "manual", message };
    }

    return { status: "sent" };
  } catch (error) {
    // A network failure must not lose the guest's request — fall back to
    // letting them send it themselves.
    console.error("Telegram delivery error:", error);
    return { status: "manual", message };
  }
}
