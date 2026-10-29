import { Navigation } from "lucide-react";
import { getMapDestination } from "@/lib/maps";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button-styles";

type DirectionsLinkProps = {
  label: string;
  ariaLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Opens directions in Google Maps.
 *
 * The destination comes from `lib/maps.ts`, which falls back to a name search
 * while the exact pin is unconfirmed — so the link always resolves to
 * something real, never to fabricated coordinates.
 */
export function DirectionsLink({
  label,
  ariaLabel,
  variant = "outline",
  size = "md",
  className = "",
}: DirectionsLinkProps) {
  const { directionsHref } = getMapDestination();

  return (
    <a
      href={directionsHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ?? label}
      className={buttonClass(variant, size, className)}
    >
      <Navigation className="size-[1.05em] shrink-0" strokeWidth={2} aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
