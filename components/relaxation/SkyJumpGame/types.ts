export type SJState = "idle" | "running" | "paused" | "finished";

export type SJRun = {
  dateKey: string;
  score: number;
  coins: number;
  timestamp: number;
};
