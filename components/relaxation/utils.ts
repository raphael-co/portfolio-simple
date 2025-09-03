export type TrialState =
  | "idle"
  | "arming"
  | "ready"
  | "clicked"
  | "false-start"
  | "finished";

export type RunResult = {
  dateKey: string;
  totalMs: number;
  trials: number[];
  falseStarts: number;
  timestamp: number;
};

export const LS_PREFIX = "relax-reaction-sprint";

export function pad(n: number, digits = 2) {
  return n.toString().padStart(digits, "0");
}

export function formatMs(ms: number) {
  return `${ms.toFixed(0)} ms`;
}

export function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${pad(m)}-${pad(day)}`;
}

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStr(s?: string) {
  if (!s) return 0;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function dailyRng(locale: string) {
  const d = new Date();
  const seed =
    Number(`${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`) ^
    hashStr(locale);
  return mulberry32(seed);
}

export function lsGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function lsSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
