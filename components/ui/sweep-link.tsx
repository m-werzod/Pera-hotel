import { ArrowRight } from "lucide-react";
import type { ButtonSize } from "./button-styles";

type SweepLinkProps = {
  href: string;
  label: string;
  size?: ButtonSize;
  className?: string;
  /** Pale fill for dark backgrounds (hero); champagne elsewhere. */
  tone?: "ivory" | "champagne";
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-5 text-sm",
  md: "min-h-12 px-6 text-sm sm:text-base",
  lg: "min-h-13 px-7 text-base",
};

/**
 * Secondary call-to-action.
 *
 * On hover or keyboard focus a solid panel wipes in from the left and the
 * label flips to dark, with the arrow sliding forward. The panel is a
 * decorative layer behind the content (`-z-10` inside an `isolate` stacking
 * context), so it never intercepts the click, and the whole effect is two
 * transforms — no layout work, and `prefers-reduced-motion` collapses it to
 * an instant state change via the global rule in `globals.css`.
 */
export function SweepLink({
  href,
  label,
  size = "md",
  className = "",
  tone = "ivory",
}: SweepLinkProps) {
  const fill = tone === "ivory" ? "bg-ivory" : "bg-champagne";

  return (
    <a
      href={href}
      className={[
        "group relative isolate inline-flex items-center justify-center gap-2.5",
        "overflow-hidden rounded-full border border-sand/40 font-medium text-ivory",
        "backdrop-blur-sm transition-colors duration-500",
        "ease-[cubic-bezier(0.22,1,0.36,1)] select-none",
        "hover:border-transparent hover:text-ink",
        "focus-visible:border-transparent focus-visible:text-ink",
        "active:scale-[0.98]",
        sizes[size],
        className,
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "absolute inset-0 -z-10 origin-left scale-x-0 rounded-full",
          fill,
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:scale-x-100 group-focus-visible:scale-x-100",
        ].join(" ")}
      />
      <span>{label}</span>
      <ArrowRight
        className="size-[1.2em] shrink-0 transition-transform duration-500
                   ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
        strokeWidth={2}
        aria-hidden="true"
      />
    </a>
  );
}
