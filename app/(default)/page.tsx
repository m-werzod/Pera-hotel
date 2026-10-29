import { HomePage } from "@/components/home-page";
import { defaultLocale } from "@/lib/i18n/config";

/** Fully static — there is nothing request-specific on the page. */
export const dynamic = "force-static";

export default function Page() {
  return <HomePage locale={defaultLocale} />;
}
