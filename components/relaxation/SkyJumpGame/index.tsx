"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { dailyRng, lsGet, lsSet, todayKey } from "@/components/relaxation//SkyJumpGame/utils";
import Canvas from "./Canvas";
import StatsPanel from "./StatsPanel";
import HistoryList from "./HistoryList";
import type { SJRun, SJState } from "./types";

const SJ_PREFIX = "relax-sky-jump";

export default function SkyJumpGame({ locale }: { locale: Locale }) {
    const dateKey = todayKey();
    const rng = useMemo(() => dailyRng(locale ?? "fr"), [locale]);

    const [state, setState] = useState<SJState>("idle");
    const [score, setScore] = useState(0);
    const [coins, setCoins] = useState(0);

    const [bestToday, setBestToday] = useState<SJRun | null>(null);
    const [history, setHistory] = useState<SJRun[]>([]);

    useEffect(() => {
        setBestToday(lsGet<SJRun | null>(`${SJ_PREFIX}:best:${dateKey}`, null));
        setHistory(lsGet<SJRun[]>(`${SJ_PREFIX}:history`, []));
    }, [dateKey]);

    const start = useCallback(() => {
        setScore(0);
        setCoins(0);
        setState("running");
    }, []);

    const reset = useCallback(() => {
        setState("idle");
        setScore(0);
        setCoins(0);
    }, []);


    const pause = useCallback(() => {
        setState((s) => (s === "running" ? "paused" : s));
    }, []);

    const resume = useCallback(() => {
        setState((s) => (s === "paused" ? "running" : s));
    }, []);

    const restart = useCallback(() => {
        setScore(0);
        setCoins(0);
        setState("idle");
        requestAnimationFrame(() => start());
    }, [start]);

    const end = useCallback(
        (finalScore: number, coinsFromGame: number) => {
            setState("finished");
            setCoins(coinsFromGame);

            const run: SJRun = {
                dateKey,
                score: finalScore,
                coins: coinsFromGame,
                timestamp: Date.now(),
            };

            const currentBest = lsGet<SJRun | null>(`${SJ_PREFIX}:best:${dateKey}`, null);
            if (!currentBest || finalScore > currentBest.score) {
                lsSet(`${SJ_PREFIX}:best:${dateKey}`, run);
                setBestToday(run);
            }
            const prev = lsGet<SJRun[]>(`${SJ_PREFIX}:history`, []);
            const next = [run, ...prev].slice(0, 15);
            lsSet(`${SJ_PREFIX}:history`, next);
            setHistory(next);
        },
        [dateKey]
    );

    const labels =
        locale === "fr"
            ? {
                title: "Sky Jump",
                best: "Meilleur aujourd’hui",
                stats: "Statistiques",
                start: "Commencer",
                score: "Score",
                coins: "Pièces",
                history: "Historique (local)",
                none: "Aucun score enregistré.",
                clear: "Vider l’historique",
            }
            : {
                title: "Sky Jump",
                best: "Best today",
                stats: "Stats",
                start: "Start",
                score: "Score",
                coins: "Coins",
                history: "History (local)",
                none: "No scores yet.",
                clear: "Clear history",
            };

    return (
        <div className="rounded-2xl border p-5 sm:p-6 md:p-8 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold sm:text-xl">{labels.title}</h2>
                    <p className="text-xs opacity-70">
                        {locale === "fr" ? "Saut d’obstacles avec bonus" : "Obstacle jump with power-ups"}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm opacity-70">{labels.best}</p>
                    <p className="text-base font-medium">{bestToday ? bestToday.score : "—"}</p>
                </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="flex items-start justify-start">
                    <Canvas
                        state={state}
                        rng={rng}
                        start={start}
                        reset={reset}
                        onEnd={end}
                        onScore={setScore}
                        onCoins={setCoins}
                        onRequestPause={pause}
                        onRequestResume={resume}
                        onRequestRestart={restart}
                        maxWidth={560}
                        aspectW={3}
                        locale={locale}
                        aspectH={4}
                    />
                </div>

                <div className="flex flex-col">
                    <StatsPanel
                        labels={{
                            stats: labels.stats,
                            best: labels.best,
                            start: labels.start,
                            score: labels.score,
                            coins: labels.coins,
                        }}
                        score={score}
                        coins={coins}
                        bestToday={bestToday ? bestToday.score : null}
                        onStart={start}
                        state={state}
                    />

                    <HistoryList
                        history={history}
                        locale={locale}
                        collapsedCount={3}
                        labels={{
                            title: labels.history,
                            none: labels.none,
                            clear: labels.clear,
                            showMore: locale === "fr" ? "Afficher plus" : "Show more",
                            showLess: locale === "fr" ? "Afficher moins" : "Show less",
                            scoreLabel: labels.score,
                            coinsLabel: labels.coins,
                            dateLabel: locale === "fr" ? "Date" : "Date",
                            timeLabel: locale === "fr" ? "Heure" : "Time",
                        }}
                        onClear={() => {
                            lsSet(`${SJ_PREFIX}:history`, []);
                            setHistory([]);
                        }}
                    />
                </div>
            </div>

            <footer className="mt-6 text-xs opacity-60">
                {locale === "fr"
                    ? "Scores et meilleurs résultats stockés localement dans ton navigateur."
                    : "Scores and bests are stored locally in your browser."}
            </footer>
        </div>
    );
}
