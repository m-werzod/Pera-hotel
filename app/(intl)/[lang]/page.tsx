import { notFound } from "next/navigation";
import { HomePage } from "@/components/home-page";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

type Params = { lang: string };

export const dynamic = "force-static";

export default async function Page({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === defaultLocale) notFound();

  return <HomePage locale={lang} />;
}
