"use client";

interface ExerciseAnimationProps {
  emoji: string;
  category: string;
  animationType?: string;
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

const categoryStroke: Record<string, string> = {
  strength: "#fb923c",
  calisthenics: "#38bdf8",
  cardio: "#f87171",
  hiit: "#fbbf24",
  flexibility: "#a78bfa",
};

/**
 * A minimal animated stick-figure that actually performs the movement in a
 * loop, so the user can see *how* to do the exercise rather than just an
 * emoji. Deliberately simple (no external assets, no video) so it stays
 * lightweight and instant on mobile.
 */
export default function ExerciseAnimation({ emoji, category, animationType = "squat", size = 56 }: ExerciseAnimationProps) {
  const gradient = categoryGradients[category] || "from-gray-500/20 to-gray-600/10";
  const border = categoryBorder[category] || "border-gray-500/20";
  const stroke = categoryStroke[category] || "#9ca3af";
  const isBig = size >= 90;

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${gradient} border ${border} flex items-center justify-center flex-shrink-0 overflow-hidden`}
      style={{ width: size, height: size }}
    >
      {isBig ? (
        <StickFigure type={animationType} color={stroke} />
      ) : (
        <span style={{ fontSize: size * 0.45 }}>{emoji}</span>
      )}
      {isBig && <span className="absolute bottom-1.5 right-1.5 text-base opacity-70">{emoji}</span>}
    </div>
  );
}

function StickFigure({ type, color }: { type: string; color: string }) {
  const cls = `figure-${type}`;
  return (
    <svg viewBox="0 0 100 100" width="72%" height="72%" className={cls}>
      <g stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
        <circle className="fig-head" cx="50" cy="20" r="8" fill={color} stroke="none" />
        <line className="fig-spine" x1="50" y1="28" x2="50" y2="55" />
        <line className="fig-armL" x1="50" y1="35" x2="32" y2="45" />
        <line className="fig-armR" x1="50" y1="35" x2="68" y2="45" />
        <line className="fig-legL" x1="50" y1="55" x2="35" y2="80" />
        <line className="fig-legR" x1="50" y1="55" x2="65" y2="80" />
      </g>
    </svg>
  );
}
