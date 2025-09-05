"use client";

import { useMemo, useState } from "react";
import type { SJRun } from "./types";

type Labels = {
  title: string;
  none: string;
  clear: string;
  showMore?: string;
  showLess?: string;
  scoreLabel?: string;
  coinsLabel?: string;
  dateLabel?: string;
  timeLabel?: string;
};

export default function HistoryList({
  history,
  labels,
  onClear,
  locale = "fr",
  initiallyExpanded = false,
  collapsedCount = 3,
}: {
  history: SJRun[];
  labels: Labels;
  onClear: () => void;
  locale?: string;
  initiallyExpanded?: boolean;
  collapsedCount?: number;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const L = useMemo<Required<Labels>>(
    () => ({
      title: labels.title,
      none: labels.none,
      clear: labels.clear,
      showMore: labels.showMore ?? (locale === "fr" ? "Afficher plus" : "Show more"),
      showLess: labels.showLess ?? (locale === "fr" ? "Afficher moins" : "Show less"),
      scoreLabel: labels.scoreLabel ?? (locale === "fr" ? "Score" : "Score"),
      coinsLabel: labels.coinsLabel ?? (locale === "fr" ? "Pièces" : "Coins"),
      dateLabel: labels.dateLabel ?? (locale === "fr" ? "Date" : "Date"),
      timeLabel: labels.timeLabel ?? (locale === "fr" ? "Heure" : "Time"),
    }),
    [labels, locale]
  );

  const shown = expanded ? history : history.slice(0, collapsedCount);
  
  return (
    <div className="mt-6 rounded-2xl border p-4 sm:p-5 dark:border-white/10">
      <h3 className="text-base font-semibold sm:text-lg">{L.title}</h3>

      {history.length === 0 ? (
        <p className="mt-3 text-sm opacity-70">{L.none}</p>
      ) : (
        <>
          <ul className="mt-3 space-y-2">
            {shown.map((r) => {
              const d = new Date(r.timestamp);
              const date = d.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit" });
              const time = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

              return (
                <li
                  key={r.timestamp}
                  className="rounded-xl border p-3 text-sm dark:border-white/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
                        {r.dateKey}
                      </span>
                      <span className="opacity-70">{L.dateLabel} :</span>
                      <span className="font-medium">{date}</span>
                      <span className="opacity-70">· {L.timeLabel} :</span>
                      <span className="font-medium">{time}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="opacity-70">{L.scoreLabel} :</span>
                      <span className="font-semibold">{r.score}</span>
                      <span className="opacity-70">{L.coinsLabel} :</span>
                      <span className="font-semibold">{r.coins}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {history.length > collapsedCount && (
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-xs underline opacity-70 hover:opacity-100"
              >
                {expanded ? L.showLess : L.showMore}
              </button>

              <button
                onClick={onClear}
                className="text-xs underline opacity-70 hover:opacity-100"
              >
                {L.clear}
              </button>
            </div>
          )}

          {history.length <= collapsedCount && (
            <div className="mt-3">
              <button onClick={onClear} className="text-xs underline opacity-70 hover:opacity-100">
                {L.clear}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
