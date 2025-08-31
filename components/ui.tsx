import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function Section({ id, className, children, bleed = false }: { id?: string; className?: string; children: React.ReactNode; bleed?: boolean }) {
  return (
    <section id={id} className={cn("relative", bleed ? "" : "container mx-auto px-4", className)}>
      {children}
    </section>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border px-3 py-1 text-xs dark:border-white/10">{children}</span>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border p-6 shadow-sm dark:border-white/10", className)}>{children}</div>;
}
