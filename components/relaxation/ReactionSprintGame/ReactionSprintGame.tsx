"use client";

import { type Locale } from "@/lib/i18n";
import {
  LS_PREFIX,
  RunResult,
  TrialState,
  dailyRng,
  lsGet,
  lsSet,
  todayKey,
  FALSE_START_PENALTY_MS,
} from "./utils";
import Playfield from "./Playfield";
import StatsPanel from "./StatsPanel";
import HistoryList from "./HistoryList";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function ReactionSprintGame({ locale }: { locale: Locale }) {
  const trialsPerRun = 5;
  const dateKey = todayKey();
  const rng = useMemo(() => dailyRng(locale ?? "fr"), [locale]);

  const [state, setState] = useState<TrialState>("idle");
  const [trialIndex, setTrialIndex] = useState(0);
  const [trialTimes, setTrialTimes] = useState<number[]>([]);
  const [falseStarts, setFalseStarts] = useState(0);
  const [readyAt, setReadyAt] = useState<number | null>(null);
  const [pressedAt, setPressedAt] = useState<number | null>(null);

  const armTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [bestToday, setBestToday] = useState<RunResult | null>(null);
  const [history, setHistory] = useState<RunResult[]>([]);
  useEffect(() => {
    setBestToday(lsGet<RunResult | null>(`${LS_PREFIX}:best:${dateKey}`, null));
    setHistory(lsGet<RunResult[]>(`${LS_PREFIX}:history`, []));
  }, [dateKey]);

  const baseMs = trialTimes.reduce((a, b) => a + b, 0);
  const penaltyMs = falseStarts * FALSE_START_PENALTY_MS;
  const finalMs = baseMs + penaltyMs;
  const finished = state === "finished";

  const dailyDelays = useMemo(() => {
    const delays: number[] = [];
    for (let i = 0; i < trialsPerRun; i++) {
      delays.push(800 + Math.floor(rng() * 1200));
    }
    return delays;
  }, [rng]);

  const clearArm = () => {
    if (armTimer.current) clearTimeout(armTimer.current);
    armTimer.current = null;
  };

  const reset = useCallback(() => {
    setState("idle");
    setTrialIndex(0);
    setTrialTimes([]);
    setFalseStarts(0);
    setReadyAt(null);
    setPressedAt(null);
    clearArm();
  }, []);

  const startTrial = useCallback(
    (index: number) => {
      setState("arming");
      clearArm();
      armTimer.current = setTimeout(() => {
        setReadyAt(performance.now());
        setState("ready");
      }, dailyDelays[index]);
    },
    [dailyDelays]
  );

  const startRun = useCallback(() => {
    reset();
    setTimeout(() => startTrial(0), 250);
  }, [reset, startTrial]);

  const handleClick = useCallback(() => {
    if (state === "idle") return;

    if (state === "arming") {
      setFalseStarts((n) => n + 1);
      setState("false-start");
      clearArm();
      setTimeout(() => {
        setState("arming");
        armTimer.current = setTimeout(() => {
          setReadyAt(performance.now());
          setState("ready");
        }, dailyDelays[trialIndex]);
      }, 600);
      return;
    }

    if (state === "ready") {
      const now = performance.now();
      setPressedAt(now);
      if (readyAt != null) {
        const delta = now - readyAt;
        setTrialTimes((prev) => {
          const next = [...prev];
          next[trialIndex] = delta;
          return next;
        });
      }
      setState("clicked");
      setTimeout(() => {
        const nextIndex = trialIndex + 1;
        if (nextIndex >= trialsPerRun) {
          setState("finished");
        } else {
          setTrialIndex(nextIndex);
          setReadyAt(null);
          setPressedAt(null);
          startTrial(nextIndex);
        }
      }, 350);
    }
  }, [state, dailyDelays, readyAt, trialIndex, trialsPerRun, startTrial]);

  useEffect(() => {
    if (state !== "finished") return;

    const result: RunResult = {
      dateKey,
      totalMs: finalMs,
      trials: trialTimes,
      falseStarts,
      timestamp: Date.now(),
    };

    const currentBest = lsGet<RunResult | null>(`${LS_PREFIX}:best:${dateKey}`, null);
    if (!currentBest || finalMs < currentBest.totalMs) {
      lsSet(`${LS_PREFIX}:best:${dateKey}`, result);
      setBestToday(result);
    }

    const prev = lsGet<RunResult[]>(`${LS_PREFIX}:history`, []);
    const next = [result, ...prev].slice(0, 15);
    lsSet(`${LS_PREFIX}:history`, next);
    setHistory(next);
  }, [state, dateKey, falseStarts, finalMs, trialTimes]);

  useEffect(() => {
    return () => clearArm();
  }, []);

  const share = useCallback(async () => {
    const body = `Reaction Sprint — ${dateKey}
Total: ${finalMs.toFixed(0)} ms (${trialTimes.map((t) => t.toFixed(0)).join(", ")})${
      falseStarts ? ` • +${penaltyMs} ms penalty (${falseStarts}×${FALSE_START_PENALTY_MS}ms)` : ""
    }
#Relaxation #Portfolio`;
    try {
      await navigator.clipboard.writeText(body);
    } catch {}
  }, [dateKey, penaltyMs, finalMs, trialTimes, falseStarts]);

  const statusLabel: string =
    state === "idle"
      ? locale === "fr"
        ? "Prêt"
        : "Ready"
      : state === "arming"
      ? locale === "fr"
        ? "Attends…"
        : "Wait…"
      : state === "ready"
      ? locale === "fr"
        ? "CLIQUE !"
        : "CLICK!"
      : state === "false-start"
      ? locale === "fr"
        ? "Trop tôt !"
        : "Too early!"
      : state === "clicked"
      ? locale === "fr"
        ? "Bien joué"
        : "Nice"
      : locale === "fr"
      ? "Terminé"
      : "Finished";

  return (
    <div className="rounded-2xl border dark:border-white/10 p-5 sm:p-6 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            {locale === "fr" ? "Sprint de Réaction (Quotidien)" : "Reaction Sprint (Daily)"}
          </h2>
          <p className="text-xs opacity-70">Seeded · {dateKey}</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-70">
            {locale === "fr" ? "Meilleur aujourd’hui" : "Best today"}
          </p>
          <p className="text-base font-medium">
            {bestToday ? `${bestToday.totalMs.toFixed(0)} ms` : "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-start justify-start">
          <Playfield
            state={state}
            locale={locale}
            finalMs={finalMs}
            trialIndex={trialIndex}
            readyAt={readyAt}
            pressedAt={pressedAt}
            onStart={() => {
              setTrialIndex(0);
              setTrialTimes([]);
              setFalseStarts(0);
              setReadyAt(null);
              setPressedAt(null);
              startRun();
            }}
            onClick={handleClick}
            onShare={share}
            statusLabel={statusLabel}
          />
        </div>

        <div className="flex flex-col">
          <StatsPanel
            locale={locale}
            trialsPerRun={trialsPerRun}
            trialTimes={trialTimes}
            trialIndex={trialIndex}
            falseStarts={falseStarts}
            baseMs={baseMs}
            finalMs={finalMs}
            isIdle={state === "idle"}
            isFinished={finished}
            onStartOrReset={state === "idle" ? startRun : reset}
            onShare={share}
          />
          <HistoryList locale={locale} history={history} onClear={() => setHistory([])} />
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
