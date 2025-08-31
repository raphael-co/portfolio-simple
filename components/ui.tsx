import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";

/** Merge tailwind classes + variants proprement */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Section
 * - `children?` : optionnel (permet <Section ... /> vide)
 * - `bleed` : si true, pas de container (plein écran)
 * - `containerClassName` : override du conteneur par défaut
 * - `as` : élément polymorphique ("section" par défaut)
 */
type SectionProps<E extends React.ElementType = "section"> = {
  id?: string;
  bleed?: boolean;
  className?: string;
  containerClassName?: string;
  as?: E;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, "as" | "className" | "children" | "id">;

export function Section<E extends React.ElementType = "section">({
  id,
  bleed = false,
  className,
  containerClassName = "container mx-auto px-4",
  as,
  children,
  ...rest
}: SectionProps<E>) {
  const Tag = (as || "section") as React.ElementType;
  return (
    <Tag
      id={id}
      className={cn("relative", bleed ? "" : containerClassName, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Badge */
export function Badge({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-block rounded-full border px-3 py-1 text-xs dark:border-white/10", className)}>
      {children}
    </span>
  );
}

/** Card */
export function Card({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border p-6 shadow-sm dark:border-white/10", className)}>
      {children}
    </div>
  );
}
