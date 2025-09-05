"use client";

import type { TFRun } from "./types";

export default function HistoryList({
  history,
  labels,
  onClear,
  targetCount,
}: {
  history: TFRun[];
  labels: {
    title: string;
    none: string;
    misses: string;
    clear: string;
  };
  onClear: () => void;
  targetCount: number;
}) {
  return (
    <div className="mt-6 rounded-2xl border p-4 sm:p-5 dark:border-white/10">
      <h3 className="text-base font-semibold sm:text-lg">{labels.title}</h3>
      {history.length === 0 ? (
        <p className="mt-3 text-sm opacity-70">{labels.none}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {history.map((r) => (
            <li
              key={r.timestamp}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm dark:border-white/10"
            >
              <span className="opacity-80">
                {r.dateKey} · {r.hits}/{targetCount} · {labels.misses.toLowerCase()} {r.misses}
              </span>
              <span className="font-medium">{r.ms.toFixed(0)} ms</span>
            </li>
          ))}
        </ul>
      )}
      {history.length > 0 && (
        <div className="mt-3">
          <button
            onClick={onClear}
            className="text-xs opacity-60 hover:opacity-100 underline"
          >
            {labels.clear}
          </button>
        </div>
      )}
    </div>
  );
}