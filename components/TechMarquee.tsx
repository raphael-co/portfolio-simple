"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/components/ui";

export type TechItem = {
  title: string;
  /** chemin /public par défaut */
  src: string;
  /** optionnel: logo spécifique pour le thème sombre */
  srcDark?: string;
  /** optionnel: inverse automatiquement en dark (utile pour logos noir/blanc) */
  darkInvert?: boolean;
};

type TooltipState = {
  visible: boolean;
  text: string;
  x: number; // centre horizontal (px, viewport)
  y: number; // bottom of tooltip (px, viewport)
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tooltip rendu en portal, au-dessus de tout (indépendant du overflow). */
function TooltipPortal({ state }: { state: TooltipState }) {
  if (typeof document === "undefined") return null;
  if (!state.visible) return null;

  // Positionnement: on place le tooltip juste au-dessus (y) et centré (x)
  // On utilise position: fixed pour ignorer les conteneurs à overflow.
  return createPortal(
    <div
      style={{
        position: "fixed",
        left: state.x,
        top: state.y,
        transform: "translate(-50%, -100%)", // centre horizontalement, place au-dessus
        zIndex: 9999,
        pointerEvents: "none",
      }}
      aria-hidden={!state.visible}
    >
      <div className="whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-xs text-white shadow dark:bg-white/90 dark:text-black">
        {state.text}
      </div>
      <div
        className="h-2 w-2 rotate-45 bg-black/90 dark:bg-white/90"
        style={{
          position: "absolute",
          left: "50%",
          top: "2px",
          transform: "translate(-50%, 0)",
          // la pointe est sous la box (visuellement), mais comme on translate(-100%) sur le conteneur parent,
          // cela revient à coller la flèche au bord inférieur.
        }}
      />
    </div>,
    document.body
  );
}

export function TechMarquee({
  items,
  className,
  baseSpeed = 70,
  gapClamp = "clamp(12px, 4.5vw, 28px)",
  logoClamp = "clamp(16px, 5vw, 24px)",
  reverse = true,
}: {
  items: TechItem[];
  className?: string;
  baseSpeed?: number;
  gapClamp?: string;
  logoClamp?: string;
  reverse?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [order, setOrder] = useState<TechItem[]>(() => shuffle(items));
  const [duration, setDuration] = useState<number>(30);

  // état tooltip global (un seul pour toutes les icônes)
  const [tt, setTt] = useState<TooltipState>({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  useEffect(() => setOrder(shuffle(items)), [items]);

  const recalc = () => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.getBoundingClientRect().width; // largeur A+B
    const distance = width / 2; // translation de 50% (piste dupliquée)
    const d = Math.max(12, Math.min(60, distance / baseSpeed));
    setDuration(d);
  };

  useLayoutEffect(() => {
    recalc();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(recalc);
    ro.observe(track);
    return () => ro.disconnect();
  }, [order]);

  useEffect(() => {
    const imgs = Array.from(
      (trackRef.current?.querySelectorAll("img") ?? []) as NodeListOf<HTMLImageElement>
    );
    if (!imgs.length) return;
    let loaded = 0;
    const onOne = () => {
      loaded += 1;
      if (loaded === imgs.length) recalc();
    };
    imgs.forEach((img) => {
      if (img.complete) onOne();
      else img.addEventListener("load", onOne, { once: true });
    });
    return () => imgs.forEach((img) => img.removeEventListener("load", onOne));
  }, [order]);

  const onHover = (play: boolean) => {
    const el = trackRef.current as HTMLElement | null;
    if (el) el.style.animationPlayState = play ? "running" : "paused";
  };

  // helpers tooltip
  const showTooltipFor = (el: HTMLElement, text: string) => {
    const rect = el.getBoundingClientRect();
    setTt({
      visible: true,
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 8, // 8px d'espace au-dessus de l'icône
    });
  };

  const moveTooltipFor = (el: HTMLElement) => {
    if (!tt.visible) return;
    const rect = el.getBoundingClientRect();
    setTt((prev) => ({
      ...prev,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    }));
  };

  const hideTooltip = () =>
    setTt((prev) => ({
      ...prev,
      visible: false,
    }));

  // Un seul tooltip global, donc on attache des handlers sur chaque logo
  const renderLogo = (it: TechItem, keyStr: string) => (
    <li key={keyStr} className="shrink-0">
      <div
        className="relative flex items-center gap-2"
        onMouseEnter={(e) => showTooltipFor(e.currentTarget as HTMLElement, it.title)}
        onMouseMove={(e) => moveTooltipFor(e.currentTarget as HTMLElement)}
        onMouseLeave={hideTooltip}
      >
        {/* <picture> permet un src différent en dark si fourni */}
        <picture>
          {it.srcDark && (
            <source media="(prefers-color-scheme: dark)" srcSet={it.srcDark} />
          )}
          <img
            src={it.src}
            alt={it.title}
            // évite le double-tooltip natif
            height={1}
            width={1}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable={false}
            style={{ height: "var(--logo-h)", width: "auto" }}
            className={cn(
              "max-w-none opacity-80 transition will-change-transform hover:opacity-100",
              it.darkInvert && "dark:invert"
            )}
            aria-label={it.title}
          />
        </picture>
      </div>
    </li>
  );

  return (
    <>
      <div
        ref={wrapRef}
        className={cn(
          // on peut laisser overflow-hidden: le tooltip est en portal (fixed), donc non rogné
          "relative w-full max-w-full overflow-hidden rounded-xl border bg-white/40 dark:border-white/10 dark:bg-neutral-900/40",
          className
        )}
        style={
          {
            ["--marquee-gap" as any]: gapClamp,
            ["--logo-h" as any]: logoClamp,
          } as React.CSSProperties
        }
      >
        {/* Fades latéraux */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent dark:from-neutral-950" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent dark:from-neutral-950" />

        <div
          className="group/outer relative touch-pan-y"
          onMouseEnter={() => onHover(false)}
          onMouseLeave={() => onHover(true)}
        >
          <ul
            ref={trackRef}
            className="marquee-track flex w-max items-center"
            style={
              {
                animation: `${reverse ? "marquee-right" : "marquee-left"} linear infinite`,
                animationDuration: `${duration}s`,
                columnGap: "var(--marquee-gap)",
                padding: `10px var(--marquee-gap)`,
              } as React.CSSProperties
            }
          >
            {/* piste A */}
            {order.map((it, idx) => renderLogo(it, `a-${idx}-${it.title}`))}
            {/* piste B */}
            {order.map((it, idx) => renderLogo(it, `b-${idx}-${it.title}`))}
          </ul>
        </div>
      </div>

      {/* Tooltip global en portal */}
      <TooltipPortal state={tt} />
    </>
  );
}
