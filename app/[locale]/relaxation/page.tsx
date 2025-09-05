import GameTabs from "@/components/relaxation/GameTabs";
import InfoModalButton from "@/components/relaxation/InfoModal";
import { Section } from "@/components/ui";

import { type Locale } from "@/lib/i18n";

export const metadata = { title: "Relaxation — Raphael Comandon" };

export default async function Page({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale = "fr" } = await params;

    return (
        <Section className="py-12">
            <header className="flex items-start justify-between gap-4">
                <div className="space-y-2 md:space-y-3">
                    <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                        {locale === "fr"
                            ? "Zone de détente — Mini-jeux"
                            : "Relaxation Zone — Mini-games"}
                    </h1>
                    <p className="max-w-3xl text-pretty text-sm opacity-80 sm:text-base">
                        {locale === "fr"
                            ? "Deux mini-jeux simples, relaxants et compétitifs. 5 réactions chronométrées par jour (basées sur la date), ou un défi visé-clic avec 20 cibles."
                            : "Two simple, calming, competitive mini-games. 5 timed reactions per day (based on the date), or an aim-and-click challenge with 20 targets."}
                    </p>
                </div>

                <InfoModalButton locale={locale} />
            </header>

            <section className="mt-8">
                <GameTabs locale={locale} />
            </section>
        </Section>
    );
}
