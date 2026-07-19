"use client";

interface ExerciseAnimationProps {
  emoji: string;
  category: string;
  size?: number;
}

const categoryGradients: Record<string, string> = {
  strength: "from-orange-500/20 to-red-500/10",
  calisthenics: "from-blue-500/20 to-cyan-500/10",
  cardio: "from-red-500/20 to-pink-500/10",
  hiit: "from-amber-500/20 to-orange-500/10",
  flexibility: "from-purple-500/20 to-indigo-500/10",
};

const categoryBorder: Record<string, string> = {
  strength: "border-orange-500/20",
  calisthenics: "border-blue-500/20",
  cardio: "border-red-500/20",
  hiit: "border-amber-500/20",
  flexibility: "border-purple-500/20",
};

export default function ExerciseAnimation({ emoji, category, size = 56 }: ExerciseAnimationProps) {
  const gradient = categoryGradients[category] || "from-gray-500/20 to-gray-600/10";
  const border = categoryBorder[category] || "border-gray-500/20";

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${gradient} border ${border} flex items-center justify-center flex-shrink-0`}
      style={{ width: size, height: size }}
    >
      <span style={{ fontSize: size * 0.45 }}>{emoji}</span>
    </div>
  );
}
