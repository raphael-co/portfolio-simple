export function RulesCard({ locale }: { locale: string }) {
    return (
        <div className="rounded-2xl border dark:border-white/10 p-4 sm:p-5">
            <h3 className="text-base font-semibold sm:text-lg">
                {locale === "fr" ? "Règles" : "Rules"}
            </h3>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm opacity-90">
                <li>
                    {locale === "fr"
                        ? "5 essais par manche. Quand l’écran devient vert, clique le plus vite possible."
                        : "5 trials per run. When the screen turns green, click as fast as you can."}
                </li>
                <li>
                    {locale === "fr"
                        ? "Chaque faux départ ajoute +200 ms au total."
                        : "Each false start adds +200 ms to your total."}
                </li>
                <li>
                    {locale === "fr"
                        ? "La difficulté est définie en fonction de la date, et identique pour tout le monde le même jour."
                        : "Difficulty is set based on the date and is the same for everyone on that day."}

                </li>
                <li>
                    {locale === "fr"
                        ? "Les scores sont stockés localement dans ton navigateur."
                        : "Scores are stored locally in your browser."}
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
                        ? "Fixe le centre de l’écran, pas le curseur."
                        : "Focus on the center of the screen, not the cursor."}
                </li>
                <li>
                    {locale === "fr"
                        ? "Respire et détends-toi : la précipitation entraîne des faux départs (+200 ms)."
                        : "Breathe and stay calm: rushing causes false starts (+200 ms)."}
                </li>
                <li>
                    {locale === "fr"
                        ? "Garde la main au même endroit pour réduire le temps de mouvement."
                        : "Keep your hand in the same spot to reduce movement time."}
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