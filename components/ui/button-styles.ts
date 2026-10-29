export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-medium " +
  "transition-[background-color,color,border-color,transform,box-shadow] duration-300 " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] select-none";

const variants: Record<ButtonVariant, string> = {
  solid:
    "bg-champagne text-ink shadow-[0_6px_24px_-10px_rgba(201,163,92,0.9)] " +
    "hover:bg-champagne-light hover:shadow-[0_10px_32px_-10px_rgba(227,201,141,0.95)]",
  outline:
    "border border-sand/35 text-ivory hover:border-champagne hover:text-champagne-light " +
    "hover:bg-champagne/5",
  ghost: "text-ivory hover:text-champagne-light",
};

/** Minimum 44px tall at every size, for comfortable tapping. */
const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-5 text-sm",
  md: "min-h-12 px-6 text-sm sm:text-base",
  lg: "min-h-13 px-7 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "solid",
  size: ButtonSize = "md",
  extra = "",
): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}
