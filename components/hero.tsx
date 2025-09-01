"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import * as React from "react";
import { cn, Section } from "./ui";
import { getDict, Locale } from "@/lib/i18n";
import { usePathname } from "next/navigation";

/* =======================
   Dotted grid (Canvas)
   - Points via canvas (perf)
   - Couleur = currentColor (suit le thème)
   - Fade radial via mask-image (inline)
   - Hover: amplification gaussienne autour de la souris
   - Meilleure visibilité en dark: alpha plus élevé + léger glow
   ======================= */

type GridProps = {
  className?: string;
  density?: number;         // distance entre points (px)
  baseRadius?: number;      // rayon de base des points (px)
  hoverBoost?: number;      // amplification max au centre
  influenceRadius?: number; // rayon d’influence (px)
  fadeStop?: string;        // "70%", "75%", etc.
  followDamping?: number;   // 0..1 (plus petit = plus smooth)
  alphaLight?: number;      // opacité en thème clair
  alphaDark?: number;       // opacité en thème sombre (plus élevé pour bien ressortir)
  darkGlow?: number;        // intensité du glow (px) en dark
};

function DottedRadialGridCanvas({
  className,
  density = 24,
  baseRadius = 1.6,         // ↑ ronds plus grands par défaut
  hoverBoost = 2.25,        // ↑ plus gros au survol
  influenceRadius = 190,    // halo un peu plus large
  fadeStop = "76%",
  followDamping = 0.16,
  alphaLight = 0.24,
  alphaDark = 0.45,         // ↑ meilleure visibilité en dark
  darkGlow = 0.8,           // léger glow pour pop en dark
}: GridProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);

  // Souris (cible) et rendu (lissé)
  const mouseTarget = React.useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  });
  const mouseRender = React.useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  });

  // Points + dimensions
  const pointsRef = React.useRef<Array<{ x: number; y: number }>>([]);
  const sizeRef = React.useRef<{ w: number; h: number; dpr: number }>({
    w: 0,
    h: 0,
    dpr: 1,
  });

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

      // Grille centrée
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
      // Couleur = currentColor du wrapper
      const c = getComputedStyle(wrap).color; // "rgb(...)" ou "rgba(...)"
      const m = c.match(/rgba?\(([^)]+)\)/);
      const [r, g, b] = m ? m[1].split(",").slice(0, 3).map(v => parseFloat(v)) : [0, 0, 0];
      const a = isDark() ? alphaDark : alphaLight;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    // Écoute globale -> pas besoin de pointer-events sur le calque
    const onMove = (ev: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouseTarget.current.x = x;
      mouseTarget.current.y = y;
      mouseTarget.current.inside = inside;
    };
    const onLeaveWindow = () => {
      mouseTarget.current.inside = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeaveWindow, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    // support bascule de thème via MutationObserver
    const mo =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            // force un redraw en changeant rien (alpha différent)
          })
        : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    resize();

    const sigma = influenceRadius;
    const twoSigmaSq = 2 * sigma * sigma;

    const tick = () => {
      if (disposed) return;

      const { w, h, dpr } = sizeRef.current;

      // Lissage position souris
      mouseRender.current.x = lerp(mouseRender.current.x, mouseTarget.current.x, followDamping);
      mouseRender.current.y = lerp(mouseRender.current.y, mouseTarget.current.y, followDamping);
      mouseRender.current.inside = mouseTarget.current.inside;

      ctx.clearRect(0, 0, w * dpr, h * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      // style couleur/alpha
      ctx.fillStyle = getFillStyle();

      // léger glow seulement en dark
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
          const influence = Math.exp(-d2 / twoSigmaSq); // 0..1
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
      window.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("resize", resize);
      mo?.disconnect();
    };
  }, [density, baseRadius, hoverBoost, influenceRadius, followDamping, alphaLight, alphaDark, darkGlow]);

  // Masque radial dynamique (inline, compatible WebKit)
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `radial-gradient(ellipse at center, black, transparent ${fadeStop})`,
    maskImage: `radial-gradient(ellipse at center, black, transparent ${fadeStop})`,
  };

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn(
        // calque visuel qui ne bloque pas les interactions
        "pointer-events-none absolute inset-0 z-0",
        // couleur source = currentColor : noir en clair / blanc en sombre
        "text-black dark:text-white",
        className
      )}
      style={maskStyle}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

/* =======================
   HERO
   ======================= */

export default function Hero({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const pathname = usePathname();

  const segments = pathname?.split("/") || [];
  const currentLocale: Locale =
    segments[1] === "en" || segments[1] === "fr" ? (segments[1] as Locale) : locale;
  const href = (l: string, p: string = "") => `/${l}/${p}`.replace(/\/$/, "");

  return (
    <Section bleed className="relative overflow-hidden">
      {/* Fond interactif à points */}
      <DottedRadialGridCanvas
        className="z-0"
        density={24}
        baseRadius={1.6}      // ↑ ronds plus grands
        hoverBoost={2.25}     // ↑ plus grand au survol
        influenceRadius={190}
        fadeStop="76%"
        followDamping={0.16}
        alphaLight={0.24}
        alphaDark={0.45}      // ↑ visibilité en dark
        darkGlow={0.8}        // léger glow en dark
      />

      <div className="relative z-10 grid min-h-[60vh] place-items-center px-4 py-24">
        <div className="max-w-3xl text-center">
          {/* Avatar + halo */}
          <div className="relative mx-auto mb-6 h-28 w-28 md:h-32 md:w-32">
            <motion.div
              className="absolute inset-0 -z-10 rounded-2xl blur-md"
              style={{
                background:
                  "conic-gradient(from 140deg at 50% 50%, rgba(56,189,248,.35), rgba(232,121,249,.35), rgba(37,98,234), rgba(37,98,234))",
              }}
              initial={{ rotate: -8, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.img
              src="/avatar-bg.svg"
              alt="Raphael Comandon"
              aria-hidden
              className="absolute inset-0 -z-10 h-full w-full rounded-2xl opacity-70 dark:opacity-60"
              initial={{ scale: 0.9, rotate: -4, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src="/avatar.png"
              alt="Raphael Comandon"
              className="h-full w-full rounded-2xl bg-white/70 object-cover shadow-sm ring-1 ring-black/10 backdrop-blur-sm dark:bg-white/5 dark:ring-white/10"
            />
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            Raphael Comandon — Développeur Full-Stack
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-balance text-lg opacity-80"
          >
            <Balancer>{dict.hero_sub}</Balancer>
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="/Raphael_Comandon_CV.pdf"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow hover:opacity-90"
            >
              {dict.btn_download_cv}
            </Link>
            <Link
              href={href(currentLocale, "contact")}
              className="rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              {dict.btn_contact_me}
            </Link>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
