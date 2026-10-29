import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  CircleParking,
  Images,
  Mail,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  Play,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Tv,
  Users,
  UtensilsCrossed,
  Wifi,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit icon registry.
 *
 * `config/hotel.ts` refers to icons by name, so this map is what keeps those
 * strings type-safe and the bundle small — we never pull in the whole of
 * lucide-react. Add an icon here when a facility or highlight needs it.
 */
export const icons = {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleParking,
  Clock,
  Coffee,
  Images,
  Mail,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  Play,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Tv,
  Users,
  UtensilsCrossed,
  Wifi,
  Wind,
  X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function isIconName(name: string): name is IconName {
  return name in icons;
}

type IconProps = {
  name: string;
  className?: string;
  /** Icons are decorative by default; the surrounding text carries meaning. */
  "aria-hidden"?: boolean;
  strokeWidth?: number;
};

/** Resolves a config icon name, falling back to a neutral mark if unknown. */
export function Icon({ name, className, strokeWidth = 1.5 }: IconProps) {
  const Component = isIconName(name) ? icons[name] : Sparkles;
  return (
    <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />
  );
}
