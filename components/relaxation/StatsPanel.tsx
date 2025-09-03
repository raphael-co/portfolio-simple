"use client";

import { formatMs } from "./utils";

type Props = {
  locale: string;
  trialsPerRun: number;
  trialTimes: number[];
  trialIndex: number;
  falseStarts: number;
  totalMs: number;
  isIdle: boolean;
  isFinished: boolean;
  onStartOrReset: () => void;
  onShare: () => void;
};

export default function StatsPanel({
  locale,
  trialsPerRun,
  trialTimes,
  trialIndex,
  falseStarts,
  totalMs,
  isIdle,
  isFinished,
  onStartOrReset,
  onShare,
}: Props) {
  return (
    <div className="rounded-2xl border dark:border-white/10 p-4 sm:p-5">
      <h3 className="text-base font-semibold sm:text-lg">
        {locale === "fr" ? "Résultats de la manche" : "Run Results"}
      </h3>
      <ul className="mt-3 space-y-2">
        {Array.from({ length: trialsPerRun }).map((_, i) => {
          const val = trialTimes[i];
          const active = i === trialIndex && !isFinished;
          return (
            <li
              key={i}
              className={[
                "flex items-center justify-between rounded-xl border px-3 py-2 text-sm dark:border-white/10",
                active ? "bg-black/5 dark:bg-white/5" : "",
              ].join(" ")}
            >
              <span className="opacity-80">
                {locale === "fr" ? "Essai" : "Trial"} {i + 1}
              </span>
              <span className="font-medium">
                {typeof val === "number" ? formatMs(val) : "—"}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm opacity-80">
          {locale === "fr" ? "Faux départs" : "False starts"}
        </div>
        <div className="text-sm font-medium">{falseStarts}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-base font-semibold">
          {locale === "fr" ? "Total" : "Total"}
        </div>
        <div className="text-base font-semibold">
          {trialTimes.length ? `${totalMs.toFixed(0)} ms` : "—"}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onStartOrReset}
          className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          {isIdle
            ? locale === "fr"
              ? "Démarrer"
              : "Start"
            : locale === "fr"
            ? "Réinitialiser"
            : "Reset"}
        </button>
        {isFinished && (
          <button
            onClick={onShare}
            className="rounded-full border px-4 py-2 text-sm dark:border-white/10"
          >
            {locale === "fr" ? "Copier le score" : "Copy score"}
          </button>
        )}
      </div>
    </div>
  );
}
