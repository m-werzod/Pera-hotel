import { Phone } from "lucide-react";
import { getPrimaryCallTarget } from "@/lib/phone";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button-styles";

type CallLinkProps = {
  /** Visible label. Always a dictionary string, never hard-coded copy. */
  label: string;
  /** Accessible name when the label alone is ambiguous. */
  ariaLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  showIcon?: boolean;
  /**
   * `badge` seats the icon in a round plate — used for the hero's primary
   * action, where the button carries real visual weight. `inline` is the
   * quieter treatment for secondary placements.
   */
  iconStyle?: "inline" | "badge";
  /**
   * Appends the configured number to the label. Off by default: the number is
   * already shown in full in the contact section, the footer and the sticky
   * bar, and repeating it inside a button makes the button long and noisy.
   */
  showNumber?: boolean;
};

/**
 * The only component that renders a `tel:` link.
 *
 * If no valid number is configured it renders nothing rather than a dead
 * button — the site must never show a call action that does not call.
 */
export function CallLink({
  label,
  ariaLabel,
  variant = "solid",
  size = "md",
  className = "",
  showIcon = true,
  iconStyle = "inline",
  showNumber = false,
}: CallLinkProps) {
  const target = getPrimaryCallTarget();
  if (!target) return null;

  const badge = iconStyle === "badge";

  return (
    <a
      href={target.href}
      aria-label={ariaLabel ?? `${label} — ${target.display}`}
      data-call-cta=""
      className={buttonClass(
        variant,
        size,
        // The badge sits flush, so the leading padding tightens to match.
        `group ${badge ? "gap-3 pl-2" : ""} ${className}`,
      )}
    >
      {showIcon ? (
        badge ? (
          <span
            aria-hidden="true"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full
                       bg-ink/15 transition-transform duration-500
                       ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          >
            <Phone className="size-[1.15rem]" strokeWidth={2.25} />
          </span>
        ) : (
          <Phone
            className="size-[1.2em] shrink-0"
            strokeWidth={2.25}
            aria-hidden="true"
          />
        )
      ) : null}

      <span>{label}</span>

      {showNumber ? (
        <span className="hidden tabular-nums opacity-75 sm:inline">{target.display}</span>
      ) : null}
    </a>
  );
}
