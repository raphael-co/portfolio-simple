"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import TargetFrenzyGame from "@/components/relaxation/TargetFrenzyGame";
import SkyJumpGame from "@/components/relaxation/SkyJumpGame";
import ReactionSprintGame from "./ReactionSprintGame/ReactionSprintGame";

export default function GameTabs({ locale }: { locale: Locale }) {
  const [tab, setTab] = useState<"reaction" | "aim" | "jump">("reaction");

  const labels =
    locale === "fr"
      ? {
          reaction: "Sprint de Réaction",
          aim: "Cible Express",
          jump: "Sky Jump",
          reactionDesc: "5 réactions chronométrées, basées sur la date du jour.",
          aimDesc: "Touchez 20 cibles le plus vite possible, chaque raté pénalise.",
          jumpDesc: "Monte en sautant de plateforme en plateforme, collecte pièces et bonus, évite les obstacles.",
        }
      : {
          reaction: "Reaction Sprint",
          aim: "Target Frenzy",
          jump: "Sky Jump",
          reactionDesc: "5 timed reactions, based on today’s date.",
          aimDesc: "Hit 20 targets as fast as possible; misses add penalty.",
          jumpDesc: "Climb by jumping on platforms, collect coins and power-ups, avoid hazards.",
        };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-2 dark:border-white/10">
        <div className="relative grid grid-cols-3">
          <button
            onClick={() => setTab("reaction")}
            className={`relative z-10 rounded-xl px-4 py-2 text-sm font-medium ${
              tab === "reaction" ? "opacity-100" : "opacity-70"
            }`}
          >
            {labels.reaction}
          </button>
          <button
            onClick={() => setTab("aim")}
            className={`relative z-10 rounded-xl px-4 py-2 text-sm font-medium ${
              tab === "aim" ? "opacity-100" : "opacity-70"
            }`}
          >
            {labels.aim}
          </button>
          <button
            onClick={() => setTab("jump")}
            className={`relative z-10 rounded-xl px-4 py-2 text-sm font-medium ${
              tab === "jump" ? "opacity-100" : "opacity-70"
            }`}
          >
            {labels.jump}
          </button>

          <motion.span
            layout
            className="absolute inset-y-1 w-1/3 rounded-xl bg-black/5 dark:bg-white/10"
            animate={{ x: tab === "reaction" ? "0%" : tab === "aim" ? "100%" : "200%" }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          />
        </div>
      </div>

      <p className="text-sm opacity-80">
        {tab === "reaction" ? labels.reactionDesc : tab === "aim" ? labels.aimDesc : labels.jumpDesc}
      </p>

      {tab === "reaction" ? (
        <ReactionSprintGame locale={locale} />
      ) : tab === "aim" ? (
        <TargetFrenzyGame locale={locale} />
      ) : (
        <SkyJumpGame locale={locale} />
      )}
    </div>
  );
}
