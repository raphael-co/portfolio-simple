export type SJState = "idle" | "running" | "finished";

export type SJRun = {
  dateKey: string;
  score: number;
  coins: number;
  timestamp: number;
};
