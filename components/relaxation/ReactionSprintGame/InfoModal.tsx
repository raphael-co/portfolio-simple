"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RulesCard, TipsCard } from "@/components/relaxation/ReactionSprintGame/SideCards";
import { HelpCircle } from "lucide-react";

export default function InfoModalButton({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
        document.removeEventListener("keydown", onKey);
      };
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -1 }}
        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm dark:border-white/10"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="relax-info-dialog"
      >
        <HelpCircle className="h-4 w-4" />
        {locale === "fr" ? "Règles & Astuces" : "Rules & Tips"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              id="relax-info-dialog"
              role="dialog"
              aria-modal="true"
              aria-label={locale === "fr" ? "Règles et Astuces" : "Rules and Tips"}
              className="absolute inset-0 z-10 flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 22 } }}
              exit={{ opacity: 0, scale: 0.98, y: 6 }}
            >
              <div className="w-full max-w-2xl rounded-2xl border bg-white p-4 shadow-xl dark:border-white/10 dark:bg-zinc-900 sm:p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    {locale === "fr" ? "Règles & Astuces" : "Rules & Tips"}
                  </h2>
                  <motion.button
                    type="button"
                    onClick={() => setOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full px-3 py-1 text-sm opacity-70 hover:opacity-100"
                  >
                    {locale === "fr" ? "Fermer" : "Close"}
                  </motion.button>
                </div>

                <div className="grid gap-4 sm:gap-5">
                  <RulesCard locale={locale} />
                  <TipsCard locale={locale} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
