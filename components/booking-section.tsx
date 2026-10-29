"use client";

import { useId, useMemo, useRef, useState, useTransition } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Copy,
  LoaderCircle,
  Minus,
  Phone,
  Plus,
  Send,
  TriangleAlert,
  User,
  Users,
} from "lucide-react";
import { submitBooking, type BookingResult } from "@/app/actions/booking";
import {
  BOOKING_LIMITS,
  addDaysIso,
  nightsBetween,
  todayIso,
  validateBooking,
  hasErrors,
  type BookingErrors,
  type BookingInput,
} from "@/lib/booking";
import { getTelegramHandle } from "@/lib/social";
import { getPrimaryCallTarget } from "@/lib/phone";
import type { Locale } from "@/lib/i18n/config";
import { fmt, type Dictionary } from "@/lib/i18n/dictionaries";
import { sectionIds } from "@/lib/navigation";
import { SectionHeading } from "./ui/section-heading";
import { Reveal } from "./ui/reveal";
import { SocialIcon } from "./ui/social-icon";

type BookingSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

const fieldBase =
  "w-full rounded-lg border bg-ink px-3.5 text-base text-ivory " +
  // 16px text and a 48px box: anything smaller makes iOS Safari zoom the
  // page the moment the field is focused.
  "min-h-12 transition-colors duration-200 placeholder:text-stone " +
  "focus:border-champagne focus:outline-none";

