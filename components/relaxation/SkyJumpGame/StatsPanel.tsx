"use client";

export default function StatsPanel({
  labels,
  score,
  coins,
  bestToday,
  onStart,
  state,
}: {
  labels: {
    stats: string;
    best: string;
    start: string;
    score: string;
    coins: string;
  };
  score: number;
  coins: number;
  bestToday: number | null;
  onStart: () => void;
  state: "idle" | "running" | "finished";
}) {
  return (
    <div className="rounded-2xl border p-4 sm:p-5 dark:border-white/10">
      <h3 className="text-base font-semibold sm:text-lg">{labels.stats}</h3>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl border p-3 dark:border-white/10">
          <div className="opacity-70">{labels.score}</div>
          <div className="mt-1 text-base font-semibold">{score}</div>
        </div>
        <div className="rounded-xl border p-3 dark:border-white/10">
          <div className="opacity-70">{labels.coins}</div>
          <div className="mt-1 text-base font-semibold">{coins}</div>
        </div>
        <div className="rounded-xl border p-3 dark:border-white/10">
          <div className="opacity-70">{labels.best}</div>
          <div className="mt-1 text-base font-semibold">{bestToday ?? "—"}</div>
        </div>
      </div>

      {state !== "running" && (
        <div className="mt-4">
          <button
            onClick={onStart}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white"
          >
            {labels.start}
          </button>
        </div>
      )}
    </div>
  );
}
