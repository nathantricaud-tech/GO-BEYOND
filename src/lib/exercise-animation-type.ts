import type { Exercise } from "./exercises-db";

/**
 * Maps an exercise to one of the 15 stick-figure animation types based on
 * keywords in its name, falling back to a sensible default per category.
 * This avoids having to manually tag every single exercise in the database.
 */
export function inferAnimationType(exercise: Exercise): string {
  const name = exercise.name.toLowerCase();

  const KEYWORD_MAP: [string[], string][] = [
    [["squat"], "squat"],
    [["push-up", "push up", "pushup", "pompe"], "pushup"],
    [["plank", "planche"], "plank"],
    [["lunge", "fente"], "lunge"],
    [["crunch", "sit-up", "sit up", "abdo", "twist", "leg raise", "dead bug"], "crunch"],
    [["jumping jack", "jump rope", "corde à sauter", "jump squat", "high knee", "box jump", "battle rope"], "jumping"],
    [["run", "sprint", "jog", "course", "stair", "walking", "marche"], "running"],
    [["cycl", "bike", "vélo", "swimming", "natation"], "cycling"],
    [["yoga", "stretch", "étirement", "downward dog", "foam roll"], "yoga"],
    [["pull-up", "pull up", "chin-up", "traction"], "pullup"],
    [["deadlift", "soulevé de terre", "hinge"], "deadlift"],
    [["burpee"], "burpee"],
    [["curl"], "curl"],
    [["row", "pulldown", "rameur"], "row"],
    [["press", "presse", "flye", "flyes", "écarté"], "press"],
  ];

  for (const [keywords, type] of KEYWORD_MAP) {
    if (keywords.some((k) => name.includes(k))) return type;
  }

  // Fallback by category when no keyword matched.
  switch (exercise.category) {
    case "cardio":
      return "running";
    case "hiit":
      return "jumping";
    case "flexibility":
      return "yoga";
    case "calisthenics":
      return "pushup";
    case "strength":
      return "press";
    default:
      return "squat";
  }
}