export function BookingSection({ locale, dict }: BookingSectionProps) {
  const today = useMemo(() => todayIso(), []);
  const baseId = useId();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState<BookingErrors>({});
  const [result, setResult] = useState<BookingResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const statusRef = useRef<HTMLDivElement>(null);
  const callTarget = getPrimaryCallTarget();
  const telegram = getTelegramHandle();

  const nights = nightsBetween(checkIn, checkOut);

  const input: BookingInput = { checkIn, checkOut, guests, name, phone, note };

  const errorText = (field: keyof BookingInput): string | null => {
    const code = errors[field];
    return code ? dict.booking.errors[code] : null;
  };

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCopied(false);

    const found = validateBooking(input, today);
    setErrors(found);
    if (hasErrors(found)) {
      // Move the visitor to the first problem rather than leaving them to
      // hunt for it on a long mobile form.
      const first = Object.keys(found)[0];
      document.getElementById(`${baseId}-${first}`)?.focus();
      return;
    }

    startTransition(async () => {
      const outcome = await submitBooking(input, locale);
      setResult(outcome);
      if (outcome.status === "invalid") setErrors(outcome.errors);
      else requestAnimationFrame(() => statusRef.current?.focus());
    });
  }

  function reset() {
    setResult(null);
    setErrors({});
    setCheckIn("");
    setCheckOut("");
    setGuests(2);
    setName("");
    setPhone("");
    setNote("");
  }

  const telegramHref =
    result?.status === "manual" && telegram
      ? `https://t.me/${telegram}?text=${encodeURIComponent(result.message)}`
      : null;

  return (
    <section
      id={sectionIds.booking}
      className="relative scroll-mt-24 border-t border-sand/10 bg-ink py-14 sm:py-20 lg:py-28"
    >
      {/* A faint warm wash marks this out as the section that converts. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-champagne/6 to-transparent"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow={dict.booking.eyebrow}
          heading={dict.booking.heading}
          lede={dict.booking.lede}
        />

        <Reveal delay={80} className="mt-8 sm:mt-10">
          <div className="mx-auto max-w-2xl rounded-xl border border-sand/15 bg-ink-800 p-5 sm:p-7">
            {result?.status === "sent" ? (
              <SentPanel dict={dict} onReset={reset} statusRef={statusRef} />
            ) : result?.status === "manual" ? (
              <ManualPanel
                dict={dict}
                message={result.message}
                telegramHref={telegramHref}
                callHref={callTarget?.href ?? null}
                copied={copied}
                onCopy={async () => {
                  try {
                    await navigator.clipboard.writeText(result.message);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
                onReset={reset}
                statusRef={statusRef}
              />
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
                {/* Dates */}
                <div className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2">
                  <Field
                    id={`${baseId}-checkIn`}
                    label={dict.booking.fields.checkIn}
                    icon={<CalendarDays className="size-4" strokeWidth={1.75} />}
                    error={errorText("checkIn")}
                  >
                    <input
                      id={`${baseId}-checkIn`}
                      type="date"
                      value={checkIn}
                      min={today}
                      max={addDaysIso(today, BOOKING_LIMITS.maxLeadDays)}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        // Keep the stay coherent: a check-out that is now in
                        // the past relative to the new arrival is cleared.
                        if (checkOut && e.target.value && checkOut <= e.target.value) {
                          setCheckOut(addDaysIso(e.target.value, 1));
                        }
                      }}
                      required
                      aria-invalid={Boolean(errors.checkIn)}
                      className={`${fieldBase} ${errors.checkIn ? "border-red-400/60" : "border-sand/20"}`}
                    />
                  </Field>

                  <Field
                    id={`${baseId}-checkOut`}
                    label={dict.booking.fields.checkOut}
                    icon={<CalendarDays className="size-4" strokeWidth={1.75} />}
                    error={errorText("checkOut")}
                  >
                    <input
                      id={`${baseId}-checkOut`}
                      type="date"
                      value={checkOut}
                      min={checkIn ? addDaysIso(checkIn, 1) : addDaysIso(today, 1)}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      aria-invalid={Boolean(errors.checkOut)}
                      className={`${fieldBase} ${errors.checkOut ? "border-red-400/60" : "border-sand/20"}`}
                    />
                  </Field>
                </div>

                {/* Guests — a stepper beats a number spinner on a phone. */}
                <Field
                  id={`${baseId}-guests`}
                  label={dict.booking.fields.guests}
                  icon={<Users className="size-4" strokeWidth={1.75} />}
                  error={errorText("guests")}
                >
                  <div className="flex items-center gap-3">
                    <StepperButton
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                      label={dict.booking.fewerGuests}
                    >
                      <Minus className="size-4" strokeWidth={2.25} />
                    </StepperButton>

                    <input
                      id={`${baseId}-guests`}
                      type="number"
                      inputMode="numeric"
                      value={guests}
                      min={1}
                      max={BOOKING_LIMITS.maxGuests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      aria-invalid={Boolean(errors.guests)}
                      className={`${fieldBase} border-sand/20 flex-1 text-center tabular-nums
                                  [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
                                  [&::-webkit-outer-spin-button]:appearance-none`}
                    />

                    <StepperButton
                      onClick={() =>
                        setGuests((g) => Math.min(BOOKING_LIMITS.maxGuests, g + 1))
                      }
                      disabled={guests >= BOOKING_LIMITS.maxGuests}
                      label={dict.booking.moreGuests}
                    >
                      <Plus className="size-4" strokeWidth={2.25} />
                    </StepperButton>
                  </div>
                </Field>

                {/* Live stay summary */}
                {nights ? (
                  <p className="flex items-center gap-2 rounded-lg border border-champagne/25 bg-champagne/5 px-3.5 py-2.5 text-sm text-champagne-light">
                    <Check className="size-4 shrink-0" strokeWidth={2.25} aria-hidden="true" />
                    {fmt(dict.booking.summary, { nights, guests })}
                  </p>
                ) : null}

                <Field
                  id={`${baseId}-name`}
                  label={dict.booking.fields.name}
                  icon={<User className="size-4" strokeWidth={1.75} />}
                  error={errorText("name")}
                >
                  <input
                    id={`${baseId}-name`}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    maxLength={BOOKING_LIMITS.maxNameLength}
                    placeholder={dict.booking.placeholders.name}
                    required
                    aria-invalid={Boolean(errors.name)}
                    className={`${fieldBase} ${errors.name ? "border-red-400/60" : "border-sand/20"}`}
                  />
                </Field>

                <Field
                  id={`${baseId}-phone`}
                  label={dict.booking.fields.phone}
                  icon={<Phone className="size-4" strokeWidth={1.75} />}
                  error={errorText("phone")}
                >
                  <input
                    id={`${baseId}-phone`}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    maxLength={BOOKING_LIMITS.maxPhoneLength}
                    placeholder={dict.booking.placeholders.phone}
                    required
                    aria-invalid={Boolean(errors.phone)}
                    className={`${fieldBase} ${errors.phone ? "border-red-400/60" : "border-sand/20"}`}
                  />
                </Field>

                <Field
                  id={`${baseId}-note`}
                  label={dict.booking.fields.note}
                  optionalLabel={dict.booking.optional}
                  error={errorText("note")}
                >
                  <textarea
                    id={`${baseId}-note`}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    maxLength={BOOKING_LIMITS.maxNoteLength}
                    placeholder={dict.booking.placeholders.note}
                    className={`${fieldBase} border-sand/20 resize-none py-3 leading-relaxed`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={pending}
                  className="mt-1 inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full
                             bg-champagne px-7 text-base font-medium text-ink
                             shadow-[0_6px_24px_-10px_rgba(201,163,92,0.9)]
                             transition-[background-color,transform,box-shadow] duration-300
                             hover:bg-champagne-light active:scale-[0.98]
                             disabled:pointer-events-none disabled:opacity-60"
                >
                  {pending ? (
                    <LoaderCircle className="size-4.5 animate-spin" strokeWidth={2.25} aria-hidden="true" />
                  ) : (
                    <Send className="size-4.5" strokeWidth={2.25} aria-hidden="true" />
                  )}
                  {pending ? dict.booking.submitting : dict.booking.submit}
                </button>

                <p className="text-center text-xs leading-relaxed text-stone">
                  {dict.booking.disclaimer}
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  icon,
  optionalLabel,
  error,
  children,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  optionalLabel?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-sand"
      >
        {icon ? <span className="text-champagne">{icon}</span> : null}
        {label}
        {optionalLabel ? (
          <span className="text-xs font-normal text-stone">{optionalLabel}</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          role="alert"
          className="flex items-start gap-1.5 text-xs leading-snug text-red-300"
        >
          <TriangleAlert className="mt-px size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StepperButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg border
                 border-sand/20 text-ivory transition-colors duration-200
                 hover:border-champagne hover:text-champagne-light
                 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function SentPanel({
  dict,
  onReset,
  statusRef,
}: {
  dict: Dictionary;
  onReset: () => void;
  statusRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col items-center gap-4 py-4 text-center outline-none">
      <span className="inline-flex size-14 items-center justify-center rounded-full border border-champagne/40 bg-champagne/10 text-champagne">
        <Check className="size-7" strokeWidth={2} aria-hidden="true" />
      </span>
      <h3 className="font-display text-2xl font-light text-ivory">{dict.booking.sent.heading}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-sand-deep">{dict.booking.sent.body}</p>
      <button
        type="button"
        onClick={onReset}
        className="min-h-11 text-sm text-champagne-light underline underline-offset-4 transition-colors hover:text-champagne"
      >
        {dict.booking.sent.again}
      </button>
    </div>
  );
}

function ManualPanel({
  dict,
  message,
  telegramHref,
  callHref,
  copied,
  onCopy,
  onReset,
  statusRef,
}: {
  dict: Dictionary;
  message: string;
  telegramHref: string | null;
  callHref: string | null;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
  statusRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col gap-5 outline-none">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-2xl leading-tight font-light text-ivory">
          {dict.booking.manual.heading}
        </h3>
        <p className="text-sm leading-relaxed text-sand-deep">{dict.booking.manual.body}</p>
      </div>

      <pre className="max-h-48 overflow-auto rounded-lg border border-sand/15 bg-ink p-3.5 text-xs leading-relaxed whitespace-pre-wrap text-sand">
        {message}
      </pre>

      <div className="flex flex-col gap-2.5">
        {telegramHref ? (
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full
                       bg-[#2AABEE] px-6 text-base font-medium text-white
                       transition-[background-color,transform] duration-300
                       hover:bg-[#229ED9] active:scale-[0.98]"
          >
            <SocialIcon id="telegram" instanceId="booking" className="size-5" />
            {dict.booking.manual.telegram}
            <ChevronRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
          </a>
        ) : null}

        {callHref ? (
          <a
            href={callHref}
            data-call-cta=""
            className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full
                       border border-sand/30 px-6 text-base font-medium text-ivory
                       transition-colors duration-300 hover:border-champagne hover:text-champagne-light"
          >
            <Phone className="size-4.5" strokeWidth={2.25} aria-hidden="true" />
            {dict.booking.manual.call}
          </a>
        ) : null}

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex min-h-11 items-center justify-center gap-2 text-sm text-sand-deep
                     transition-colors duration-200 hover:text-ivory"
        >
          {copied ? (
            <Check className="size-4 text-champagne" strokeWidth={2.25} aria-hidden="true" />
          ) : (
            <Copy className="size-4" strokeWidth={1.75} aria-hidden="true" />
          )}
          {copied ? dict.booking.manual.copied : dict.booking.manual.copy}
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="min-h-11 text-sm text-stone underline underline-offset-4 transition-colors hover:text-sand"
      >
        {dict.booking.sent.again}
      </button>
    </div>
  );
}
