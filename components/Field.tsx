import { AnimatePresence, motion } from "framer-motion";
import { cn } from "./ui";

export function Field({
    id, label, value, onChange, type = "text", textarea = false, error,
  }: {
    id: string; label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; error?: string | null;
  }) {
    const base =
      "peer block w-full rounded-xl border bg-white/60 px-3 pb-2.5 pt-5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand/60 dark:bg-neutral-900/50 dark:border-white/10";
    const hasValue = value.trim().length > 0;

    return (
      <div className="relative">
        {textarea ? (
          <textarea id={id} name={id} className={cn(base, "min-h-36")} placeholder=" " value={value}
            onChange={(e) => onChange(e.target.value)} maxLength={1200} aria-invalid={!!error} />
        ) : (
          <input id={id} name={id} type={type} className={base} placeholder=" " value={value}
            onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
        )}
        <label htmlFor={id}
          className={cn("pointer-events-none absolute left-3 top-3 text-xs opacity-70 transition-all",
            "peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[11px]",
            hasValue && "top-1.5 text-[11px]")}>
          {label}
        </label>
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="mt-1 text-[12px] text-rose-500">{error}</motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }