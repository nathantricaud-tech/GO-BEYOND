"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ExerciseAnimation from "./ExerciseAnimation";
import { inferAnimationType } from "@/lib/exercise-animation-type";
import { useLang } from "@/lib/i18n";
import { EXERCISE_FR, translateDifficulty } from "@/lib/exercise-i18n";

interface RankDef {
  key: string;
  name: string;
  emoji: string;
  color: string;
  threshold: number;
}

interface QuestExercise {
  id: string;
  name: string;
  emoji: string;
  difficulty: string;
  defaultSets: number;
  defaultReps: string;
  category: string;
  muscleGroup: string;
  caloriesPer30: number;
}

interface RankData {
  points: number;
  rankIndex: number;
  rank: RankDef;
  nextRank: RankDef | null;
  pointsIntoRank: number;
  pointsForNextRank: number | null;
  progressPct: number;
  streak: number;
  totalActiveDays: number;
  totalFullDays: number;
  questsCompleted: number;
  allRanks: RankDef[];
  todaysQuest: QuestExercise;
  questDoneToday: boolean;
  questBonusPoints: number;
}

interface Photo {
  id: number;
  photoData: string;
  monthKey: string;
  note: string | null;
  createdAt: string;
}

const MONTH_LABELS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function monthLabel(monthKey: string) {
  const [y, m] = monthKey.split("-");
  return `${MONTH_LABELS_FR[parseInt(m) - 1]} ${y}`;
}

/** Animates a number counting up from 0 to `value` over `duration` ms. */
function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

