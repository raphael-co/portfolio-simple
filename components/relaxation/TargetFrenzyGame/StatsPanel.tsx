"use client";

export default function StatsPanel({
  locale,
  hits,
  misses,
  baseMs,
  penaltyMs,
  finalMs,
  state,
  labels,
  onStart,
  onShare,
  onReset,
}: {
  locale: string;
  hits: number;
  misses: number;
  baseMs: number;
  penaltyMs: number;
  finalMs: number;
  state: "idle" | "running" | "finished";
  labels: {
    stats: string;
    hits: string;
    misses: string;
    base: string;
    penalty: string;
    total: string;
    start: string;
    copy: string;
    reset: string;
  };
  onStart: () => void;
  onShare: () => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border p-4 sm:p-5 dark:border-white/10">
      <h3 className="text-base font-semibold sm:text-lg">{labels.stats}</h3>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border p-3 dark:border-white/10">
          <div className="opacity-70">{labels.hits}</div>
          <div className="mt-1 text-base font-semibold">{hits}</div>
        </div>
        <div className="rounded-xl border p-3 dark:border-white/10">
          <div className="opacity-70">{labels.misses}</div>
          <div className="mt-1 text-base font-semibold">{misses}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl border p-3 dark:border-white/10">
          <div className="opacity-70">{labels.base}</div>
          <div className="mt-1 text-base font-semibold">
            {baseMs > 0 ? `${baseMs.toFixed(0)} ms` : "—"}
          </div>
        </div>
        <div className="rounded-xl border p-3 dark:border-white/10">
          <div className="opacity-70">{labels.penalty}</div>
          <div className="mt-1 text-base font-semibold">
            {penaltyMs > 0 ? `+ ${penaltyMs.toFixed(0)} ms` : "0 ms"}
          </div>
        </div>
        <div className="rounded-xl border p-3 dark:border-white/10">
          <div className="opacity-70">{labels.total}</div>
          <div className="mt-1 text-base font-semibold">
            {finalMs > 0 ? `${finalMs.toFixed(0)} ms` : "—"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {state !== "running" && (
          <button
            onClick={onStart}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white"
          >
            {labels.start}
          </button>
        )}
        {state === "finished" && (
          <button
            onClick={onShare}
            className="rounded-full border px-4 py-2 text-sm dark:border-white/10"
          >
            {labels.copy}
          </button>
        )}
        {state !== "idle" && (
          <button
            onClick={onReset}
            className="rounded-full border px-4 py-2 text-sm dark:border-white/10"
          >
            {labels.reset}
          </button>
        )}
      </div>
    </div>
  );
}