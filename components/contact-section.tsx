import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { contact, location } from "@/config/hotel";
import { getAllCallTargets } from "@/lib/phone";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { sectionIds } from "@/lib/navigation";
import { DirectionsLink } from "./ui/directions-link";
import { SocialIcon } from "./ui/social-icon";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

type ContactSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

export function ContactSection({ locale, dict }: ContactSectionProps) {
  const callTargets = getAllCallTargets();

  return (
    <section
      id={sectionIds.contact}
      className="scroll-mt-24 border-t border-sand/10 bg-ink py-14 sm:py-20 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={dict.contact.eyebrow}
          heading={dict.contact.heading}
          lede={dict.contact.lede}
          align="center"
        />

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:gap-5 lg:mt-14">
          {/* Phone — the primary conversion path, so it gets the most weight. */}
          {callTargets.length > 0 ? (
            <Reveal>
              <div className="rounded-xl border border-champagne/25 bg-gradient-to-b from-champagne/8 to-transparent p-6 sm:p-8">
                <h3 className="eyebrow mb-4 text-center">{dict.contact.phoneLabel}</h3>
                <ul className="flex flex-col items-center gap-3">
                  {callTargets.map((target) => (
                    <li key={target.e164}>
                      <a
                        href={target.href}
                        data-call-cta=""
                        className="group inline-flex min-h-12 items-center gap-3 font-display text-2xl
                                   font-light tracking-wide text-ivory transition-colors duration-300
                                   hover:text-champagne-light sm:text-3xl"
                      >
                        <Phone
                          className="size-5 shrink-0 text-champagne transition-transform duration-300 group-hover:scale-110"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        <span className="tabular-nums">{target.display}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <Reveal delay={80}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-sand/12 bg-ink-800 p-6">
                <MapPin className="size-5 text-champagne" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="text-sm font-medium text-ivory">{dict.location.addressLabel}</h3>
                <p className="text-sm leading-relaxed text-sand-deep">
                  {location.streetAddress?.[locale] ?? location.label[locale]}
                </p>
                <div className="mt-auto pt-3">
                  <DirectionsLink
                    label={dict.actions.getDirections}
                    ariaLabel={dict.actions.directionsAria}
                    variant="outline"
                    size="sm"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="flex h-full flex-col gap-5 rounded-xl border border-sand/12 bg-ink-800 p-6">
                {contact.email ? (
                  <div className="flex flex-col gap-2">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-ivory">
                      <Mail className="size-4 text-champagne" strokeWidth={1.75} aria-hidden="true" />
                      {dict.contact.emailLabel}
                    </h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm break-all text-sand-deep transition-colors duration-200 hover:text-champagne-light"
                    >
                      {contact.email}
                    </a>
                  </div>
                ) : null}

                {contact.receptionHours ? (
                  <div className="flex flex-col gap-2">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-ivory">
                      <Clock className="size-4 text-champagne" strokeWidth={1.75} aria-hidden="true" />
                      {dict.contact.hoursLabel}
                    </h3>
                    <p className="text-sm text-sand-deep">{contact.receptionHours[locale]}</p>
                  </div>
                ) : null}

                {contact.social.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-ivory">{dict.contact.followLabel}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {contact.social.map((item) => (
                        <li key={item.id}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sand/20
                                       px-4 text-sm text-ivory transition-colors duration-300
                                       hover:border-champagne hover:bg-champagne/5"
                          >
                            <SocialIcon id={item.id} instanceId={`contact-${item.id}`} className="size-5" />
                            {item.label}
                            <ArrowUpRight className="size-3.5 text-sand-deep" strokeWidth={1.75} aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Nothing optional configured yet — repeat the one action that
                    always works rather than leaving an empty card. */}
                {!contact.email && !contact.receptionHours && contact.social.length === 0 ? (
                  <div className="flex flex-col gap-3">
                    <Phone className="size-5 text-champagne" strokeWidth={1.75} aria-hidden="true" />
                    <h3 className="text-sm font-medium text-ivory">{dict.contact.phoneLabel}</h3>
                    <p className="text-sm leading-relaxed text-sand-deep">{dict.rooms.lede}</p>
                  </div>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
