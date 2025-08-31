"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export type Fact = { label: string; value: string; href?: string };

/* Tooltip dans <body> (évite le clipping) */
function BodyTooltip({
  anchor,
  text,
  open,
}: {
  anchor: HTMLElement | null;
  text: string;
  open: boolean;
}) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!anchor || !open) return;
    const update = () => {
      const r = anchor.getBoundingClientRect();
      setPos({ left: r.left + r.width / 2, top: r.top - 8 });
    };
    update();
    const handler = () => update();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    const ro = new ResizeObserver(update);
    ro.observe(anchor);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
      ro.disconnect();
    };
  }, [anchor, open]);

  if (!open || !pos) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="tooltip"
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.12 }}
        style={{
          position: "fixed",
          left: pos.left,
          top: pos.top,
          transform: "translate(-50%, -100%)",
          zIndex: 9999,
          pointerEvents: "none",
        }}
        className="max-w-[90vw] rounded-md border bg-white px-2 py-1 text-xs shadow dark:border-white/10 dark:bg-neutral-900"
      >
        <span className="block whitespace-normal break-words">{text}</span>
        <span className="pointer-events-none absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r bg-white dark:border-white/10 dark:bg-neutral-900" />
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* Truncate seulement ≥ sm ; sur mobile, on wrap pour tout voir */
function TruncateWithTooltip({
  text,
  href,
  className = "",
}: {
  text: string;
  href?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      requestAnimationFrame(() => {
        setIsOverflow(el.scrollWidth > el.clientWidth + 1);
      });
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  const content = (
    <span
      ref={ref}
      className={`block w-full break-words sm:truncate ${className}`}
      title={!isOverflow ? text : undefined}
    >
      {text}
    </span>
  );

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => isOverflow && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => isOverflow && setOpen(true)}
      onBlur={() => setOpen(false)}
      onTouchStart={() => isOverflow && setOpen((v) => !v)}
    >
      {href ? (
        <Link href={href} className="block w-full text-brand hover:underline">
          {content}
        </Link>
      ) : (
        content
      )}
      <BodyTooltip anchor={ref.current} text={text} open={open && isOverflow} />
    </div>
  );
}

export default function Facts({ items }: { items: Fact[] }) {
  return (
    <ul className="divide-y dark:divide-white/5">
      {items.map((f, i) => (
        <li
          key={`${f.label}-${i}`}
          className="
            grid grid-cols-1 gap-1 py-3
            sm:grid-cols-[10rem,1fr] sm:items-center sm:gap-3
          "
        >
          <span className="text-xs font-medium opacity-70 sm:text-sm">{f.label}</span>
          <div className="min-w-0">
            <TruncateWithTooltip text={f.value} href={f.href} className="text-sm" />
          </div>
        </li>
      ))}
    </ul>
  );
}
