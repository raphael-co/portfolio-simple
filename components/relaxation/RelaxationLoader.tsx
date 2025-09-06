"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Section, cn } from "@/components/ui";
import { type Locale } from "@/lib/i18n";

/**
 * Petit canvas décoratif : grille de points radiale qui réagit subtilement au pointeur.
 * Inspiré du style de ton Hero pour rester cohérent avec le projet.
 */
function DottedRadialGrid({
  className,
  density = 24,
  baseRadius = 1.5,
  hoverBoost = 2.1,
  influenceRadius = 180,
  fadeStop = "78%",
  alphaLight = 0.22,
  alphaDark = 0.42,
  darkGlow = 0.8,
}: {
  className?: string;
  density?: number;
  baseRadius?: number;
  hoverBoost?: number;
  influenceRadius?: number;
  fadeStop?: string;
  alphaLight?: number;
  alphaDark?: number;
  darkGlow?: number;
}) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const pointsRef = React.useRef<Array<{ x: number; y: number }>>([]);
  const sizeRef = React.useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });
  const mouseTarget = React.useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });
  const mouseRender = React.useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  React.useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let disposed = false;

    const isDark = () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      sizeRef.current = { w: Math.round(rect.width), h: Math.round(rect.height), dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const pts: Array<{ x: number; y: number }> = [];
      const step = density;
      const xCount = Math.ceil(rect.width / step) + 2;
      const yCount = Math.ceil(rect.height / step) + 2;
      const xOffset = ((rect.width % step) / 2) - step;
      const yOffset = ((rect.height % step) / 2) - step;

      for (let iy = 0; iy < yCount; iy++) {
        for (let ix = 0; ix < xCount; ix++) {
          pts.push({ x: xOffset + ix * step, y: yOffset + iy * step });
        }
      }
      pointsRef.current = pts;
    };

    const getFillStyle = () => {
      const c = getComputedStyle(wrap).color;
      const m = c.match(/rgba?\(([^)]+)\)/);
      const [r, g, b] = m ? m[1].split(",").slice(0, 3).map(v => parseFloat(v)) : [0, 0, 0];
      const a = isDark() ? alphaDark : alphaLight;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    const onMove = (ev: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouseTarget.current = { x, y, inside };
    };

    const onLeave = () => (mouseTarget.current.inside = false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    const mo = typeof MutationObserver !== "undefined" ? new MutationObserver(() => {}) : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    resize();

    const sigma = influenceRadius;
    const twoSigmaSq = 2 * sigma * sigma;

    const tick = () => {
      if (disposed) return;

      const { w, h, dpr } = sizeRef.current;

      mouseRender.current.x = lerp(mouseRender.current.x, mouseTarget.current.x, 0.16);
      mouseRender.current.y = lerp(mouseRender.current.y, mouseTarget.current.y, 0.16);
      mouseRender.current.inside = mouseTarget.current.inside;

      const ctxAny = ctx as CanvasRenderingContext2D;
      ctxAny.clearRect(0, 0, w * dpr, h * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = getFillStyle();
      if (isDark() && darkGlow > 0) {
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = darkGlow;
      } else {
        ctx.shadowBlur = 0;
      }

      const r0 = baseRadius;
      const boost = hoverBoost;
      const mx = mouseRender.current.x;
      const my = mouseRender.current.y;
      const active = mouseRender.current.inside;

      for (let i = 0; i < pointsRef.current.length; i++) {
        const p = pointsRef.current[i];
        let r = r0;
        if (active) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          const influence = Math.exp(-d2 / twoSigmaSq);
          r = r0 * (1 + (boost - 1) * influence);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      mo?.disconnect();
    };
  }, [density, baseRadius, hoverBoost, influenceRadius, alphaLight, alphaDark, darkGlow]);

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `radial-gradient(ellipse at center, black, transparent ${fadeStop})`,
    maskImage: `radial-gradient(ellipse at center, black, transparent ${fadeStop})`,
  };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 text-black dark:text-white",
        className
      )}
      aria-hidden
      style={maskStyle}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

