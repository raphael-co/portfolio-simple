import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import ContactClient from "@/components/contact-client";
import { getDict } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact — Raphael Comandon",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  getDict(locale);
  return <ContactClient locale={locale} />;
}
