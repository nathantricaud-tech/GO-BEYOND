/**
 * GO BEYOND rank system.
 *
 * Each day the user logs at least one meal AND at least one workout counts
 * as a "full assiduity day" (+10 pts). A day with only one of the two
 * counts as a "partial day" (+4 pts). Points accumulate for life — nothing
 * is ever lost, so progression is a genuine long-term history, not a
 * resettable streak.
 *
 * The gap between ranks grows on purpose: climbing from Fer to Bronze only
 * takes ~5 full days, but reaching HERO from Challenger takes ~20 — mirrors
 * the "easy start, hard finish" progression the user asked for.
 */

export interface RankDef {
  key: string;
  name: string;
  emoji: string;
  color: string; // tailwind-ish hex used for the badge glow
  threshold: number; // cumulative points required to REACH this rank
}

const FULL_DAY_POINTS = 10;
const PARTIAL_DAY_POINTS = 4;

// Consecutive "full days" required to climb from each rank to the next.
// [5, 6, 7, 8, 9, 11, 13, 16, 20] → 9 gaps for 10 ranks.
const DAY_GAPS = [5, 6, 7, 8, 9, 11, 13, 16, 20];

function buildThresholds(): number[] {
  const thresholds = [0];
  let cumulative = 0;
  for (const gap of DAY_GAPS) {
    cumulative += gap * FULL_DAY_POINTS;
    thresholds.push(cumulative);
  }
  return thresholds;
}

const THRESHOLDS = buildThresholds();

export const RANKS: RankDef[] = [
  { key: "fer", name: "Fer", emoji: "🔩", color: "#8a8f98", threshold: THRESHOLDS[0] },
  { key: "bronze", name: "Bronze", emoji: "🥉", color: "#c07a3e", threshold: THRESHOLDS[1] },
  { key: "argent", name: "Argent", emoji: "🥈", color: "#b6c2cf", threshold: THRESHOLDS[2] },
  { key: "or", name: "Or", emoji: "🥇", color: "#f2b705", threshold: THRESHOLDS[3] },
  { key: "diamant", name: "Diamant", emoji: "💎", color: "#5ecbe0", threshold: THRESHOLDS[4] },
  { key: "platine", name: "Platine", emoji: "⚙️", color: "#9db4c0", threshold: THRESHOLDS[5] },
  { key: "fighter", name: "Fighter", emoji: "🥋", color: "#c81d25", threshold: THRESHOLDS[6] },
  { key: "gymaster", name: "Gymaster", emoji: "🏋️", color: "#1a936f", threshold: THRESHOLDS[7] },
  { key: "challenger", name: "Challenger", emoji: "⚡", color: "#7c5cff", threshold: THRESHOLDS[8] },
  { key: "hero", name: "HERO", emoji: "👑", color: "#f2b705", threshold: THRESHOLDS[9] },
];

export interface RankResult {
  points: number;
  rankIndex: number;
  rank: RankDef;
  nextRank: RankDef | null;
  pointsIntoRank: number;
  pointsForNextRank: number | null;
  progressPct: number; // 0-100 toward next rank
}

export function computeRank(points: number): RankResult {
  let rankIndex = 0;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].threshold) {
      rankIndex = i;
      break;
    }
  }
  const rank = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1] || null;
  const pointsIntoRank = points - rank.threshold;
  const pointsForNextRank = nextRank ? nextRank.threshold - rank.threshold : null;
  const progressPct = nextRank ? Math.min(100, Math.round((pointsIntoRank / (pointsForNextRank as number)) * 100)) : 100;

  return { points, rankIndex, rank, nextRank, pointsIntoRank, pointsForNextRank, progressPct };
}

/**
 * Given the set of dates a user logged food and the set of dates they
 * logged a workout, compute total lifetime points.
 */
export function computePointsFromDates(foodDates: Set<string>, workoutDates: Set<string>): number {
  const allDates = new Set([...foodDates, ...workoutDates]);
  let points = 0;
  for (const date of allDates) {
    const hasFood = foodDates.has(date);
    const hasWorkout = workoutDates.has(date);
    if (hasFood && hasWorkout) points += FULL_DAY_POINTS;
    else points += PARTIAL_DAY_POINTS;
  }
  return points;
}

/** Current streak: consecutive days (ending today or yesterday) with full assiduity. */
export function computeCurrentStreak(foodDates: Set<string>, workoutDates: Set<string>): number {
  let streak = 0;
  const d = new Date();
  // Allow the streak to still count if today isn't logged yet but yesterday was
  // (so the user doesn't lose their streak display before the day is over).
  if (!(foodDates.has(isoDate(d)) && workoutDates.has(isoDate(d)))) {
    d.setDate(d.getDate() - 1);
  }
  while (foodDates.has(isoDate(d)) && workoutDates.has(isoDate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
