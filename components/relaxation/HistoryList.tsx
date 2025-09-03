"use client";

import { RunResult, lsSet, LS_PREFIX } from "./utils";

export default function HistoryList({
  locale,
  history,
  onClear,
}: {
  locale: string;
  history: RunResult[];
  onClear: () => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border dark:border-white/10 p-4 sm:p-5">
      <h3 className="text-base font-semibold sm:text-lg">
        {locale === "fr" ? "Historique (local)" : "History (local)"}
      </h3>
      <ul className="mt-3 space-y-2">
        {history.length === 0 ? (
          <li className="text-sm opacity-70">
            {locale === "fr" ? "Aucun score enregistré." : "No scores yet."}
          </li>
        ) : (
          history.map((r, idx) => (
            <li
              key={r.timestamp + "-" + idx}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm dark:border-white/10"
            >
              <span className="opacity-80">
                {r.dateKey} · {r.trials.map((t) => t.toFixed(0)).join(", ")}
              </span>
              <span className="font-medium">{r.totalMs.toFixed(0)} ms</span>
            </li>
          ))
        )}
      </ul>
      {history.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => {
              lsSet(`${LS_PREFIX}:history`, []);
              onClear();
            }}
            className="text-xs opacity-60 hover:opacity-100 underline"
          >
            {locale === "fr" ? "Vider l’historique" : "Clear history"}
          </button>
        </div>
      )}
    </div>
  );
}
