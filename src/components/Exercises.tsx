"use client";

import { useState, useEffect, useCallback } from "react";
import { exercises, workoutPrograms, type Exercise, type WorkoutProgram } from "@/lib/exercises-db";
import { inferAnimationType } from "@/lib/exercise-animation-type";
import ExerciseAnimation from "./ExerciseAnimation";

interface Props { userGoal: string; profileId: number }

export default function Exercises({ userGoal, profileId }: Props) {
  const [tab, setTab] = useState<"exercises" | "programs">("programs");
  const [filter, setFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState<"all" | "home" | "gym">("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "15" | "30" | "45" | "60">("all");
  const [muscleFilter, setMuscleFilter] = useState("all");
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
  const [selectedProg, setSelectedProg] = useState<WorkoutProgram | null>(null);
  const [loggedToday, setLoggedToday] = useState<string[]>([]);

  const today = new Date().toISOString().split("T")[0];

  const fetchLogs = useCallback(async () => {
    try {
      const r = await fetch(`/api/workout-log?profileId=${profileId}&date=${today}`);
      const d = await r.json();
      setLoggedToday((d.logs || []).map((l: { exerciseName: string }) => l.exerciseName));
    } catch {}
  }, [profileId, today]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const logExercise = async (ex: Exercise) => {
    await fetch("/api/workout-log", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId, exerciseName: ex.name, category: ex.category,
        duration: 10, caloriesBurned: Math.round(ex.caloriesPer30 / 3),
        sets: ex.defaultSets, reps: ex.defaultReps, logDate: today,
      }),
    });
    setLoggedToday([...loggedToday, ex.name]);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const filtered = exercises.filter(e => {
    if (filter !== "all" && e.category !== filter) return false;
    if (muscleFilter !== "all" && e.muscleGroup !== muscleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !e.muscleGroup.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const muscleGroups = [...new Set(exercises.map(e => e.muscleGroup))];
  const recPrograms = workoutPrograms.filter(p => p.goal === userGoal || userGoal === "maintain");
  const diffColors: Record<string, string> = { beginner: "text-green-400", intermediate: "text-yellow-400", advanced: "text-red-400" };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-rose-600/20 p-6 border border-white/10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"><span className="text-2xl">🏋️</span></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Training</h2>
            <p className="text-purple-300/80 text-sm">{exercises.length} exercises · {workoutPrograms.length} programs</p>
          </div>
        </div>
      </div>

      {/* Tab Switch */}
      <div className="flex p-1 bg-white/5 rounded-2xl">
        {(["programs", "exercises"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25" : "text-gray-400"}`}>{t === "programs" ? "📋 Programs" : "💪 Exercises"}</button>
        ))}
      </div>

      {/* ════ PROGRAMS TAB ════ */}
      {tab === "programs" && (
        <div className="space-y-4">
          {/* Recommended */}
          {!selectedProg && recPrograms.length > 0 && (
            <div className="glass rounded-2xl p-4 border border-primary-500/20">
              <p className="text-sm font-semibold text-primary-400 mb-3">✨ Recommended for you</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recPrograms.map(p => (
                  <button key={p.id} onClick={() => setSelectedProg(p)} className="flex-shrink-0 w-52 glass rounded-xl p-4 text-left hover:bg-white/5 transition-all">
                    <span className="text-3xl mb-2 block">{p.emoji}</span>
                    <h4 className="text-white font-semibold text-sm">{p.name}</h4>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs text-gray-500">{p.daysPerWeek}x/week</span>
                      <span className={`text-xs ${diffColors[p.difficulty]}`}>{p.difficulty}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Program Detail */}
          {selectedProg ? (
            <div className="glass rounded-2xl p-5 animate-scale-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedProg.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedProg.name}</h3>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>{selectedProg.daysPerWeek}x/week</span>
                      <span>{selectedProg.duration}</span>
                      <span className={diffColors[selectedProg.difficulty]}>{selectedProg.difficulty}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProg(null)} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400">✕</button>
              </div>
              <p className="text-gray-400 text-sm mb-5">{selectedProg.description}</p>

              {selectedProg.schedule.map((day, di) => (
                <div key={di} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-400">{day.day.slice(0, 2)}</span>
                    <span className="text-sm font-semibold text-white">{day.name}</span>
                  </div>
                  <div className="ml-10 space-y-1.5">
                    {day.exercises.map((we, ei) => {
                      const ex = exercises.find(e => e.id === we.exerciseId);
                      if (!ex) return null;
                      const done = loggedToday.includes(ex.name);
                      return (
                        <button
                          key={ei}
                          onClick={() => setSelectedEx(ex)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left active:scale-[0.98] ${done ? "bg-primary-500/10 border border-primary-500/20" : "bg-white/5 hover:bg-white/10"}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{ex.emoji}</span>
                            <div>
                              <span className={`text-sm ${done ? "text-primary-400" : "text-gray-300"}`}>{ex.name}</span>
                              <span className="text-xs text-gray-500 ml-2">{we.sets}×{we.reps} · rest {we.rest}</span>
                            </div>
                          </div>
                          <span
                            role="button"
                            onClick={(e) => { e.stopPropagation(); if (!done) logExercise(ex); }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${done ? "bg-primary-500/20 text-primary-400" : "bg-white/10 text-gray-400 hover:bg-primary-500/20 hover:text-primary-400"}`}
                          >
                            {done ? "✓ Done" : "Log"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* All Programs */
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">All Programs</h3>
                  <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                    {(["all", "home", "gym"] as const).map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setLocationFilter(loc)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          locationFilter === loc
                            ? "bg-primary-500/20 text-primary-400"
                            : "text-gray-500"
                        }`}
                      >
                        {loc === "all" ? "Tout" : loc === "home" ? "🏠 Maison" : "🏋️ Salle"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {([
                    { v: "all", l: "⏱️ Peu importe" },
                    { v: "15", l: "≤ 15 min" },
                    { v: "30", l: "≤ 30 min" },
                    { v: "45", l: "≤ 45 min" },
                    { v: "60", l: "45 min +" },
                  ] as const).map((t) => (
                    <button
                      key={t.v}
                      onClick={() => setTimeFilter(t.v)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        timeFilter === t.v ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {t.l}
                    </button>
                  ))}
                </div>
              </div>
              {workoutPrograms
                .filter((p) =>
                  locationFilter === "all"
                    ? true
                    : locationFilter === "home"
                    ? p.location === "home"
                    : p.location !== "home"
                )
                .filter((p) => {
                  const mins = p.sessionMinutes ?? 30;
                  if (timeFilter === "all") return true;
                  if (timeFilter === "15") return mins <= 15;
                  if (timeFilter === "30") return mins <= 30;
                  if (timeFilter === "45") return mins <= 45;
                  return mins > 45; // "60" bucket = 45min+
                })
                .map(p => (
                <button key={p.id} onClick={() => setSelectedProg(p)} className="w-full glass rounded-xl p-4 text-left hover:bg-white/5 transition-all group card-hover">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{p.emoji}</span>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold group-hover:text-primary-400 transition-colors">{p.name}</h4>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{p.description}</p>
                      <div className="flex gap-3 mt-2 text-xs flex-wrap">
                        <span className="text-gray-400">{p.daysPerWeek}x/semaine</span>
                        {p.sessionMinutes && <span className="text-primary-400">⏱️ ~{p.sessionMinutes}min</span>}
                        <span className={diffColors[p.difficulty]}>{p.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════ EXERCISES TAB ════ */}
      {tab === "exercises" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un exercice, un muscle..."
              className="w-full pl-11 pr-10 py-3 input-modern rounded-2xl text-white placeholder-gray-500 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6 flex items-center justify-center">✕</button>
            )}
          </div>
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[{ v: "all", l: "All" }, { v: "strength", l: "💪 Strength" }, { v: "calisthenics", l: "🤸 Bodyweight" }, { v: "cardio", l: "❤️ Cardio" }, { v: "hiit", l: "🔥 HIIT" }, { v: "flexibility", l: "🧘 Flexibility" }].map(f => (
              <button key={f.v} onClick={() => setFilter(f.v)} className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${filter === f.v ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "glass text-gray-400"}`}>{f.l}</button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[{ v: "all", l: "All Muscles" }, ...muscleGroups.map(m => ({ v: m, l: m }))].map(f => (
              <button key={f.v} onClick={() => setMuscleFilter(f.v)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all ${muscleFilter === f.v ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>{f.l}</button>
            ))}
          </div>

          {/* Exercise Modal */}
          {selectedEx && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedEx(null)}>
              <div className="glass-strong rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in relative" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 z-20 flex justify-end p-3 bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
                  <button onClick={() => setSelectedEx(null)} className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-300 active:scale-90 transition-transform">✕</button>
                </div>
                <div className="p-6 pt-0 flex flex-col items-center -mt-10">
                  <div className="relative mb-4">
                    <ExerciseAnimation emoji={selectedEx.emoji} category={selectedEx.category} animationType={inferAnimationType(selectedEx)} size={112} />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center">{selectedEx.name}</h3>
                  <div className="flex gap-2 mt-2 flex-wrap justify-center">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400">{selectedEx.muscleGroup}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${selectedEx.difficulty === "beginner" ? "bg-green-500/20 text-green-400" : selectedEx.difficulty === "intermediate" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>{selectedEx.difficulty}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400">{selectedEx.equipment}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-400 text-center text-sm mb-5">{selectedEx.description}</p>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-white/5 rounded-xl p-3 text-center"><span className="text-lg font-bold text-red-400">{selectedEx.caloriesPer30}</span><p className="text-xs text-gray-500">kcal/30min</p></div>
                    <div className="bg-white/5 rounded-xl p-3 text-center"><span className="text-lg font-bold text-blue-400">{selectedEx.defaultSets}×{selectedEx.defaultReps}</span><p className="text-xs text-gray-500">Sets × Reps</p></div>
                    <div className="bg-white/5 rounded-xl p-3 text-center"><span className="text-lg font-bold text-primary-400">{selectedEx.muscles.length}</span><p className="text-xs text-gray-500">Muscles</p></div>
                  </div>
                  <div className="mb-5"><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Muscles worked</p><div className="flex flex-wrap gap-1.5">{selectedEx.muscles.map(m => <span key={m} className="text-xs px-2 py-1 bg-white/5 rounded-lg text-gray-300">{m}</span>)}</div></div>
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-3">How to perform</p>
                    {selectedEx.steps.map((s, i) => (
                      <div key={i} className="flex gap-3 mb-2.5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white">{i + 1}</span>
                        <span className="text-sm text-gray-300">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mb-5"><p className="text-xs font-semibold text-gray-400 uppercase mb-2">💡 Tips</p>{selectedEx.tips.map((t, i) => <p key={i} className="text-sm text-gray-400 mb-1.5">• {t}</p>)}</div>
                  <button onClick={() => { logExercise(selectedEx); setSelectedEx(null); }} className="w-full py-3.5 btn-primary rounded-xl text-white font-semibold">✅ Log This Exercise</button>
                </div>
              </div>
            </div>
          )}

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((ex, i) => {
              const done = loggedToday.includes(ex.name);
              return (
                <button key={ex.id} onClick={() => setSelectedEx(ex)} className={`glass rounded-xl p-4 text-left group card-hover transition-all ${done ? "border border-primary-500/20" : ""}`} style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0"><ExerciseAnimation emoji={ex.emoji} category={ex.category} size={52} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-semibold text-sm group-hover:text-primary-400 transition-colors truncate">{ex.name}</h4>
                        {done && <span className="text-primary-400 text-xs">✓</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{ex.muscleGroup} · {ex.equipment}</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className="text-xs text-red-400">🔥{ex.caloriesPer30}</span>
                        <span className={`text-xs capitalize ${diffColors[ex.difficulty]}`}>{ex.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 glass rounded-2xl"><span className="text-4xl block mb-3">🔍</span><p className="text-gray-400">No exercises match filters</p></div>}
        </div>
      )}
    </div>
  );
}
