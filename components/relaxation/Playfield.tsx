"use client";

import { formatMs, TrialState } from "./utils";

type Props = {
  state: TrialState;
  locale: string;
  finalMs: number;
  trialIndex: number;
  readyAt: number | null;
  pressedAt: number | null;
  onStart: () => void;
  onClick: () => void;
  onShare: () => void;
  statusLabel: string;
};

export default function Playfield({
  state,
  locale,
  finalMs,
  trialIndex,
  readyAt,
  pressedAt,
  onStart,
  onClick,
  onShare,
  statusLabel,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (state === "idle") onStart();
      else onClick();
    }
  };

  return (
    <div className="relative w-full aspect-square max-w-[420px]">
      <div
        role="button"
        tabIndex={0}
        onClick={state === "idle" ? onStart : onClick}
        onKeyDown={handleKeyDown}
        aria-label="playfield"
        className={[
          "absolute inset-0 rounded-3xl transition-colors duration-150 outline-none",
          state === "idle" && "bg-zinc-100 dark:bg-zinc-900",
          state === "arming" && "bg-red-500/90 text-white",
          state === "ready" && "bg-green-500/90 text-white",
          state === "false-start" && "bg-yellow-400/90 text-black",
          state === "clicked" && "bg-blue-500/90 text-white",
          state === "finished" && "bg-violet-500/90 text-white",
        ].join(" ")}
      >
        <div className="flex h-full flex-col items-center justify-center gap-2">
          {state === "idle" ? (
            <>
              <span className="text-2xl sm:text-3xl font-semibold">
                {locale === "fr" ? "Commencer" : "Start"}
              </span>
              <span className="text-sm opacity-80">
                {locale === "fr"
                  ? "Clique lorsque l’écran devient vert"
                  : "Click when the screen turns green"}
              </span>
            </>
          ) : state === "finished" ? (
            <>
              <span className="text-2xl sm:text-3xl font-semibold">
                {finalMs.toFixed(0)} ms
              </span>
              <span className="text-sm opacity-80">
                {locale === "fr" ? "Terminé" : "Finished"}
              </span>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart();
                  }}
                  className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black"
                >
                  {locale === "fr" ? "Rejouer" : "Play again"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                  className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium"
                >
                  {locale === "fr" ? "Copier le score" : "Copy score"}
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-3xl sm:text-4xl font-semibold">
                {statusLabel}
              </span>
              {state === "ready" && readyAt && (
                <span className="text-sm opacity-90">
                  {locale === "fr" ? "Essai" : "Trial"} {trialIndex + 1}/5
                </span>
              )}
              {state === "false-start" && (
                <span className="text-sm opacity-90">
                  {locale === "fr" ? "Fausse départ" : "False start"}
                </span>
              )}
              {state === "clicked" && readyAt && pressedAt && (
                <span className="text-xl font-medium">
                  {formatMs(pressedAt - readyAt)}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
