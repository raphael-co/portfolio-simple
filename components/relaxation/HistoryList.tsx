"use client";

import { RunResult, lsSet, LS_PREFIX, FALSE_START_PENALTY_MS } from "./utils";

export default function HistoryList({
  locale,
  history,
  onClear,
}: {
  locale: string;
  history: RunResult[];
  onClear: () => void;
}) {
  const t = {
    title: locale === "fr" ? "Historique (local)" : "History (local)",
    none: locale === "fr" ? "Aucun score enregistré." : "No scores yet.",
    date: locale === "fr" ? "Date" : "Date",
    total: locale === "fr" ? "Total" : "Total",
    trials: locale === "fr" ? "Essais" : "Trials",
    falseStarts: locale === "fr" ? "Faux départs" : "False starts",
    penalty: locale === "fr" ? "Pénalité" : "Penalty",
    clear: locale === "fr" ? "Vider l’historique" : "Clear history",
  };

  return (
    <div className="mt-6 rounded-2xl border dark:border-white/10 p-4 sm:p-5">
      <h3 className="text-base font-semibold sm:text-lg">{t.title}</h3>

      {history.length === 0 ? (
        <p className="mt-3 text-sm opacity-70">{t.none}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {history.map((r) => {
            const penaltyMs = r.falseStarts * FALSE_START_PENALTY_MS;
            return (
              <li
                key={r.timestamp}
                className="rounded-xl border dark:border-white/10 p-3 sm:p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm opacity-80">{t.date}</span>
                    <span className="rounded-full border px-2 py-0.5 text-xs dark:border-white/10">
                      {r.dateKey}
                    </span>
                    <span className="hidden text-sm opacity-50 sm:inline">•</span>
                    <span className="text-sm opacity-80">{t.total}</span>
                    <span className="text-sm font-semibold">
                      {r.totalMs.toFixed(0)} ms
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-70">{t.falseStarts}</span>
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        r.falseStarts > 0
                          ? "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300"
                          : "bg-zinc-200/60 text-zinc-700 dark:bg-white/10 dark:text-zinc-200",
                      ].join(" ")}
                    >
                      {r.falseStarts}
                    </span>
                    {r.falseStarts > 0 && (
                      <>
                        <span className="text-xs opacity-50">•</span>
                        <span className="text-xs opacity-80">
                          {t.penalty}: +{penaltyMs} ms
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid gap-1 sm:grid-cols-12 sm:gap-2">
                  <div className="sm:col-span-2 text-xs sm:text-sm opacity-70">
                    {t.trials}
                  </div>
                  <div className="sm:col-span-10">
                    <div className="flex flex-wrap gap-1.5">
                      {r.trials.map((v, i) => (
                        <span
                          key={i}
                          className="rounded-md border px-2 py-0.5 text-xs sm:text-sm dark:border-white/10"
                        >
                          {v.toFixed(0)} ms
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {history.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => {
              lsSet(`${LS_PREFIX}:history`, []);
              onClear();
            }}
            className="text-xs opacity-60 hover:opacity-100 underline"
          >
            {t.clear}
          </button>
        </div>
      )}
    </div>
  );
}
