"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useReveal } from "@/lib/useReveal";

interface RankDef {
  key: string;
  name: string;
  emoji: string;
  color: string;
  threshold: number;
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
  allRanks: RankDef[];
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

export function RankSection({ profileId }: { profileId: number }) {
  const [data, setData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(true);
  const revealRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    fetch(`/api/rank?profileId=${profileId}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-40 rounded-3xl" />
        <div className="skeleton h-24 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-5">
      {/* Current rank badge, big and central */}
      <div ref={revealRef} className="reveal glass-strong rounded-3xl p-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{ background: `radial-gradient(circle at 50% 0%, ${data.rank.color}, transparent 70%)` }}
        />
        <div className="relative">
          <div
            className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl mb-3 animate-pulse-slow"
            style={{ background: `${data.rank.color}22`, border: `1px solid ${data.rank.color}55` }}
          >
            {data.rank.emoji}
          </div>
          <p className="text-2xl font-bold" style={{ color: data.rank.color }}>{data.rank.name}</p>
          <p className="text-gray-400 text-sm mt-1">{data.points} points d'assiduité</p>

          {data.nextRank ? (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Vers {data.nextRank.name} {data.nextRank.emoji}</span>
                <span>{data.pointsIntoRank} / {data.pointsForNextRank} pts</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full progress-fill"
                  style={{ width: `${data.progressPct}%`, background: `linear-gradient(90deg, ${data.rank.color}, ${data.nextRank.color})` }}
                />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm font-medium" style={{ color: data.rank.color }}>
              🏆 Rang maximum atteint — tu es un vrai HERO.
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-3.5 text-center">
          <p className="text-xl font-bold text-white">{data.streak}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Série actuelle</p>
        </div>
        <div className="glass rounded-2xl p-3.5 text-center">
          <p className="text-xl font-bold text-white">{data.totalFullDays}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Jours complets</p>
        </div>
        <div className="glass rounded-2xl p-3.5 text-center">
          <p className="text-xl font-bold text-white">{data.totalActiveDays}</p>
          <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Jours actifs</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center px-4">
        Un jour "complet" = au moins un repas <em>et</em> une séance loggés le même jour. Un jour "actif" compte l'un des deux.
      </p>

      {/* All ranks ladder */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Échelle des rangs</h3>
        <div className="space-y-2">
          {data.allRanks.map((r, i) => {
            const unlocked = i <= data.rankIndex;
            const current = i === data.rankIndex;
            return (
              <div
                key={r.key}
                className={`flex items-center gap-3 rounded-2xl p-3 transition-all ${
                  current ? "glass-strong card-border-glow" : unlocked ? "glass" : "bg-white/[0.02] border border-white/5"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${!unlocked ? "grayscale opacity-40" : ""}`}
                  style={{ background: unlocked ? `${r.color}22` : "rgba(255,255,255,0.03)" }}
                >
                  {r.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${unlocked ? "text-white" : "text-gray-600"}`}>{r.name}</p>
                  <p className="text-[11px] text-gray-500">{r.threshold} pts requis</p>
                </div>
                {current && <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: `${r.color}22`, color: r.color }}>ACTUEL</span>}
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
        <h3 className="text-white font-semibold mb-1">Photo du mois</h3>
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
              <button onClick={() => setPreview(null)} className="flex-1 py-3 rounded-xl glass text-gray-300">Annuler</button>
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