/** Mini spinner conique + cercle pulsant */
function BrandSpinner() {
  return (
    <div className="relative mx-auto h-16 w-16">
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl blur-md"
        initial={{ rotate: -12, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 grid place-items-center rounded-2xl bg-white/70 shadow-sm ring-1 ring-black/10 backdrop-blur-sm dark:bg-white/5 dark:ring-white/10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="h-8 w-8 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(37,99,235,.0), rgba(37,99,235,1))",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
        />
      </motion.div>
    </div>
  );
}

/** Barre de progression synchronisée avec la durée cible */
function ProgressBar({ locale, durationMs = 1500 }: { locale: Locale; durationMs?: number }) {
  const [p, setP] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const target = Math.max(200, durationMs); // bornes de sécurité

    const tick = (t: number) => {
      const elapsed = t - start;
      const ratio = Math.min(1, elapsed / target);
      // Ease-out quad pour une progression plus naturelle
      const eased = 1 - Math.pow(1 - ratio, 2);
      const next = eased * 95; // on laisse ~5% pour la fin (suspense réel)
      setP(next);
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs]);

  const label =
    locale === "fr"
      ? p < 40
        ? "Initialisation…"
        : p < 70
        ? "Préparation des mini-jeux…"
        : "Optimisation de l'expérience…"
      : p < 40
      ? "Initializing…"
      : p < 70
      ? "Preparing mini-games…"
      : "Optimizing experience…";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <motion.div
          className="h-full rounded-full bg-brand"
          initial={{ width: "0%" }}
          animate={{ width: `${p}%` }}
          transition={{ ease: "easeOut", duration: 0.15 }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs opacity-70">
        <span>{label}</span>
        <span>{Math.round(p)}%</span>
      </div>
    </div>
  );
}

export default function RelaxationLoader({
  locale = "fr" as Locale,
  durationMs = 1500,
}: {
  locale?: Locale;
  /** Durée cible (ms) pour caler progress bar + fades du loader */
  durationMs?: number;
}) {
  // facteur d’échelle pour ajuster toutes les petites animations à la durée cible
  const k = Math.max(0.25, durationMs / 1500);
  const dur = (base: number) => Math.max(0.2, base * k);

  const title =
    locale === "fr"
      ? "Zone de détente — Chargement"
      : "Relaxation Zone — Loading";

  const subtitle =
    locale === "fr"
      ? "Respire, on prépare les mini-jeux…"
      : "Take a breath, setting things up…";

  return (
    <Section bleed className="relative overflow-hidden">
      <DottedRadialGrid className="z-0" />

      <div className="relative z-10 grid min-h-[50vh] place-items-center px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          {/* Spinner (les deux éléments internes ont leur propre timing, on les scale aussi) */}
          <div className="relative mx-auto h-16 w-16">
            <motion.div
              className="absolute inset-0 -z-10 rounded-2xl blur-md"
              initial={{ rotate: -12, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: dur(0.6), ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 grid place-items-center rounded-2xl bg-white/70 shadow-sm ring-1 ring-black/10 backdrop-blur-sm dark:bg-white/5 dark:ring-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: dur(0.6), ease: "easeOut" }}
            >
              <motion.div
                className="h-8 w-8 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg at 50% 50%, rgba(37,99,235,.0), rgba(37,99,235,1))",
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
              />
            </motion.div>
          </div>

          <motion.h2
            className="mt-6 text-2xl font-semibold sm:text-3xl"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: dur(0.45), ease: "easeOut" }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="mt-2 text-sm opacity-80 sm:text-base"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: dur(0.45), delay: 0.05 * k, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.4), delay: 0.15 * k }}
          >
            <ProgressBar locale={locale} durationMs={durationMs} />
          </motion.div>

          <motion.div
            className="pointer-events-none mx-auto mt-8 h-16 w-16 rounded-full bg-gradient-to-tr from-brand/20 to-indigo-500/20 blur-2xl dark:from-brand/25 dark:to-indigo-400/25"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: dur(0.6), ease: "easeOut" }}
            aria-hidden
          />
        </div>
      </div>
    </Section>
  );
}
