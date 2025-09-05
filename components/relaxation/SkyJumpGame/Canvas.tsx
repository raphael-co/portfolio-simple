"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type PlatformType = "normal" | "fragile" | "spike" | "spring";
type PowerUpType = "shield";

type Platform = { x: number; y: number; w: number; h: number; type: PlatformType; broken?: boolean };
type Coin = { x: number; y: number; r: number; taken?: boolean };
type PowerUp = { x: number; y: number; r: number; type: PowerUpType; taken?: boolean };
type Player = { x: number; y: number; w: number; h: number; vx: number; vy: number };

type HistoryEntry =
    | {
        type: "coin";
        t: number;
        x: number;
        y: number;
        coinsCollected: number;
        scoreAdded: number;
        totalScore: number;
    }
    | {
        type: "end";
        t: number;
        finalScore: number;
        coinsCollected: number;
    };

export default function Canvas({
    state,
    rng,
    start,
    reset,
    onEnd,
    onScore,
    onCoins,
    onHistory,
    maxWidth = 560,
    aspectW = 3,
    aspectH = 4,
    locale = "fr",
}: {
    state: "idle" | "running" | "finished";
    rng: () => number;
    start: () => void;
    reset: () => void;
    onEnd: (finalScore: number, coins: number) => void; // <<< envoie aussi les pièces
    onScore: (score: number) => void;
    onCoins: (coins: number) => void;
    onHistory?: (history: HistoryEntry[]) => void;
    maxWidth?: number;
    aspectW?: number;
    aspectH?: number;
    locale?: string;
}) {
    const t = useMemo(() => {
        if (locale === "fr") {
            return {
                score: "Score",
                coins: "Pièces",
                idleTap: "Tape/Espace pour jouer",
                idleHint: "Maintiens gauche/droite pour bouger",
                left: "Gauche",
                right: "Droite",
            };
        }
        return {
            score: "Score",
            coins: "Coins",
            idleTap: "Tap/Space to play",
            idleHint: "Hold left/right to move",
            left: "Left",
            right: "Right",
        };
    }, [locale]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
    const activeTouchRef = useRef<{ id: number | null; side: "left" | "right" | null }>({ id: null, side: null });

    const platformsRef = useRef<Platform[]>([]);
    const coinsRef = useRef<Coin[]>([]);
    const powerupsRef = useRef<PowerUp[]>([]);
    const scrollYRef = useRef(0);

    const coinsCountRef = useRef(0);
    const coinScoreRef = useRef(0);

    const lastScoreRef = useRef(0);
    const lastCoinsRef = useRef(0);
    const shieldRef = useRef<boolean>(false);

    const [dark, setDark] = useState<boolean>(false);
    const [reducedMotion, setReducedMotion] = useState<boolean>(false);

    const finePointerRef = useRef(false);
    const timeRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const lastNowRef = useRef<number>(0);
    const playerRef = useRef<Player>({ x: 0, y: 0, w: 28, h: 34, vx: 0, vy: 0 });

    const historyRef = useRef<HistoryEntry[]>([]);

    const onScoreRef = useRef(onScore);
    const onCoinsRef = useRef(onCoins);
    const onEndRef = useRef(onEnd);
    useEffect(() => {
        onScoreRef.current = onScore;
        onCoinsRef.current = onCoins;
        onEndRef.current = onEnd;
    }, [onScore, onCoins, onEnd]);

    const supportsVibrate = useMemo(() => typeof navigator !== "undefined" && "vibrate" in navigator, []);
    const vibrate = (ms: number) => {
        if (supportsVibrate) {
            try {
                (navigator as any).vibrate?.(ms);
            } catch { }
        }
    };
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

    const totalScore = () => {

        const coinsScore = 100 * coinsCountRef.current;
        const altitudeScore = Math.floor(scrollYRef.current);

        return Math.max(0, Math.floor(scrollYRef.current)) + coinScoreRef.current;
    }

    // ----- Responsive -----
    useEffect(() => {
        const el = boxRef.current;
        const c = canvasRef.current;
        if (!el || !c) return;

        const setSize = () => {
            const rect = el.getBoundingClientRect();
            const cssW = Math.max(1, rect.width);
            const cssH = Math.max(1, rect.height);
            const dpr = window.devicePixelRatio || 1;
            c.width = Math.round(cssW * dpr);
            c.height = Math.round(cssH * dpr);
            c.style.width = `${cssW}px`;
            c.style.height = `${cssH}px`;
            if (state !== "running") drawIdle();
        };

        const ro = new ResizeObserver(setSize);
        ro.observe(el);
        setSize();

        const onResize = () => setSize();
        window.addEventListener("resize", onResize);

        let dpr = window.devicePixelRatio || 1;
        const dprInterval = window.setInterval(() => {
            if (window.devicePixelRatio !== dpr) {
                dpr = window.devicePixelRatio || 1;
                setSize();
            }
        }, 500);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onResize);
            window.clearInterval(dprInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const getSize = () => {
        const c = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        if (!c) return { width: 320, height: 426 };
        return { width: c.width / dpr, height: c.height / dpr };
    };

    // ----- Thème / pointeur / motion -----
    useEffect(() => {
        const mqDark = window.matchMedia("(prefers-color-scheme: dark)");
        const mqPointer = window.matchMedia("(pointer: fine)");
        const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const onDark = () => setDark(mqDark.matches);
        const onPointer = () => (finePointerRef.current = mqPointer.matches);
        const onMotion = () => setReducedMotion(mqMotion.matches);

        mqDark.addEventListener?.("change", onDark);
        mqPointer.addEventListener?.("change", onPointer);
        mqMotion.addEventListener?.("change", onMotion);

        onDark();
        onPointer();
        onMotion();

        return () => {
            mqDark.removeEventListener?.("change", onDark);
            mqPointer.removeEventListener?.("change", onPointer);
            mqMotion.removeEventListener?.("change", onMotion);
        };
    }, []);

    // ----- Tuning -----
    function tuning() {
        const { width } = getSize();
        const isDesktop = finePointerRef.current && width >= 520;
        return {
            isDesktop,
            gapScale: 1.0,
            widthScale: isDesktop ? 1.2 : 1.0,
            helperChance: isDesktop ? 0.2 : 0.0,
            playerScale: isDesktop ? 1.12 : 1.0,
            probFrag: isDesktop ? 0.1 : 0.12,
            probSpike: isDesktop ? 0.15 : 0.18,
            probSpring: isDesktop ? 0.25 : 0.24,
            coinProb: isDesktop ? 0.35 : 0.28,
            powerProb: isDesktop ? 0.12 : 0.08,
            moveSpeed: isDesktop ? 4.6 : 3.25,
            gravity: isDesktop ? 0.2 : 0.22,
            jumpVel: isDesktop ? -8.0 : -7.4,
            springVel: isDesktop ? -12.8 : -11.6,
            riseMult: isDesktop ? 1.15 : 1.1,
            fallMult: isDesktop ? 1.65 : 1.5,
            maxFall: isDesktop ? 13.5 : 12.0,
            friction: 0.9,
        };
    }

    // ----- Difficulté dynamique -----
    function difficulty() {
        const s = scrollYRef.current;
        const prog = Math.min(1, s / 1800);
        return {
            h: 1 + prog * 1.5,
            g: 1 + prog * 0.5,
            j: 1 + prog * 0.35,
            s: 1 + prog * 0.35,
            r: 1 + prog * 0.35,
            f: 1 + prog * 0.6,
        };
    }

    // ----- Cycle de vie -----
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

    // Clavier
    useEffect(() => {
        const isEditable = (el: EventTarget | null) => {
            const n = el as HTMLElement | null;
            const tag = n?.tagName?.toLowerCase();
            return !!n && (n.isContentEditable || tag === "input" || tag === "textarea" || tag === "select");
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (isEditable(e.target)) return;
            const k = e.key;
            const isLeft = k === "ArrowLeft" || k.toLowerCase() === "a";
            const isRight = k === "ArrowRight" || k.toLowerCase() === "d";
            thePrevent(k) && e.preventDefault();

            if (isLeft) keysRef.current.left = true;
            if (isRight) keysRef.current.right = true;
            if ((k === " " || k === "Enter") && state !== "running") start();
        };
        const onKeyUp = (e: KeyboardEvent) => {
            if (isEditable(e.target)) return;
            const k = e.key;
            if (k === "ArrowLeft" || k.toLowerCase() === "a") keysRef.current.left = false;
            if (k === "ArrowRight" || k.toLowerCase() === "d") keysRef.current.right = false;
        };
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [state, start]);

    const thePrevent = (k: string) =>
        k === "ArrowLeft" ||
        k.toLowerCase() === "a" ||
        k === "ArrowRight" ||
        k.toLowerCase() === "d" ||
        k === " " ||
        k === "Enter";

    // Pause onglet masqué
    useEffect(() => {
        const onVis = () => {
            if (document.hidden) {
                stopLoop();
            } else if (state === "running") {
                lastNowRef.current = performance.now();
                startLoop();
            }
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [state]);

    function stopLoop() {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }
    function startLoop() {
        stopLoop();
        startTimeRef.current = performance.now();
        lastNowRef.current = startTimeRef.current;
        rafRef.current = requestAnimationFrame(loop);
    }

    // ----- Monde -----
    function setupWorld() {
        const { width, height } = getSize();
        const t = tuning();
        const p0W = 84 * t.widthScale;
        const p0: Platform = { x: width / 2 - p0W / 2, y: height - 18, w: p0W, h: 12, type: "normal" };
        platformsRef.current = [p0];
        coinsRef.current = [];
        powerupsRef.current = [];
        scrollYRef.current = 0;

        coinsCountRef.current = 0;
        coinScoreRef.current = 0;

        lastScoreRef.current = 0;
        lastCoinsRef.current = 0;
        shieldRef.current = false;

        historyRef.current = [];

        const ps = t.playerScale;
        playerRef.current = { x: width / 2 - 14 * ps, y: height - 60 * ps, w: 28 * ps, h: 34 * ps, vx: 0, vy: 0 };

        spawnInitialPlatforms();
        onScoreRef.current(0);
        onCoinsRef.current(0);
    }

    function spawnInitialPlatforms() {
        const { height } = getSize();
        const t = tuning();
        let y = height - 56;
        for (let i = 0; i < 18; i++) {
            y -= (40 + rng() * 30) * t.gapScale;
            spawnPlatformRow(y, t);
        }
    }

    function spawnPlatformRow(y: number, t = tuning()) {
        const { width } = getSize();
        const pad = 22;
        const baseW = 60 + rng() * 40;
        const w = Math.min(baseW * t.widthScale, width - pad * 2);
        let x = pad + rng() * (width - pad * 2 - w);

        const r = rng();
        let type: PlatformType = "normal";
        if (r < t.probFrag) type = "fragile";
        else if (r < t.probSpike) type = "spike";
        else if (r < t.probSpring) type = "spring";

        platformsRef.current.push({ x, y, w, h: 12, type });

        if (t.isDesktop && rng() < t.helperChance) {
            const w2 = Math.min(w * 0.9, width - pad * 2);
            let x2 = pad + rng() * (width - pad * 2 - w2);
            if (Math.abs(x2 - x) < Math.min(90, w)) {
                x2 = clamp(x2 + (x2 < x ? -1 : 1) * (w * 0.7), pad, width - pad - w2);
            }
            platformsRef.current.push({ x: x2, y, w: w2, h: 12, type: "normal" });
        }

        if (rng() < t.coinProb) coinsRef.current.push({ x: x + w / 2, y: y - 18, r: 7, taken: false });
        if (rng() < t.powerProb) powerupsRef.current.push({ x: clamp(x + w / 2 + 20, pad + 10, width - pad - 10), y: y - 20, r: 9, type: "shield", taken: false });
    }

    // ----- Boucle -----
    function loop(now: number) {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        // delta time
        let dt = (now - (lastNowRef.current || now)) / 1000;
        if (!isFinite(dt) || dt <= 0) dt = 1 / 60;
        dt = Math.min(dt, 1 / 30);
        const step = dt * 60;
        lastNowRef.current = now;
        timeRef.current = now;

        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const { width, height } = getSize();
        ctx.clearRect(0, 0, width, height);

        drawBackground(ctx);

        const tcfg = tuning();
        const diff = difficulty();

        const moveSpeed = tcfg.moveSpeed * diff.h;
        const gravity = tcfg.gravity * diff.g;
        const jumpVel = tcfg.jumpVel * diff.j;
        const springVel = tcfg.springVel * diff.s;

        const riseMult = tcfg.riseMult * diff.r;
        const fallMult = tcfg.fallMult * diff.f;
        const maxFall = tcfg.maxFall * diff.f;

        const player = playerRef.current;

        // X
        if (keysRef.current.left && !keysRef.current.right) player.vx = -moveSpeed;
        else if (keysRef.current.right && !keysRef.current.left) player.vx = moveSpeed;
        else player.vx *= Math.pow(tcfg.friction, step);
        player.x += player.vx * step;

        if (player.x < -player.w / 2) player.x = width + player.w / 2;
        if (player.x > width + player.w / 2) player.x = -player.w / 2;

        // Y + collisions
        const yPrev = player.y;
        const bottomPrev = yPrev + player.h;

        const gravToApply = player.vy < 0 ? gravity * riseMult : gravity * fallMult;
        player.vy += gravToApply * step;
        if (player.vy > maxFall) player.vy = maxFall;

        const yTarget = player.y + player.vy * step;
        const bottomTarget = yTarget + player.h;

        let hitPlatform: Platform | null = null;
        let hitY: number = yTarget;

        if (player.vy > 0) {
            const px1 = player.x + 2;
            const px2 = player.x + player.w - 2;

            let minCross = Infinity;
            for (const p of platformsRef.current) {
                if (p.type === "fragile" && p.broken) continue;

                const platTop = p.y;
                if (bottomPrev <= platTop && bottomTarget >= platTop) {
                    const ox1 = p.x;
                    const ox2 = p.x + p.w;
                    const overlap = !(px2 < ox1 || px1 > ox2);
                    if (!overlap) continue;

                    const crossDy = bottomTarget - platTop;
                    if (crossDy < minCross) {
                        minCross = crossDy;
                        hitPlatform = p;
                        hitY = platTop - player.h;
                    }
                }
            }

            if (hitPlatform) {
                player.y = hitY;
                if (hitPlatform.type === "spike") {
                    if (shieldRef.current) {
                        shieldRef.current = false;
                        bounce(player, jumpVel);
                        vibrate(20);
                    } else {
                        vibrate(30);
                        endGame();
                        return;
                    }
                } else if (hitPlatform.type === "fragile") {
                    if (!hitPlatform.broken) {
                        bounce(player, jumpVel);
                        hitPlatform.broken = true;
                        vibrate(8);
                    }
                } else if (hitPlatform.type === "spring") {
                    bounce(player, springVel);
                    vibrate(12);
                } else {
                    bounce(player, jumpVel);
                }
            } else {
                player.y = yTarget;
            }
        } else {
            player.y = yTarget;
        }

        for (const coin of coinsRef.current) {
            if (!coin.taken && circleRectIntersect(coin.x, coin.y, coin.r, player.x, player.y, player.w, player.h)) {
                coin.taken = true;
                coinsCountRef.current += 1;
                coinScoreRef.current += 100;

                historyRef.current.push({
                    type: "coin",
                    t: Math.max(0, Math.floor(timeRef.current - startTimeRef.current)),
                    x: coin.x,
                    y: coin.y,
                    coinsCollected: coinsCountRef.current,
                    scoreAdded: 100,
                    totalScore: totalScore(),
                });

                if (coinsCountRef.current !== lastCoinsRef.current) {
                    lastCoinsRef.current = coinsCountRef.current;
                    onCoinsRef.current(coinsCountRef.current);
                }

                const sc = totalScore();
                if (sc !== lastScoreRef.current) {
                    lastScoreRef.current = sc;
                    onScoreRef.current(sc);
                }
                vibrate(10);
            }
        }

        // Powerups
        for (const pu of powerupsRef.current) {
            if (!pu.taken && circleRectIntersect(pu.x, pu.y, pu.r, player.x, player.y, player.w, player.h)) {
                pu.taken = true;
                shieldRef.current = true;
                vibrate(12);
            }
        }

        // Scroll caméra => score altitude
        const { height: H } = getSize();
        const threshold = H * 0.42;
        if (player.y < threshold) {
            const dy = threshold - player.y;
            player.y = threshold;
            for (const p of platformsRef.current) p.y += dy;
            for (const coin of coinsRef.current) coin.y += dy;
            for (const pu of powerupsRef.current) pu.y += dy;
            scrollYRef.current += dy;

            const sc = totalScore();
            if (sc !== lastScoreRef.current) {
                lastScoreRef.current = sc;
                onScoreRef.current(sc);
            }
        }

        // Nettoyage
        while (platformsRef.current.length && platformsRef.current[0].y > H + 30) platformsRef.current.shift();
        while (coinsRef.current.length && coinsRef.current[0].y > H + 40) coinsRef.current.shift();
        while (powerupsRef.current.length && powerupsRef.current[0].y > H + 40) powerupsRef.current.shift();

        // Spawn
        let topMost = Infinity;
        for (const p of platformsRef.current) if (p.y < topMost) topMost = p.y;
        if (topMost === Infinity) {
            spawnPlatformRow(H * 0.75);
        } else if (topMost > 40) {
            const gap = (40 + rng() * 30) * tuning().gapScale;
            spawnPlatformRow(topMost - gap);
        }

        // Rendu
        drawPlatforms(ctx);
        drawCollectibles(ctx);
        drawPlayer(ctx);
        drawHUD(ctx);

        // Fin si chute
        if (player.y > H + 40) {
            vibrate(30);
            endGame();
            return;
        }

        rafRef.current = requestAnimationFrame(loop);
    }

    // ----- Rendus -----
    function drawIdle() {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const { width, height } = getSize();
        ctx.clearRect(0, 0, width, height);
        drawBackground(ctx);
        drawPlatforms(ctx);
        drawCollectibles(ctx);
        drawPlayer(ctx);
        drawHUD(ctx, true);
    }

    function endGame() {
        stopLoop();
        const final = totalScore();
        const coinsFinal = coinsCountRef.current;

        historyRef.current.push({
            type: "end",
            t: Math.max(0, Math.floor(timeRef.current - startTimeRef.current)),
            finalScore: final,
            coinsCollected: coinsFinal,
        });

        onEndRef.current(final, coinsFinal);
        onHistory?.([...historyRef.current]);
    }

    function bounce(player: Player, vy: number) {
        player.vy = vy;
    }

    // ----- Utils collisions -----
    function circleRectIntersect(cx: number, cy: number, r: number, rx: number, ry: number, rw: number, rh: number) {
        const dx = Math.abs(cx - (rx + rw / 2));
        const dy = Math.abs(cy - (ry + rh / 2));
        if (dx > rw / 2 + r || dy > rh / 2 + r) return false;
        if (dx <= rw / 2 || dy <= rh / 2) return true;
        const corner = (dx - rw / 2) ** 2 + (dy - rh / 2) ** 2;
        return corner <= r * r;
    }

    // ----- Palette -----
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
        const { width, height } = getSize();
        const c = colors();

        const g = ctx.createLinearGradient(0, 0, 0, height);
        g.addColorStop(0, c.bgTop);
        g.addColorStop(1, c.bgBottom);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        const vignette = ctx.createRadialGradient(
            width / 2,
            height * 0.45,
            Math.min(width, height) * 0.4,
            width / 2,
            height * 0.45,
            Math.max(width, height)
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, c.vignette);
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);

        if (!reducedMotion) {
            const t = (timeRef.current / 1000) % 1000;
            ctx.save();
            ctx.globalAlpha = 0.08;
            for (let i = 0; i < 16; i++) {
                const y = ((i * 80 + t * 15) % (height + 80)) - 80;
                const grad = ctx.createLinearGradient(0, y, 0, y + 60);
                grad.addColorStop(0, "rgba(255,255,255,0.3)");
                grad.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, y, width, 60);
            }
            ctx.restore();
        }
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
            ctx.fillStyle = "#fff";
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
        const { width, height } = getSize();
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

        pill(10, 10, 110, 26, `${t.score} ${totalScore()}`);
        pill(width - 100 - 10, 10, 100, 26, `${t.coins} ${coinsCountRef.current}`);

        const showZones = !finePointerRef.current;
        if (showZones) {
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = c.hudText;
            ctx.fillRect(0, height - 80, width / 2, 80);
            ctx.fillRect(width / 2, height - 80, width / 2, 80);
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = 0.65;
            ctx.fillStyle = c.hudText;
            ctx.font = "600 12px system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(t.left, width * 0.25, height - 40);
            ctx.fillText(t.right, width * 0.75, height - 40);
            ctx.restore();
        }

        if (idle) {
            ctx.fillStyle = c.hudText;
            ctx.font = "600 16px system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(t.idleTap, width / 2, height * 0.46);
            ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif";
            ctx.globalAlpha = 0.8;
            ctx.fillText(t.idleHint, width / 2, height * 0.46 + 22);
        }

        ctx.restore();
    }

    // ----- Contrôles tactiles -----
    function sideFromPointer(e: PointerEvent): "left" | "right" {
        const c = canvasRef.current!;
        const rect = c.getBoundingClientRect();
        const x = e.clientX - rect.left;
        return x < rect.width / 2 ? "left" : "right";
    }
    function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
        e.preventDefault();
        (e.currentTarget as HTMLCanvasElement).setPointerCapture?.(e.pointerId);
        if (state !== "running") start();
        if (activeTouchRef.current.id == null) {
            const side = sideFromPointer(e.nativeEvent);
            activeTouchRef.current = { id: e.pointerId, side };
            keysRef.current.left = side === "left";
            keysRef.current.right = side === "right";
        }
    }
    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
        if (activeTouchRef.current.id !== e.pointerId) return;
        const side = sideFromPointer(e.nativeEvent);
        if (side !== activeTouchRef.current.side) {
            activeTouchRef.current.side = side;
            keysRef.current.left = side === "left";
            keysRef.current.right = side === "right";
        }
    }
    function clearTouchControl() {
        activeTouchRef.current = { id: null, side: null };
        keysRef.current.left = false;
        keysRef.current.right = false;
    }
    function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
        (e.currentTarget as HTMLCanvasElement).releasePointerCapture?.(e.pointerId);
        if (activeTouchRef.current.id === e.pointerId) clearTouchControl();
    }
    function handlePointerCancel() {
        clearTouchControl();
    }

    return (
        <div className="w-full min-w-0" style={{ maxWidth: `min(100%, ${maxWidth}px)` }}>
            <div
                ref={boxRef}
                className="relative w-full min-w-0 rounded-[22px] border shadow-lg ring-1 ring-black/10 dark:border-white/10 dark:ring-white/10"
                style={{ aspectRatio: `${aspectW} / ${aspectH}`, overflow: "hidden" }}
            >
                <canvas
                    ref={canvasRef}
                    onClick={() => {
                        if (state === "idle") start();
                        if (state === "finished") start();
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                    className="absolute inset-0 select-none"
                    style={{
                        touchAction: "none",
                        WebkitUserSelect: "none",
                        userSelect: "none",
                        WebkitTapHighlightColor: "transparent",
                        width: "100%",
                        height: "100%",
                        display: "block",
                    }}
                />
            </div>
        </div>
    );
}
