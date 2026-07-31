/** @deprecated Prefer `@/lib/demo/*`. Kept as a thin pointer for any lingering imports. */
export {
  calls,
  users as employees,
  alerts,
  coachingItems,
  insights as executiveInsights,
} from "./demo/seed";

export const improvement: {
  week: string;
  confidence: number;
  score: number;
  closeRate: number;
  talkRatio: number;
}[] = [];
export const personality: { trait: string; value: number }[] = [];
export const callsPerDay: { day: string; calls: number; closed: number }[] = [];
export const revenueTrend: { month: string; revenue: number; score: number }[] = [];
export const hourlyCloseRate: { hour: string; rate: number }[] = [];
export const coachMessages: { from: "iris" | "user"; text: string }[] = [];
