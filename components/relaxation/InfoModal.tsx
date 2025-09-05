"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export default function InfoModalButton({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const t =
    locale === "fr"
      ? {
          button: "Infos",
          title: "Aide & Règles",
          rsTitle: "Sprint de Réaction",
          rsItems: [
            "5 réactions chronométrées par manche.",
            "Clique quand l’écran devient vert.",
            "Basé sur la date du jour, identique pour tous.",
            "Chaque faux départ ajoute +200 ms au total.",
            "Les scores restent dans ton navigateur.",
          ],
          tfTitle: "Cible Express",
          tfItems: [
            "Touchez 20 cibles le plus vite possible.",
            "Chaque clic hors cible compte comme un raté.",
            "Chaque raté ajoute +200 ms de pénalité.",
            "Le chrono démarre au premier clic sur « Commencer ».",
            "Historique et meilleur score stockés localement.",
          ],
          sjTitle: "Sky Jump",
          sjItems: [
            "Grimpe le plus haut possible en sautant de plateforme en plateforme.",
            "Contrôles : ←/→ ou A/D. Bords connectés (wrap horizontal).",
            "Types de plateformes : normales, fragiles (se brisent), piquées (mort), ressort (saut plus haut).",
            "Bonus : bouclier (protège d’un piège une fois).",
            "Ramasse des pièces pour un score secondaire.",
            "La partie se termine si tu tombes en bas ou touches des piques sans bouclier.",
            "Meilleur score et historique stockés localement.",
          ],
          close: "Fermer",
        }
      : {
          button: "Info",
          title: "Help & Rules",
          rsTitle: "Reaction Sprint",
          rsItems: [
            "5 timed reactions per run.",
            "Click when the screen turns green.",
            "Based on today’s date, same for everyone.",
            "+200 ms added per false start.",
            "Scores are stored locally in your browser.",
          ],
          tfTitle: "Target Frenzy",
          tfItems: [
            "Hit 20 targets as fast as possible.",
            "Clicks outside the target count as misses.",
            "+200 ms penalty per miss.",
            "Timer starts when you press “Start”.",
            "History and best score are stored locally.",
          ],
          sjTitle: "Sky Jump",
          sjItems: [
            "Climb as high as you can by jumping between platforms.",
            "Controls: ←/→ or A/D. Screen wraps horizontally.",
            "Platform types: normal, fragile (break), spike (death), spring (higher jump).",
            "Power-up: shield (blocks one hazard).",
            "Collect coins for a secondary score.",
            "Run ends if you fall off-screen or hit spikes without a shield.",
            "Best and history are stored locally.",
          ],
          close: "Close",
        };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm dark:border-white/10"
      >
        <Info className="h-4 w-4" />
        <span>{t.button}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div
              className="relative z-[71] w-full max-w-xl rounded-2xl border bg-white p-4 shadow-lg dark:border-white/10 dark:bg-neutral-900 sm:p-5 md:p-6"
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold sm:text-xl">{t.title}</h2>
                <button
                  ref={closeBtnRef}
                  onClick={() => setOpen(false)}
                  aria-label={t.close}
                  className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                <section>
                  <h3 className="text-base font-medium sm:text-lg">{t.rsTitle}</h3>
                  <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm opacity-90">
                    {t.rsItems.map((item, i) => (
                      <li key={`rs-${i}`}>{item}</li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h3 className="text-base font-medium sm:text-lg">{t.tfTitle}</h3>
                  <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm opacity-90">
                    {t.tfItems.map((item, i) => (
                      <li key={`tf-${i}`}>{item}</li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h3 className="text-base font-medium sm:text-lg">{t.sjTitle}</h3>
                  <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm opacity-90">
                    {t.sjItems.map((item, i) => (
                      <li key={`sj-${i}`}>{item}</li>
                    ))}
                  </ol>
                </section>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
