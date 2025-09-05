"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { todayKey, dailyRng, lsGet, lsSet } from "@/components/relaxation/ReactionSprintGame/utils";
import Playfield from "./Playfield";
import StatsPanel from "./StatsPanel";
import HistoryList from "./HistoryList";
import type { TFRun, TFState } from "./types";

const TF_PREFIX = "relax-target-frenzy";
const TARGETS_COUNT = 20;
const PENALTY_PER_MISS = 200;

export default function TargetFrenzyGame({ locale }: { locale: Locale }) {
  const dateKey = todayKey();
  const rng = useMemo(() => dailyRng(locale ?? "fr"), [locale]);

  const [state, setState] = useState<TFState>("idle");
  const [index, setIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [endAt, setEndAt] = useState<number | null>(null);

  const [bestToday, setBestToday] = useState<TFRun | null>(null);
  const [history, setHistory] = useState<TFRun[]>([]);

  useEffect(() => {
    setBestToday(lsGet<TFRun | null>(`${TF_PREFIX}:best:${dateKey}`, null));
    setHistory(lsGet<TFRun[]>(`${TF_PREFIX}:history`, []));
  }, [dateKey]);

  const positions = useMemo(() => {
    const arr: Array<{ x: number; y: number }> = [];
    const clamp = (v: number, min: number, max: number) =>
      Math.min(max, Math.max(min, v));
    for (let i = 0; i < TARGETS_COUNT; i++) {
      const x = clamp(6 + rng() * 88, 6, 94);
      const y = clamp(6 + rng() * 88, 6, 94);
      arr.push({ x, y });
    }
    return arr;
  }, [rng]);

  const baseMs = startAt != null && endAt != null ? endAt - startAt : 0;
  const penaltyMs = misses * PENALTY_PER_MISS;
  const finalMs = baseMs + penaltyMs;

  const reset = useCallback(() => {
    setState("idle");
    setIndex(0);
    setHits(0);
    setMisses(0);
    setStartAt(null);
    setEndAt(null);
  }, []);

  const start = useCallback(() => {
    reset();
    setState("running");
    setStartAt(performance.now());
  }, [reset]);

  const onPlayfieldClick = () => {
    if (state !== "running") return;
    setMisses((m) => m + 1);
  };

  const onTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state !== "running") return;
    const next = index + 1;
    setHits((h) => h + 1);
    if (next >= TARGETS_COUNT) {
      setIndex(next);
      setEndAt(performance.now());
      setState("finished");
    } else {
      setIndex(next);
    }
  };

  useEffect(() => {
    if (state !== "finished") return;
    const result: TFRun = {
      dateKey,
      ms: finalMs,
      hits,
      misses,
      timestamp: Date.now(),
    };
    const currentBest = lsGet<TFRun | null>(`${TF_PREFIX}:best:${dateKey}`, null);
    if (!currentBest || finalMs < currentBest.ms) {
      lsSet(`${TF_PREFIX}:best:${dateKey}`, result);
      setBestToday(result);
    }
    const prev = lsGet<TFRun[]>(`${TF_PREFIX}:history`, []);
    const next = [result, ...prev].slice(0, 15);
    lsSet(`${TF_PREFIX}:history`, next);
    setHistory(next);
  }, [state, dateKey, finalMs, hits, misses]);

  const share = useCallback(async () => {
    const body = `Target Frenzy — ${dateKey}
Total: ${finalMs.toFixed(0)} ms (base ${baseMs.toFixed(0)} ms${
      misses ? ` + ${misses}×${PENALTY_PER_MISS} ms` : ""
    })
Hits: ${hits}/${TARGETS_COUNT}, Misses: ${misses}
#Relaxation #Portfolio`;
    try {
      await navigator.clipboard.writeText(body);
    } catch {}
  }, [dateKey, finalMs, baseMs, hits, misses]);

  const labels =
    locale === "fr"
      ? {
          title: "Cible Express (20)",
          best: "Meilleur aujourd’hui",
          start: "Commencer",
          finished: "Terminé",
          playAgain: "Rejouer",
          copy: "Copier le score",
          hits: "Cibles",
          misses: "Ratés",
          total: "Total (avec pénalité)",
          base: "Brut",
          penalty: "Pénalité",
          history: "Historique (local)",
          none: "Aucun score enregistré.",
          clear: "Vider l’historique",
          stats: "Statistiques",
          reset: "Réinitialiser",
        }
      : {
          title: "Target Frenzy (20)",
          best: "Best today",
          start: "Start",
          finished: "Finished",
          playAgain: "Play again",
          copy: "Copy score",
          hits: "Targets",
          misses: "Misses",
          total: "Total (with penalty)",
          base: "Base",
          penalty: "Penalty",
          history: "History (local)",
          none: "No scores yet.",
          clear: "Clear history",
          stats: "Stats",
          reset: "Reset",
        };

  return (
    <div className="rounded-2xl border p-5 sm:p-6 md:p-8 dark:border-white/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">{labels.title}</h2>
          <p className="text-xs opacity-70">{TARGETS_COUNT}</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-70">{labels.best}</p>
          <p className="text-base font-medium">
            {bestToday ? `${bestToday.ms.toFixed(0)} ms` : "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-start justify-start">
          <Playfield
            state={state}
            hits={hits}
            targetCount={TARGETS_COUNT}
            index={index}
            positions={positions}
            finalMs={finalMs}
            labels={{
              start: labels.start,
              finished: labels.finished,
              playAgain: labels.playAgain,
              copy: labels.copy,
            }}
            onPlayfieldClick={onPlayfieldClick}
            onStart={start}
            onTargetClick={onTargetClick}
            onShare={share}
          />
        </div>

        <div className="flex flex-col">
          <StatsPanel
            locale={locale}
            hits={hits}
            misses={misses}
            baseMs={baseMs}
            penaltyMs={penaltyMs}
            finalMs={finalMs}
            state={state}
            labels={{
              stats: labels.stats,
              hits: labels.hits,
              misses: labels.misses,
              base: labels.base,
              penalty: labels.penalty,
              total: labels.total,
              start: labels.start,
              copy: labels.copy,
              reset: labels.reset,
            }}
            onStart={start}
            onShare={share}
            onReset={reset}
          />

          <HistoryList
            history={history}
            targetCount={TARGETS_COUNT}
            labels={{
              title: labels.history,
              none: labels.none,
              misses: labels.misses,
              clear: labels.clear,
            }}
            onClear={() => {
              lsSet(`${TF_PREFIX}:history`, []);
              setHistory([]);
            }}
          />
        </div>
      </div>

      <footer className="mt-6 text-xs opacity-60">
        {locale === "fr"
          ? "Les scores sont stockés dans ton navigateur. Aucun envoi serveur."
          : "Scores are stored in your browser. No server calls."}
      </footer>
    </div>
  );
}
