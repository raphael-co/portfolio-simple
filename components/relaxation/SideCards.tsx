export function RulesCard({ locale }: { locale: string }) {
  return (
    <div className="rounded-2xl border dark:border-white/10 p-4 sm:p-5">
      <h3 className="text-base font-semibold sm:text-lg">
        {locale === "fr" ? "Règles" : "Rules"}
      </h3>
      <ol className="mt-3 list-inside list-decimal space-y-2 text-sm opacity-90">
        <li>
          {locale === "fr"
            ? "5 essais par manche. L’écran passe au vert → clique le plus vite possible."
            : "5 trials per run. When the screen turns green → click as fast as possible."}
        </li>
        <li>
          {locale === "fr"
            ? "Faux départs autorisés, mais ils ne comptent pas dans le temps total."
            : "False starts are allowed, but they don’t add to your total time."}
        </li>
        <li>
          {locale === "fr"
            ? "La difficulté est seedée par la date, identique pour tout le monde le même jour."
            : "Difficulty is seeded by date, identical for everyone on the same day."}
        </li>
      </ol>
    </div>
  );
}

export function TipsCard({ locale }: { locale: string }) {
  return (
    <div className="rounded-2xl border dark:border-white/10 p-4 sm:p-5">
      <h3 className="text-base font-semibold sm:text-lg">
        {locale === "fr" ? "Astuces" : "Tips"}
      </h3>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm opacity-90">
        <li>
          {locale === "fr"
            ? "Regarde le centre de l’écran, pas ton curseur."
            : "Look at the center, not your cursor."}
        </li>
        <li>
          {locale === "fr"
            ? "Respire, reste détendu : la précipitation = faux départ."
            : "Breathe and stay calm: rushing = false starts."}
        </li>
        <li>
          {locale === "fr"
            ? "Reviens demain pour un nouveau seed."
            : "Come back tomorrow for a new seed."}
        </li>
      </ul>
    </div>
  );
}
