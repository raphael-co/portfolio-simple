export type TFRun = {
  dateKey: string;
  ms: number;
  hits: number;
  misses: number;
  timestamp: number;
};

export type TFState = "idle" | "running" | "finished";