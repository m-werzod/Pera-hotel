import Link from "next/link";
import { brand } from "@/config/hotel";
import { buttonClass } from "@/components/ui/button-styles";
import { CallLink } from "@/components/ui/call-link";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function NotFound() {
  const dict = getDictionary(defaultLocale);

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-7 px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-4xl font-light text-ivory sm:text-5xl">{brand.name}</h1>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonClass("solid", "md")}>
          {brand.nameParts.primary}
        </Link>
        <CallLink
          label={dict.actions.call}
          ariaLabel={dict.actions.callAria}
          variant="outline"
        />
      </div>
    </main>
  );
}
