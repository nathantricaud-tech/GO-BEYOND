import type { Exercise } from "./exercises-db";

/**
 * Exercises are logged either by TIME (holds, cardio, HIIT intervals — e.g.
 * "30-60 sec hold", "20-40 min") or by REPS (sets x reps — e.g. "12-15",
 * "8-12", "12 each leg"). This module figures out which mode an exercise
 * uses, what sensible defaults are, and converts whatever the user actually
 * did into a realistic calorie burn — instead of always assuming a flat
 * 10-minute session like before.
 *
 * caloriesPer30 in the exercise DB is a MET-derived calories-per-30-minutes
 * figure. We prorate it against the estimated (or entered) time under
 * tension for the actual session.
 */

export type ExerciseLogMode = "time" | "reps";

export interface ExerciseDefaults {
  mode: ExerciseLogMode;
  // time mode
  defaultDurationMin?: number;
  // reps mode
  defaultSets: number;
  defaultRepsPerSet: number;
  repsLabel: string; // e.g. "each leg", "total" — kept for display
}

const SEC_PER_REP = 3.5; // concentric + eccentric, average across exercise types
const REST_MIN_STRENGTH = 1.1; // rest between sets, heavier/compound work
const REST_MIN_CALISTHENICS = 0.75;
const REST_MIN_OTHER = 0.5;

function restMinutesFor(ex: Exercise): number {
  if (ex.category === "strength") return REST_MIN_STRENGTH;
  if (ex.category === "calisthenics") return REST_MIN_CALISTHENICS;
  return REST_MIN_OTHER;
}

/** Parses "30-60 sec hold" / "20-40 min" / "15-20 min" style strings into minutes. */
function parseTimeRangeToMinutes(text: string): number {
  const secMatch = text.match(/(\d+)\s*-\s*(\d+)\s*sec/i) || text.match(/(\d+)\s*sec/i);
  if (secMatch) {
    const lo = parseInt(secMatch[1], 10);
    const hi = secMatch[2] ? parseInt(secMatch[2], 10) : lo;
    return (lo + hi) / 2 / 60;
  }
  const minMatch = text.match(/(\d+)\s*-\s*(\d+)\s*min/i) || text.match(/(\d+)\s*min/i);
  if (minMatch) {
    const lo = parseInt(minMatch[1], 10);
    const hi = minMatch[2] ? parseInt(minMatch[2], 10) : lo;
    return (lo + hi) / 2;
  }
  return 10; // fallback
}

/** Parses "12-15" / "8-12" / "12 each leg" / "20 total (10 each side)" into a per-set rep count. */
function parseRepsToCount(text: string): { count: number; label: string } {
  const rangeMatch = text.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1], 10);
    const hi = parseInt(rangeMatch[2], 10);
    return { count: Math.round((lo + hi) / 2), label: text.replace(/^\d+\s*-\s*\d+\s*/, "").trim() };
  }
  const singleMatch = text.match(/(\d+)/);
  if (singleMatch) {
    const count = parseInt(singleMatch[1], 10);
    return { count, label: text.replace(/^\d+\s*/, "").trim() };
  }
  return { count: 10, label: "" };
}

export function isTimeBased(ex: Exercise): boolean {
  return /sec|min/i.test(ex.defaultReps) || ex.category === "cardio";
}

export function getExerciseDefaults(ex: Exercise): ExerciseDefaults {
  if (isTimeBased(ex)) {
    return {
      mode: "time",
      defaultDurationMin: Math.max(1, Math.round(parseTimeRangeToMinutes(ex.defaultReps) * ex.defaultSets * 10) / 10),
      defaultSets: ex.defaultSets,
      defaultRepsPerSet: 0,
      repsLabel: "",
    };
  }
  const { count, label } = parseRepsToCount(ex.defaultReps);
  return {
    mode: "reps",
    defaultSets: ex.defaultSets,
    defaultRepsPerSet: count,
    repsLabel: label,
  };
}

export interface ExerciseSessionResult {
  durationMin: number;
  caloriesBurned: number;
}

/** Estimates real duration from sets x reps performed, using a realistic tempo + rest model. */
export function estimateFromReps(ex: Exercise, sets: number, repsPerSet: number): ExerciseSessionResult {
  const totalReps = Math.max(0, sets * repsPerSet);
  const restMin = restMinutesFor(ex);
  const workMin = (totalReps * SEC_PER_REP) / 60;
  const restTotalMin = Math.max(0, sets - 1) * restMin;
  const durationMin = Math.max(0.5, Math.round((workMin + restTotalMin) * 10) / 10);
  const caloriesBurned = Math.max(1, Math.round(ex.caloriesPer30 * (durationMin / 30)));
  return { durationMin, caloriesBurned };
}

/** Calories from actual time spent (cardio, holds, HIIT). */
export function estimateFromDuration(ex: Exercise, durationMin: number): ExerciseSessionResult {
  const safeMin = Math.max(0.5, durationMin);
  const caloriesBurned = Math.max(1, Math.round(ex.caloriesPer30 * (safeMin / 30)));
  return { durationMin: Math.round(safeMin * 10) / 10, caloriesBurned };
}

/** One-call helper using the exercise's own defaults (used for quick-log flows without a customization step). */
export function estimateDefaultSession(ex: Exercise): ExerciseSessionResult {
  const d = getExerciseDefaults(ex);
  if (d.mode === "time") return estimateFromDuration(ex, d.defaultDurationMin || 10);
  return estimateFromReps(ex, d.defaultSets, d.defaultRepsPerSet);
}
