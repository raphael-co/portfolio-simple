"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import TargetFrenzyGame from "@/components/relaxation/TargetFrenzyGame";
import SkyJumpGame from "@/components/relaxation/SkyJumpGame";
import ReactionSprintGame from "./ReactionSprintGame/ReactionSprintGame";
import RelaxationLoader from "@/components/relaxation/RelaxationLoader";

type TabKey = "reaction" | "aim" | "jump";

interface GameTabsProps {
    locale: Locale;
    loaderDelay?: number;
}

export default function GameTabs({ locale, loaderDelay = 1500 }: GameTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialTab: TabKey = useMemo(() => {
        const g = searchParams?.get("game");
        return g === "reaction" || g === "aim" || g === "jump" ? g : "reaction";
    }, [searchParams]);

    const [tab, setTab] = useState<TabKey>(initialTab);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const g = searchParams?.get("game");
        if (g === "reaction" || g === "aim" || g === "jump") {
            setTab(g);
        }
    }, [searchParams]);

    const setTabAndUrl = (next: TabKey) => {
        if (next === tab) return;
        setIsLoading(true);
        const sp = new URLSearchParams(searchParams?.toString());
        sp.set("game", next);
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });

        setTimeout(() => {
            setTab(next);
            setIsLoading(false);
        }, loaderDelay);
    };

    const labels =
        locale === "fr"
            ? {
                reaction: "Sprint de Réaction",
                aim: "Cible Express",
                jump: "Sky Jump",
                reactionDesc: "5 réactions chronométrées, basées sur la date du jour.",
                aimDesc: "Touchez 20 cibles le plus vite possible, chaque raté pénalise.",
                jumpDesc:
                    "Monte en sautant de plateforme en plateforme, collecte pièces et bonus, évite les obstacles.",
            }
            : {
                reaction: "Reaction Sprint",
                aim: "Target Frenzy",
                jump: "Sky Jump",
                reactionDesc: "5 timed reactions, based on today’s date.",
                aimDesc: "Hit 20 targets as fast as possible; misses add penalty.",
                jumpDesc:
                    "Climb by jumping on platforms, collect coins and power-ups, avoid hazards.",
            };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border p-2 dark:border-white/10">
                <div className="relative grid grid-cols-3">
                    <button
                        onClick={() => setTabAndUrl("reaction")}
                        className={`relative z-10 rounded-xl px-4 py-2 text-sm font-medium ${tab === "reaction" ? "opacity-100" : "opacity-70"
                            }`}
                    >
                        {labels.reaction}
                    </button>
                    <button
                        onClick={() => setTabAndUrl("aim")}
                        className={`relative z-10 rounded-xl px-4 py-2 text-sm font-medium ${tab === "aim" ? "opacity-100" : "opacity-70"
                            }`}
                    >
                        {labels.aim}
                    </button>
                    <button
                        onClick={() => setTabAndUrl("jump")}
                        className={`relative z-10 rounded-xl px-4 py-2 text-sm font-medium ${tab === "jump" ? "opacity-100" : "opacity-70"
                            }`}
                    >
                        {labels.jump}
                    </button>

                    <motion.span
                        layout
                        className="absolute inset-y-1 w-1/3 rounded-xl bg-black/5 dark:bg-white/10"
                        animate={{
                            x: tab === "reaction" ? "0%" : tab === "aim" ? "100%" : "200%",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    />
                </div>
            </div>

            <p className="text-sm opacity-80">
                {tab === "reaction"
                    ? labels.reactionDesc
                    : tab === "aim"
                        ? labels.aimDesc
                        : labels.jumpDesc}
            </p>

            {isLoading ? (
                <RelaxationLoader locale={locale} durationMs={loaderDelay} />

            ) : tab === "reaction" ? (
                <ReactionSprintGame locale={locale} />
            ) : tab === "aim" ? (
                <TargetFrenzyGame locale={locale} />
            ) : (
                <SkyJumpGame locale={locale} />
            )}
        </div>
    );
}