function ConfettiBurst({ color }: { color: string }) {
  const pieces = Array.from({ length: 24 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * 360;
        const distance = 60 + Math.random() * 60;
        const dx = Math.cos((angle * Math.PI) / 180) * distance;
        const dy = Math.sin((angle * Math.PI) / 180) * distance;
        const delay = Math.random() * 0.15;
        const size = 5 + Math.random() * 5;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-sm confetti-piece"
            style={{
              width: size,
              height: size,
              background: i % 3 === 0 ? color : i % 3 === 1 ? "#f2b705" : "#ffffff",
              // @ts-expect-error CSS custom properties for keyframe target position
              "--dx": `${dx}px`,
              "--dy": `${dy}px`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function RankSection({ profileId }: { profileId: number }) {
  const { lang } = useLang();
  const [data, setData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [completingQuest, setCompletingQuest] = useState(false);
  const animatedPoints = useCountUp(data?.points ?? 0, 1100);

  const fetchRank = useCallback(() => {
    return fetch(`/api/rank?profileId=${profileId}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !d || !d.rank) throw new Error(d?.error || "invalid rank payload");
        return d;
      })
      .then((d) => {
        setData(d);
        setLoadError(false);
        const storageKey = `gb_last_rank_${profileId}`;
        const lastSeen = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
        if (lastSeen !== null && parseInt(lastSeen) < d.rankIndex) {
          setCelebrate(true);
          setTimeout(() => setCelebrate(false), 2600);
        }
        if (typeof window !== "undefined") localStorage.setItem(storageKey, String(d.rankIndex));
        return d as RankData;
      });
  }, [profileId]);

  useEffect(() => {
    fetchRank().catch(() => setLoadError(true)).finally(() => setLoading(false));
  }, [fetchRank]);

  async function completeQuest() {
    if (!data || data.questDoneToday) return;
    setCompletingQuest(true);
    try {
      const q = data.todaysQuest;
      await fetch("/api/workout-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          exerciseName: q.name,
          category: q.category,
          duration: 15,
          caloriesBurned: Math.round(q.caloriesPer30 / 2),
          sets: q.defaultSets,
          reps: q.defaultReps,
          logDate: new Date().toISOString().slice(0, 10),
        }),
      });
      await fetchRank();
    } finally {
      setCompletingQuest(false);
    }
  }

  const shareBadge = useCallback(async () => {
    if (!data) return;
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 800, 800);
    bg.addColorStop(0, "#0d1210");
    bg.addColorStop(1, "#111815");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 800, 800);

    // Glow behind badge
    const glow = ctx.createRadialGradient(400, 300, 40, 400, 300, 260);
    glow.addColorStop(0, data.rank.color + "55");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 800, 800);

    // Badge circle
    ctx.beginPath();
    ctx.arc(400, 300, 140, 0, Math.PI * 2);
    ctx.fillStyle = data.rank.color + "22";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = data.rank.color;
    ctx.stroke();

    ctx.font = "120px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data.rank.emoji, 400, 300);

    ctx.fillStyle = data.rank.color;
    ctx.font = "bold 56px sans-serif";
    ctx.fillText(data.rank.name.toUpperCase(), 400, 500);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "28px sans-serif";
    ctx.fillText(`${data.points} points • ${data.streak} jours de série`, 400, 555);

    ctx.fillStyle = "#4b5850";
    ctx.font = "24px sans-serif";
    ctx.fillText("GO BEYOND", 400, 660);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "go-beyond-rank.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Mon rang GO BEYOND", text: `Je viens d'atteindre le rang ${data.rank.name} sur GO BEYOND !` });
          return;
        } catch {
          // fall through to download
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "go-beyond-rank.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-40 rounded-3xl" />
        <div className="skeleton h-24 rounded-2xl" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="glass-strong rounded-3xl p-8 text-center space-y-3">
        <p className="text-3xl">⚠️</p>
        <p className="text-sm text-gray-400">{lang === "fr" ? "Impossible de charger ton rang pour le moment." : "Couldn’t load your rank right now."}</p>
        <button
          onClick={() => { setLoading(true); setLoadError(false); fetchRank().catch(() => setLoadError(true)).finally(() => setLoading(false)); }}
          className="px-5 py-2.5 rounded-xl bg-white/10 text-sm text-gray-200 active:scale-95 transition-transform"
        >
          {lang === "fr" ? "Réessayer" : "Retry"}
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-5">
      {celebrate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="relative">
            <ConfettiBurst color={data.rank.color} />
            <div className="glass-strong rounded-3xl px-8 py-6 text-center animate-scale-in">
              <p className="text-4xl mb-1">{data.rank.emoji}</p>
              <p className="text-lg font-bold" style={{ color: data.rank.color }}>Nouveau rang : {data.rank.name} !</p>
            </div>
          </div>
        </div>
      )}

      {/* Current rank badge, big and central */}
      <div className="animate-fade-in glass-strong rounded-3xl p-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 rank-bg-shift"
          style={{ background: `radial-gradient(circle at 50% 0%, ${data.rank.color}, transparent 70%)` }}
        />
        <div className="relative">
          <div
            className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center text-7xl mb-4 rank-badge-float"
            style={{ background: `${data.rank.color}22`, border: `1px solid ${data.rank.color}55`, boxShadow: `0 0 40px ${data.rank.color}44` }}
          >
            {data.rank.emoji}
          </div>
          <p className="text-3xl font-extrabold tracking-wide" style={{ color: data.rank.color }}>{data.rank.name}</p>
          <p className="text-gray-400 text-sm mt-1">{animatedPoints} points d&apos;assiduité</p>

          {data.nextRank ? (
            <div className="mt-5">
              <div className="flex justify-between items-baseline text-xs text-gray-500 mb-1.5">
                <span>{lang === "fr" ? "Vers" : "To"} {data.nextRank.name} {data.nextRank.emoji}</span>
                <span className="text-base font-bold" style={{ color: data.rank.color }}>{data.progressPct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full progress-fill progress-shimmer"
                  style={{ width: `${data.progressPct}%`, background: `linear-gradient(90deg, ${data.rank.color}, ${data.nextRank.color})` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">{data.pointsIntoRank} / {data.pointsForNextRank} pts vers le rang suivant</p>
            </div>
          ) : (
            <p className="mt-4 text-sm font-medium" style={{ color: data.rank.color }}>
              {lang === "fr" ? "💥 Rang maximum atteint — tu es allé Plus Ultra." : "💥 Max rank reached — you went Plus Ultra."}
            </p>
          )}

          <button
            onClick={shareBadge}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 active:scale-95 transition-transform"
          >
            {lang === "fr" ? "📤 Partager mon badge" : "📤 Share my badge"}
          </button>
        </div>
      </div>

      {/* How points work */}
      <div className="glass rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2"><span>❓</span> {lang === "fr" ? "Comment gagner des points ?" : "How do I earn points?"}</h3>
        <ul className="space-y-1.5 text-xs text-gray-400">
          <li>• <span className="text-white font-medium">+10 pts</span> — {lang === "fr" ? <>jour "complet" : au moins un repas <em>et</em> une séance loggés le même jour</> : <>"full" day: at least one meal <em>and</em> one workout logged the same day</>}</li>
          <li>• <span className="text-white font-medium">+4 pts</span> — {lang === "fr" ? "jour \"partiel\" : seulement un repas OU une séance ce jour-là" : "\"partial\" day: only a meal OR a workout that day"}</li>
          <li>• <span className="text-white font-medium">+{data.questBonusPoints} pts</span> — {lang === "fr" ? "bonus si tu complètes la quête du jour ci-dessous" : "bonus if you complete the daily quest below"}</li>
        </ul>
        <p className="text-[11px] text-gray-500 mt-2">{lang === "fr" ? "Les points sont cumulés à vie, rien n\u2019est jamais perdu. Monter de rang devient progressivement plus long : quelques jours pour les premiers rangs, plusieurs mois d\u2019assiduité pour atteindre HERO — et PLUS ULTRA, à 9000 points, est un objectif de très long terme réservé aux plus réguliers." : "Points are cumulative for life, nothing is ever lost. Ranking up gets progressively longer: a few days for the first ranks, several months of consistency to reach HERO — and PLUS ULTRA, at 9000 points, is a very long-term goal reserved for the most consistent."}</p>
      </div>

      {/* Daily Quest */}
      {data.todaysQuest && (
      <div className="glass-strong rounded-3xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <span>⚔️</span> {lang === "fr" ? "Quête du jour" : "Daily Quest"}
          </h3>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 font-medium">
            +{data.questBonusPoints} pts
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ExerciseAnimation
            emoji={data.todaysQuest.emoji}
            category={data.todaysQuest.category}
            animationType={inferAnimationType({ name: data.todaysQuest.name, category: data.todaysQuest.category } as any)}
            size={72}
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold">{lang === "fr" ? (EXERCISE_FR[data.todaysQuest.id]?.name || data.todaysQuest.name) : data.todaysQuest.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {data.todaysQuest.defaultSets}×{data.todaysQuest.defaultReps} · {translateDifficulty(data.todaysQuest.difficulty, lang)}
            </p>
          </div>
        </div>
        <button
          onClick={completeQuest}
          disabled={data.questDoneToday || completingQuest}
          className={`w-full mt-4 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] ${
            data.questDoneToday
              ? "bg-primary-500/15 text-primary-400 border border-primary-500/30"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
          }`}
        >
          {data.questDoneToday ? (lang === "fr" ? "✓ Quête accomplie aujourd'hui" : "✓ Quest done today") : completingQuest ? "..." : (lang === "fr" ? "Marquer comme fait" : "Mark as done")}
        </button>
      </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-3.5 text-center">
          <p className="text-xl font-bold text-white">{data.streak}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{lang === "fr" ? "Série actuelle" : "Current streak"}</p>
        </div>
        <div className="glass rounded-2xl p-3.5 text-center">
          <p className="text-xl font-bold text-white">{data.totalFullDays}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{lang === "fr" ? "Jours complets" : "Full days"}</p>
        </div>
        <div className="glass rounded-2xl p-3.5 text-center">
          <p className="text-xl font-bold text-white">{data.totalActiveDays}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{lang === "fr" ? "Jours actifs" : "Active days"}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center px-4">
        Un jour "complet" = au moins un repas <em>et</em> une séance loggés le même jour. Un jour "actif" compte l'un des deux.
      </p>

      {/* All ranks ladder */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{lang === "fr" ? "Échelle des rangs" : "Rank ladder"}</h3>
        <div className="space-y-2">
          {data.allRanks.map((r, i) => {
            const unlocked = i <= data.rankIndex;
            const current = i === data.rankIndex;
            return (
              <div
                key={r.key}
                className={`flex items-center gap-3 rounded-2xl p-3 transition-all duration-500 ${
                  current ? "glass-strong card-border-glow scale-[1.02]" : unlocked ? "glass" : "bg-white/[0.02] border border-white/5"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${!unlocked ? "grayscale opacity-40" : ""} ${current ? "rank-badge-float" : ""}`}
                  style={{ background: unlocked ? `${r.color}22` : "rgba(255,255,255,0.03)" }}
                >
                  {r.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${unlocked ? "text-white" : "text-gray-600"}`}>{r.name}</p>
                  <p className="text-[11px] text-gray-500">{r.threshold} pts requis</p>
                </div>
                {current && <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: `${r.color}22`, color: r.color }}>{lang === "fr" ? "ACTUEL" : "CURRENT"}</span>}
                {unlocked && !current && <span className="text-primary-400 text-sm">✓</span>}
                {!unlocked && <span className="text-gray-600 text-sm">🔒</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function GallerySection({ profileId }: { profileId: number }) {
  const { lang } = useLang();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [viewerPhoto, setViewerPhoto] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const alreadyThisMonth = photos.some((p) => p.monthKey === currentMonthKey);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/gallery?profileId=${profileId}`);
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 900;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const scale = maxDim / Math.max(width, height);
            width *= scale;
            height *= scale;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("no canvas context"));
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const resized = await resizeImage(file);
    setPreview(resized);
  }

  async function confirmUpload() {
    if (!preview) return;
    setUploading(true);
    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, photoData: preview }),
      });
      setPreview(null);
      await fetchPhotos();
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <div className="skeleton h-64 rounded-3xl" />;

  return (
    <div className="space-y-5">
      <div className="glass-strong rounded-3xl p-6 text-center">
        <span className="text-3xl block mb-2">📸</span>
        <h3 className="text-white font-semibold mb-1">{lang === "fr" ? "Photo du mois" : "Photo of the month"}</h3>
        <p className="text-gray-400 text-sm mb-4">
          {alreadyThisMonth
            ? "Tu as déjà ajouté ta photo pour ce mois-ci — reviens le mois prochain !"
            : "Débloque ta photo de progression de ce mois pour l'ajouter à ta galerie."}
        </p>
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium active:scale-95 transition-transform"
        >
          {alreadyThisMonth ? "Remplacer la photo de ce mois" : "Prendre / choisir une photo"}
        </button>
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="glass-strong rounded-3xl p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Aperçu" className="w-full rounded-2xl mb-4 max-h-80 object-cover" />
            <div className="flex gap-3">
              <button onClick={() => setPreview(null)} className="flex-1 py-3 rounded-xl glass text-gray-300">{lang === "fr" ? "Annuler" : "Cancel"}</button>
              <button
                onClick={confirmUpload}
                disabled={uploading}
                className="flex-1 py-3 rounded-xl bg-primary-500 text-white font-medium disabled:opacity-60"
              >
                {uploading ? "..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewerPhoto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setViewerPhoto(null)}>
          <div className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <p className="text-white font-medium">{monthLabel(viewerPhoto.monthKey)}</p>
              <button onClick={() => setViewerPhoto(null)} className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center">✕</button>
            </div>
            <img src={viewerPhoto.photoData} alt={monthLabel(viewerPhoto.monthKey)} className="w-full rounded-2xl" />
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Historique ({photos.length})</h3>
        {photos.length === 0 ? (
          <div className="text-center py-10 glass rounded-2xl">
            <span className="text-3xl block mb-2">🗂️</span>
            <p className="text-gray-500 text-sm">Aucune photo pour l'instant</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((p) => (
              <button
                key={p.id}
                onClick={() => setViewerPhoto(p)}
                className="relative aspect-square rounded-2xl overflow-hidden group card-hover"
              >
                <img src={p.photoData} alt={monthLabel(p.monthKey)} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[11px] text-white font-medium">{monthLabel(p.monthKey)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
