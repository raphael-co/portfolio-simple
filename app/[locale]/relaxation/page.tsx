import InfoModalButton from "@/components/relaxation/InfoModal";
import ReactionSprintGame from "@/components/relaxation/ReactionSprintGame";
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
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 md:space-y-3">
          <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            {locale === "fr"
              ? "Zone de détente — Sprint de Réaction"
              : "Relaxation Zone — Reaction Sprint"}
          </h1>
          <p className="max-w-3xl text-pretty text-sm opacity-80 sm:text-base">
            {locale === "fr"
              ? "Un mini-jeu simple, relaxant et compétitif : 5 réactions chronométrées chaque jour, seedées par la date. Défie ton meilleur score."
              : "A simple, calming, competitive mini-game: 5 timed reactions each day, seeded by date. Beat your best score."}
          </p>
        </div>

        <InfoModalButton locale={locale} />
      </div>

      <section className="mt-8">
        <ReactionSprintGame locale={locale} />
      </section>
    </Section>
  );
}
