import type { WorkoutProgram } from "./exercises-db";
import type { Lang } from "./i18n";

export const DAY_FR: Record<string, string> = {
  Monday: "Lundi", Tuesday: "Mardi", Wednesday: "Mercredi", Thursday: "Jeudi",
  Friday: "Vendredi", Saturday: "Samedi", Sunday: "Dimanche",
  Mon: "Lun", Tue: "Mar", Wed: "Mer", Thu: "Jeu", Fri: "Ven", Sat: "Sam", Sun: "Dim",
};

interface ProgramTranslation {
  name: string;
  description: string;
  duration: string;
  days: Record<string, string>; // original day.name -> French
}

export const PROGRAM_FR: Record<string, ProgramTranslation> = {
  p1: {
    name: "Corps Entier Débutant",
    description: "Le programme idéal pour démarrer. 3 séances par semaine, corps entier à chaque séance. Construis une base de force solide.",
    duration: "8 semaines",
    days: { "Full Body A": "Corps Entier A", "Full Body B": "Corps Entier B", "Full Body C": "Corps Entier C" },
  },
  p2: {
    name: "Poussée / Tirage / Jambes",
    description: "Le split classique de musculation. Chaque séance cible un schéma de mouvement pour une croissance musculaire optimale.",
    duration: "12 semaines",
    days: {
      "Push (Chest, Shoulders, Triceps)": "Poussée (Pectoraux, Épaules, Triceps)",
      "Pull (Back, Biceps)": "Tirage (Dos, Biceps)",
      "Legs": "Jambes",
      "Push B": "Poussée B",
      "Pull B": "Tirage B",
      "Legs B": "Jambes B",
    },
  },
  p3: {
    name: "HIIT Brûle-Graisses",
    description: "Intervalles à haute intensité pour maximiser la dépense calorique. Séances courtes, résultats maximaux.",
    duration: "6 semaines",
    days: {
      "HIIT Circuit A": "Circuit HIIT A",
      "Cardio + Core": "Cardio + Abdos",
      "HIIT Circuit B": "Circuit HIIT B",
      "Active Recovery": "Récupération Active",
    },
  },
  p4: {
    name: "Entraînement Maison (Sans Matériel)",
    description: "Programme complet utilisant uniquement ton poids du corps. Pas besoin de salle. Parfait à la maison ou en voyage.",
    duration: "8 semaines",
    days: {
      "Upper Body": "Haut du Corps",
      "Lower Body": "Bas du Corps",
      "Core + Cardio": "Abdos + Cardio",
      "Full Body Circuit": "Circuit Corps Entier",
    },
  },
  p5: {
    name: "Force & Masse",
    description: "Mouvements polyarticulaires lourds pour un maximum de force et de masse musculaire. Méthode 5x5.",
    duration: "12 semaines",
    days: {
      "Heavy Upper": "Haut du Corps Lourd",
      "Heavy Lower": "Bas du Corps Lourd",
      "Volume Upper": "Haut du Corps Volume",
      "Volume Lower": "Bas du Corps Volume",
    },
  },
};

export function translateProgram(prog: WorkoutProgram, lang: Lang): WorkoutProgram {
  if (lang !== "fr") return prog;
  const tr = PROGRAM_FR[prog.id];
  if (!tr) return prog;
  return {
    ...prog,
    name: tr.name,
    description: tr.description,
    duration: tr.duration,
    schedule: prog.schedule.map((d) => ({
      ...d,
      day: DAY_FR[d.day] || d.day,
      name: tr.days[d.name] || d.name,
    })),
  };
}
