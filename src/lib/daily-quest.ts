import { exercises, type Exercise } from "./exercises-db";

/** Simple deterministic hash so the same profile+date always picks the same quest. */
function seededIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

const HOME_EQUIPMENT = new Set(["None", "Wall", "Yoga Mat", "None or Bench", "None or Step", "None or Weight"]);

const HARD_POOL = exercises.filter(
  (e) => (e.difficulty === "advanced" || e.difficulty === "intermediate") && HOME_EQUIPMENT.has(e.equipment)
);
const FALLBACK_POOL = exercises.filter((e) => HOME_EQUIPMENT.has(e.equipment));

/**
 * Returns today's quest exercise for this profile — a randomly (but
 * deterministically) picked challenging exercise that stays the same all
 * day, and changes the next day. Bonus rank points are awarded for
 * completing it (see QUEST_BONUS_POINTS in ranks.ts).
 */
export function getDailyQuest(profileId: number, dateStr: string): Exercise {
  const pool = HARD_POOL.length > 0 ? HARD_POOL : FALLBACK_POOL.length > 0 ? FALLBACK_POOL : exercises;
  const idx = seededIndex(`${profileId}-${dateStr}`, pool.length);
  return pool[idx];
}
