"use client";

import { useEffect, useRef, useState } from "react";

type PlatformType = "normal" | "fragile" | "spike" | "spring";
type PowerUpType = "shield";

type Platform = { x: number; y: number; w: number; h: number; type: PlatformType; broken?: boolean };
type Coin = { x: number; y: number; r: number; taken?: boolean };
type PowerUp = { x: number; y: number; r: number; type: PowerUpType; taken?: boolean };
type Player = { x: number; y: number; w: number; h: number; vx: number; vy: number };

export default function Canvas({
  width,
  height,
  state,
  rng,
  start,
  reset,
  onEnd,
  onScore,
  onCoins,
}: {
  width: number;
  height: number;
  state: "idle" | "running" | "finished";
  rng: () => number;
  start: () => void;
  reset: () => void;
  onEnd: (finalScore: number) => void;
  onScore: (score: number) => void;
  onCoins: (coins: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const playerRef = useRef<Player>({ x: width / 2, y: height - 60, w: 28, h: 34, vx: 0, vy: 0 });
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  const platformsRef = useRef<Platform[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const powerupsRef = useRef<PowerUp[]>([]);
  const scrollYRef = useRef(0);
  const coinsCountRef = useRef(0);
  const shieldRef = useRef<boolean>(false);

  const [dark, setDark] = useState<boolean>(
    typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches : false
  );
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = width * dpr;
    c.height = height * dpr;
    c.style.width = `${width}px`;
    c.style.height = `${height}px`;
  }, [width, height]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDark(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (state === "idle") {
      setupWorld();
      drawIdle();
    } else if (state === "running") {
      setupWorld();
      startLoop();
    } else {
      stopLoop();
    }
    return () => stopLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = true;
      if ((e.key === " " || e.key === "Enter") && state !== "running") start();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [state, start]);

  function stopLoop() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function startLoop() {
    stopLoop();
    rafRef.current = requestAnimationFrame(loop);
  }

  function setupWorld() {
    const p0: Platform = { x: width / 2 - 42, y: height - 18, w: 84, h: 12, type: "normal" };
    platformsRef.current = [p0];
    coinsRef.current = [];
    powerupsRef.current = [];
    scrollYRef.current = 0;
    coinsCountRef.current = 0;
    shieldRef.current = false;
    playerRef.current = { x: width / 2, y: height - 60, w: 28, h: 34, vx: 0, vy: 0 };
    spawnInitialPlatforms();
    onScore(0);
    onCoins(0);
  }

  function spawnInitialPlatforms() {
    let y = height - 56;
    for (let i = 0; i < 18; i++) {
      y -= 40 + rng() * 30;
      spawnPlatformRow(y);
    }
  }

  function spawnPlatformRow(y: number) {
    const pad = 22;
    const w = 60 + rng() * 40;
    const x = pad + rng() * (width - pad * 2 - w);
    const r = rng();
    let type: PlatformType = "normal";
    if (r < 0.12) type = "fragile";
    else if (r < 0.18) type = "spike";
    else if (r < 0.24) type = "spring";
    platformsRef.current.push({ x, y, w, h: 12, type });

    if (rng() < 0.28) coinsRef.current.push({ x: x + w / 2, y: y - 18, r: 7, taken: false });
    if (rng() < 0.08) powerupsRef.current.push({ x: x + w / 2 + 20, y: y - 20, r: 9, type: "shield", taken: false });
  }

  function loop(now: number) {
    timeRef.current = now || performance.now();
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    drawBackground(ctx);

    const player = playerRef.current;
    const moveSpeed = 3.25;
    const gravity = 0.22;
    const jumpVel = -7.4;
    const springVel = -11.6;

    if (keysRef.current.left) player.vx = -moveSpeed;
    else if (keysRef.current.right) player.vx = moveSpeed;
    else player.vx *= 0.9;

    player.x += player.vx;
    player.vy += gravity;
    player.y += player.vy;

    if (player.x < -player.w / 2) player.x = width + player.w / 2;
    if (player.x > width + player.w / 2) player.x = -player.w / 2;

    const plats = platformsRef.current;
    for (const p of plats) {
      if (player.vy > 0 && rectIntersect(player.x, player.y + player.h, player.w, 2, p.x, p.y, p.w, p.h)) {
        if (p.type === "spike") {
          if (shieldRef.current) {
            shieldRef.current = false;
            bounce(player, jumpVel);
          } else {
            endGame();
            return;
          }
        } else if (p.type === "fragile") {
          if (!p.broken) {
            bounce(player, jumpVel);
            p.broken = true;
          }
        } else if (p.type === "spring") {
          bounce(player, springVel);
        } else {
          bounce(player, jumpVel);
        }
      }
    }

    for (const coin of coinsRef.current) {
      if (!coin.taken && circleRectIntersect(coin.x, coin.y, coin.r, player.x, player.y, player.w, player.h)) {
        coin.taken = true;
        coinsCountRef.current += 1;
        onCoins(coinsCountRef.current);
      }
    }

    for (const pu of powerupsRef.current) {
      if (!pu.taken && circleRectIntersect(pu.x, pu.y, pu.r, player.x, player.y, player.w, player.h)) {
        pu.taken = true;
        shieldRef.current = true;
      }
    }

    const threshold = height * 0.42;
    if (player.y < threshold) {
      const dy = threshold - player.y;
      player.y = threshold;
      for (const p of plats) p.y += dy;
      for (const coin of coinsRef.current) coin.y += dy;
      for (const pu of powerupsRef.current) pu.y += dy;
      scrollYRef.current += dy;
      onScore(Math.floor(scrollYRef.current));
    }

    while (plats.length && plats[0].y > height + 30) plats.shift();
    while (coinsRef.current.length && coinsRef.current[0].y > height + 40) coinsRef.current.shift();
    while (powerupsRef.current.length && powerupsRef.current[0].y > height + 40) powerupsRef.current.shift();

    const topMost = Math.min(...plats.map((p) => p.y));
    if (topMost > 40) {
      spawnPlatformRow(topMost - (40 + rng() * 30));
    }

    drawPlatforms(ctx);
    drawCollectibles(ctx);
    drawPlayer(ctx);

    drawHUD(ctx);

    if (player.y > height + 40) {
      endGame();
      return;
    }

    rafRef.current = requestAnimationFrame(loop);
  }

  function drawIdle() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    drawBackground(ctx);
    drawPlatforms(ctx);
    drawCollectibles(ctx);
    drawPlayer(ctx);
    drawHUD(ctx, true);
  }

  function endGame() {
    const score = Math.floor(scrollYRef.current);
    stopLoop();
    onEnd(score);
  }

  function bounce(player: Player, vy: number) {
    player.vy = vy;
  }

  function rectIntersect(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  function circleRectIntersect(cx: number, cy: number, r: number, rx: number, ry: number, rw: number, rh: number) {
    const dx = Math.abs(cx - (rx + rw / 2));
    const dy = Math.abs(cy - (ry + rh / 2));
    if (dx > rw / 2 + r || dy > rh / 2 + r) return false;
    if (dx <= rw / 2 || dy <= rh / 2) return true;
    const corner = (dx - rw / 2) ** 2 + (dy - rh / 2) ** 2;
    return corner <= r * r;
  }

  function colors() {
    if (!dark) {
      return {
        bgTop: "#e0f2fe",
        bgBottom: "#ede9fe",
        vignette: "rgba(0,0,0,0.24)",
        plat: "#10b981",
        platFrag: "#f59e0b",
        platSpike: "#ef4444",
        platSpring: "#6366f1",
        platEdge: "rgba(0,0,0,0.12)",
        coin1: "#fde68a",
        coin2: "#fbbf24",
        coinStroke: "rgba(0,0,0,0.25)",
        powerStroke: "#22d3ee",
        playerTop: "#111827",
        playerBottom: "#1f2937",
        playerEye: "#ffffff",
        shieldGlow: "rgba(34,211,238,0.7)",
        hudFill: "rgba(255,255,255,0.7)",
        hudText: "#111827",
        shadow: "rgba(0,0,0,0.25)",
      };
    }
    return {
      bgTop: "#0b1220",
      bgBottom: "#1f1b2e",
      vignette: "rgba(0,0,0,0.5)",
      plat: "#10b981",
      platFrag: "#f59e0b",
      platSpike: "#ef4444",
      platSpring: "#8b5cf6",
      platEdge: "rgba(255,255,255,0.08)",
      coin1: "#f59e0b",
      coin2: "#fbbf24",
      coinStroke: "rgba(255,255,255,0.25)",
      powerStroke: "#67e8f9",
      playerTop: "#e5e7eb",
      playerBottom: "#cbd5e1",
      playerEye: "#0b1220",
      shieldGlow: "rgba(34,211,238,0.9)",
      hudFill: "rgba(0,0,0,0.35)",
      hudText: "#f8fafc",
      shadow: "rgba(0,0,0,0.45)",
    };
  }

  function drawBackground(ctx: CanvasRenderingContext2D) {
    const c = colors();
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, c.bgTop);
    g.addColorStop(1, c.bgBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    const vignette = ctx.createRadialGradient(width / 2, height * 0.45, Math.min(width, height) * 0.4, width / 2, height * 0.45, Math.max(width, height));
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, c.vignette);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    const t = (timeRef.current / 1000) % 1000;
    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 16; i++) {
      const y = ((i * 80 + (t * 15)) % (height + 80)) - 80;
      const grad = ctx.createLinearGradient(0, y, 0, y + 60);
      grad.addColorStop(0, "rgba(255,255,255,0.3)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, width, 60);
    }
    ctx.restore();
  }

  function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform) {
    const c = colors();
    let fill = c.plat;
    if (p.type === "fragile") fill = c.platFrag;
    else if (p.type === "spike") fill = c.platSpike;
    else if (p.type === "spring") fill = c.platSpring;

    ctx.save();
    ctx.shadowColor = colors().shadow;
    ctx.shadowBlur = 10;
    drawRoundedRect(ctx, p.x, p.y, p.w, p.h, 6);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
    ctx.strokeStyle = c.platEdge;
    ctx.stroke();

    if (p.type === "spike") {
      ctx.fillStyle = dark ? "#fecaca" : "#fff1f2";
      const spikes = Math.max(3, Math.floor(p.w / 10));
      for (let i = 0; i < spikes; i++) {
        const sx = p.x + (i + 0.5) * (p.w / spikes);
        const sy = p.y - 6;
        ctx.beginPath();
        ctx.moveTo(sx - 4, p.y);
        ctx.lineTo(sx, sy);
        ctx.lineTo(sx + 4, p.y);
        ctx.closePath();
        ctx.fill();
      }
    } else if (p.type === "spring") {
      ctx.strokeStyle = dark ? "#c7d2fe" : "#1e3a8a";
      ctx.lineWidth = 1.5;
      const coilY = p.y - 6;
      ctx.beginPath();
      ctx.moveTo(p.x + 8, coilY);
      for (let x = p.x + 8; x <= p.x + p.w - 8; x += 6) {
        ctx.lineTo(x + 3, coilY + 4);
        ctx.lineTo(x + 6, coilY);
      }
      ctx.stroke();
      ctx.fillStyle = dark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.18)";
      drawRoundedRect(ctx, p.x + 6, coilY - 4, p.w - 12, 3, 2);
      ctx.fill();
    } else if (p.type === "fragile" && p.broken) {
      ctx.strokeStyle = dark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x + 6, p.y + 2);
      ctx.lineTo(p.x + p.w * 0.5, p.y + 8);
      ctx.lineTo(p.x + p.w - 6, p.y + 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlatforms(ctx: CanvasRenderingContext2D) {
    for (const p of platformsRef.current) drawPlatform(ctx, p);
  }

  function drawCollectibles(ctx: CanvasRenderingContext2D) {
    const c = colors();
    for (const coin of coinsRef.current) {
      if (coin.taken) continue;
      const g = ctx.createRadialGradient(coin.x - 2, coin.y - 2, 1, coin.x, coin.y, coin.r + 1);
      g.addColorStop(0, c.coin1);
      g.addColorStop(1, c.coin2);
      ctx.save();
      ctx.shadowColor = colors().shadow;
      ctx.shadowBlur = 8;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = c.coinStroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      const t = (timeRef.current / 300) % (Math.PI * 2);
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(coin.x + Math.cos(t) * 2, coin.y + Math.sin(t) * 2, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = dark ? "#fff" : "#fff";
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.lineWidth = 2;
    for (const pu of powerupsRef.current) {
      if (pu.taken) continue;
      ctx.strokeStyle = c.powerStroke;
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, pu.r + 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(pu.x, pu.y, pu.r - 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlayer(ctx: CanvasRenderingContext2D) {
    const c = colors();
    const pl = playerRef.current;

    const g = ctx.createLinearGradient(pl.x, pl.y, pl.x, pl.y + pl.h);
    g.addColorStop(0, c.playerTop);
    g.addColorStop(1, c.playerBottom);

    ctx.save();
    ctx.shadowColor = colors().shadow;
    ctx.shadowBlur = 12;
    drawRoundedRect(ctx, pl.x, pl.y, pl.w, pl.h, 8);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
    ctx.strokeStyle = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
    ctx.stroke();

    const eyeY = pl.y + pl.h * 0.35;
    ctx.fillStyle = c.playerEye;
    ctx.beginPath();
    ctx.arc(pl.x + pl.w * 0.3, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pl.x + pl.w * 0.7, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();

    if (shieldRef.current) {
      ctx.strokeStyle = colors().shieldGlow;
      ctx.lineWidth = 3;
      ctx.shadowColor = colors().shieldGlow;
      ctx.shadowBlur = 14;
      drawRoundedRect(ctx, pl.x - 3, pl.y - 3, pl.w + 6, pl.h + 6, 10);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHUD(ctx: CanvasRenderingContext2D, idle = false) {
    const c = colors();

    ctx.save();
    ctx.globalAlpha = 1;

    const pill = (x: number, y: number, w: number, h: number, text: string) => {
      ctx.save();
      ctx.fillStyle = c.hudFill;
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
      ctx.lineWidth = 1;
      drawRoundedRect(ctx, x, y, w, h, h / 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = c.hudText;
      ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x + 10, y + h / 2);
      ctx.restore();
    };

    pill(10, 10, 88, 26, `Score ${Math.max(0, Math.floor(scrollYRef.current))}`);
    pill(width - 86 - 10, 10, 86, 26, `Coins ${coinsCountRef.current}`);

    if (idle) {
      ctx.fillStyle = c.hudText;
      ctx.font = "600 16px system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Clique ou Espace pour jouer", width / 2, height * 0.46);
      ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif";
      ctx.globalAlpha = 0.8;
      ctx.fillText("← / → pour bouger, wrap horizontal", width / 2, height * 0.46 + 22);
    }

    ctx.restore();
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={() => {
        if (state === "idle") start();
        if (state === "finished") start();
      }}
      className="rounded-[22px] border ring-1 ring-black/10 dark:ring-white/10 dark:border-white/10 shadow-lg"
    />
  );
}
