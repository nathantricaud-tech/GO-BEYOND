export interface AvatarDef {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  primary: string; // hex, replaces --color-primary-500
  primaryDark: string; // replaces --color-primary-700
  accent: string; // hex, replaces --color-accent-300
}

/**
 * Original archetypes inspired by general "hero" aesthetics (speed,
 * strength, stealth, etc.) — deliberately not tied to any existing
 * copyrighted character, so everyone gets their own distinct badge and a
 * matching subtle app re-skin (accent colors shift, nothing drastic).
 */
export const AVATARS: AvatarDef[] = [
  { id: "eclair", name: "Éclair", emoji: "⚡", desc: "Vitesse et explosivité", primary: "#eab308", primaryDark: "#a16207", accent: "#38bdf8" },
  { id: "titan", name: "Titan", emoji: "🗿", desc: "Force brute", primary: "#ef4444", primaryDark: "#991b1b", accent: "#f97316" },
  { id: "ombre", name: "Ombre", emoji: "🌑", desc: "Discipline et discrétion", primary: "#8b5cf6", primaryDark: "#5b21b6", accent: "#6366f1" },
  { id: "aube", name: "Aube", emoji: "🌸", desc: "Équilibre et régularité", primary: "#f472b6", primaryDark: "#be185d", accent: "#fbbf24" },
  { id: "sismique", name: "Sismique", emoji: "🌋", desc: "Puissance et intensité", primary: "#f97316", primaryDark: "#9a3412", accent: "#dc2626" },
  { id: "glacial", name: "Glacial", emoji: "❄️", desc: "Endurance et sang-froid", primary: "#38bdf8", primaryDark: "#0369a1", accent: "#a5f3fc" },
  { id: "flamme", name: "Flamme", emoji: "🔥", desc: "Intensité et énergie", primary: "#f43f5e", primaryDark: "#9f1239", accent: "#fb923c" },
  { id: "sylve", name: "Sylve", emoji: "🌿", desc: "Nature et constance", primary: "#22c55e", primaryDark: "#166534", accent: "#84cc16" },
];

export function getAvatar(id: string | null | undefined): AvatarDef {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}
