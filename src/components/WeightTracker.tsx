"use client";

import { useState, useEffect, useCallback } from "react";

interface Profile {
  id: number;
  weight: number;
  targetWeight: number | null;
}

interface WeightLog {
  id: number;
  weight: number;
  logDate: string;
  createdAt?: string;
}

export default function WeightTracker({ profile }: { profile: Profile }) {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState(profile.weight);
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`/api/weight-log?profileId=${profile.id}`);
      const data = await res.json();
      // The API returns most-recent-first (useful for other views), but the
      // chart below assumes chronological order (oldest → newest), so sort
      // here rather than changing the API's default ordering. createdAt is
      // used as a tiebreaker for entries logged on the same day so the
      // order stays stable and truly chronological.
      const sorted = [...(data.logs || [])].sort((a: WeightLog, b: WeightLog) => {
        const dateDiff = new Date(a.logDate).getTime() - new Date(b.logDate).getTime();
        if (dateDiff !== 0) return dateDiff;
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      });
      setLogs(sorted);
    } catch (error) {
      console.error("Error fetching weight logs:", error);
    } finally {
      setLoading(false);
    }
  }, [profile.id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addEntry = async () => {
    setAdding(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await fetch("/api/weight-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          weight,
          logDate: today,
        }),
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      await fetchLogs();
    } catch (error) {
      console.error("Error adding weight:", error);
    } finally {
      setAdding(false);
    }
  };

  // Calculate chart data
  const maxWeight = logs.length > 0 ? Math.max(...logs.map((l) => l.weight)) : profile.weight;
  const minWeight = logs.length > 0 ? Math.min(...logs.map((l) => l.weight)) : profile.weight;
  const range = maxWeight - minWeight || 10;
  const chartPadding = range * 0.1;

  const latestWeight = logs.length > 0 ? logs[logs.length - 1].weight : profile.weight;
  const weightChange = logs.length >= 2 ? latestWeight - logs[0].weight : 0;
  const progress = profile.targetWeight
    ? ((profile.weight - latestWeight) / (profile.weight - profile.targetWeight)) * 100
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600/20 via-emerald-600/10 to-green-600/20 p-6 border border-white/10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Suivi du Poids</h2>
              <p className="text-teal-300/80 text-sm">Suis ta progression dans le temps</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass rounded-2xl p-5 text-center card-hover">
          <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center mb-3">
            <span className="text-2xl">⚖️</span>
          </div>
          <span className="text-2xl font-bold text-white">{latestWeight}</span>
          <p className="text-xs text-gray-500 mt-1">Actuel (kg)</p>
        </div>
        {profile.targetWeight && (
          <div className="glass rounded-2xl p-5 text-center card-hover">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary-500/10 flex items-center justify-center mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <span className="text-2xl font-bold text-primary-400">{profile.targetWeight}</span>
            <p className="text-xs text-gray-500 mt-1">Objectif (kg)</p>
          </div>
        )}
        <div className="glass rounded-2xl p-5 text-center card-hover">
          <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${
            weightChange > 0 ? "bg-red-500/10" : weightChange < 0 ? "bg-green-500/10" : "bg-white/5"
          }`}>
            <span className="text-2xl">{weightChange > 0 ? "📈" : weightChange < 0 ? "📉" : "➡️"}</span>
          </div>
          <span className={`text-2xl font-bold ${
            weightChange > 0 ? "text-red-400" : weightChange < 0 ? "text-green-400" : "text-gray-400"
          }`}>
            {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)}
          </span>
          <p className="text-xs text-gray-500 mt-1">Évolution (kg)</p>
        </div>
        {profile.targetWeight && (
          <div className="glass rounded-2xl p-5 text-center card-hover">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
              <span className="text-2xl">🏆</span>
            </div>
            <span className="text-2xl font-bold text-amber-400">
              {Math.max(0, Math.min(100, progress)).toFixed(0)}%
            </span>
            <p className="text-xs text-gray-500 mt-1">Progress</p>
          </div>
        )}
      </div>

      {/* Add Weight Entry */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-primary-500/20 flex items-center justify-center text-xs">+</span>
          Log Today&apos;s Weight
        </h3>
        
        {showSuccess ? (
          <div className="flex items-center justify-center py-6 animate-scale-in">
            <div className="flex items-center gap-3 text-primary-400">
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-semibold">Poids enregistré avec succès !</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button
                onClick={() => setWeight(Math.max(30, weight - 0.1))}
                className="w-12 h-12 flex-shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl font-bold transition-all active:scale-95"
              >
                −
              </button>
              <div className="relative flex-1 min-w-0">
                <input
                  type="number"
                  value={weight === 0 ? "" : weight}
                  onChange={(e) => setWeight(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                  step="0.1"
                  className="w-full min-w-0 pl-3 pr-11 py-4 input-modern rounded-xl text-white text-right text-xl sm:text-2xl font-bold focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-xs bg-white/5 px-1.5 py-0.5 rounded-md">kg</span>
              </div>
              <button
                onClick={() => setWeight(weight + 0.1)}
                className="w-12 h-12 flex-shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl font-bold transition-all active:scale-95"
              >
                +
              </button>
            </div>
            <button
              onClick={addEntry}
              disabled={adding}
              className="btn-primary px-8 py-4 rounded-xl text-white font-semibold disabled:opacity-60 flex-shrink-0"
            >
              {adding ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                "Log"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Weight Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">📈</span>
          Weight History
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-4">
              <span className="text-4xl">📈</span>
            </div>
            <p className="text-gray-300 font-medium">Aucune pesée pour l’instant</p>
            <p className="text-gray-500 text-sm mt-2">Commence à te peser pour voir ton graphique de progression</p>
          </div>
        ) : (
          <div>
            {/* SVG Chart */}
            <div className="relative h-52 mb-6">
              <svg viewBox={`0 0 ${Math.max(logs.length * 50, 280)} 180`} className="w-full h-full" preserveAspectRatio="none">
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#6ee7b7" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 45 + 20}
                    x2={Math.max(logs.length * 50, 280)}
                    y2={i * 45 + 20}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                ))}

                {/* Target weight line */}
                {profile.targetWeight && (
                  <line
                    x1="0"
                    y1={160 - ((profile.targetWeight - minWeight + chartPadding) / (range + 2 * chartPadding)) * 140}
                    x2={Math.max(logs.length * 50, 280)}
                    y2={160 - ((profile.targetWeight - minWeight + chartPadding) / (range + 2 * chartPadding)) * 140}
                    stroke="#10b981"
                    strokeWidth="1"
                    strokeDasharray="8,4"
                    opacity="0.5"
                  />
                )}

                {/* Area fill */}
                {logs.length > 1 && (
                  <path
                    d={`
                      M ${10} ${160 - ((logs[0].weight - minWeight + chartPadding) / (range + 2 * chartPadding)) * 140}
                      ${logs.map((log, i) => {
                        const x = (i / (logs.length - 1)) * (Math.max(logs.length * 50, 280) - 20) + 10;
                        const y = 160 - ((log.weight - minWeight + chartPadding) / (range + 2 * chartPadding)) * 140;
                        return `L ${x} ${y}`;
                      }).join(" ")}
                      L ${Math.max(logs.length * 50, 280) - 10} 160
                      L 10 160
                      Z
                    `}
                    fill="url(#chartGradient)"
                  />
                )}

                {/* Line */}
                {logs.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={logs
                      .map((log, i) => {
                        const x = (i / (logs.length - 1)) * (Math.max(logs.length * 50, 280) - 20) + 10;
                        const y = 160 - ((log.weight - minWeight + chartPadding) / (range + 2 * chartPadding)) * 140;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                    style={{ filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))" }}
                  />
                )}

                {/* Data points */}
                {logs.map((log, i) => {
                  const x = logs.length === 1 
                    ? Math.max(logs.length * 50, 280) / 2 
                    : (i / (logs.length - 1)) * (Math.max(logs.length * 50, 280) - 20) + 10;
                  const y = 160 - ((log.weight - minWeight + chartPadding) / (range + 2 * chartPadding)) * 140;
                  return (
                    <g key={log.id}>
                      {/* Glow */}
                      <circle cx={x} cy={y} r="8" fill="#10b981" opacity="0.2" />
                      {/* Point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#10b981"
                        stroke="#0a0a0f"
                        strokeWidth="2"
                        style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))" }}
                      />
                      {/* Label */}
                      <text x={x} y={y - 14} textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="500">
                        {log.weight}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Log entries */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...logs].reverse().slice(0, 10).map((log, i) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <span className="text-sm text-gray-400">{log.logDate}</span>
                  <span className="text-sm font-semibold text-white">{log.weight} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
