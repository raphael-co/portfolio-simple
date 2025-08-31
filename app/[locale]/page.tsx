import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import Home from "@/components/home";

export const metadata: Metadata = {
  title: "Contact — Raphael Comandon",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <Home locale={locale} />;
}
