"use client";

type Pos = { x: number; y: number };

export default function Playfield({
  state,
  hits,
  targetCount,
  index,
  positions,
  finalMs,
  labels,
  onPlayfieldClick,
  onStart,
  onTargetClick,
  onShare,
}: {
  state: "idle" | "running" | "finished";
  hits: number;
  targetCount: number;
  index: number;
  positions: Pos[];
  finalMs: number;
  labels: {
    start: string;
    finished: string;
    playAgain: string;
    copy: string;
  };
  onPlayfieldClick: () => void;
  onStart: () => void;
  onTargetClick: (e: React.MouseEvent) => void;
  onShare: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPlayfieldClick}
      className={[
        "relative aspect-square w-full max-w-[420px] select-none rounded-3xl",
        "transition-colors duration-150 outline-none",
        state === "idle" && "bg-zinc-100 dark:bg-zinc-900",
        state === "running" && "bg-black/[0.04] dark:bg-white/[0.06]",
        state === "finished" && "bg-violet-500/90 text-white",
      ].join(" ")}
    >
      {state === "idle" && (
        <div className="absolute inset-0 grid place-items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            {labels.start}
          </button>
        </div>
      )}

      {state === "running" && (
        <>
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white dark:bg-white/20">
            {hits}/{targetCount}
          </div>
          {positions[index] && (
            <div
              onClick={onTargetClick}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-emerald-500 shadow-lg outline-none ring-0 active:scale-95"
              style={{
                left: `${positions[index].x}%`,
                top: `${positions[index].y}%`,
                width: 44,
                height: 44,
              }}
              aria-label="target"
            />
          )}
        </>
      )}

      {state === "finished" && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl sm:text-3xl font-semibold">
              {finalMs.toFixed(0)} ms
            </span>
            <span className="text-sm opacity-80">{labels.finished}</span>
            <div className="mt-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStart();
                }}
                className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black"
              >
                {labels.playAgain}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium"
              >
                {labels.copy}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}