"use client";

import { useState, useEffect, useCallback } from "react";
import { calculateBMI, getMacroTargets } from "@/lib/nutrition";

interface Profile {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  goal: string;
  targetWeight: number | null;
  dailyCalorieTarget: number | null;
}

interface WorkoutLog {
  id: number;
  exerciseName: string;
  category: string;
  duration: number;
  caloriesBurned: number | null;
}

interface FoodLog {
  id: number;
  foodName: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  mealType: string;
}

export default function Dashboard({ profile }: { profile: Profile }) {
  const [todayFoods, setTodayFoods] = useState<FoodLog[]>([]);
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutLog[]>([]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const dailyTarget = profile.dailyCalorieTarget || 2000;
  const macros = getMacroTargets(dailyTarget, profile.goal);
  const bmi = calculateBMI(profile.weight, profile.height);

  const fetchAll = useCallback(async () => {
    try {
      const [foodRes, workoutRes, waterRes] = await Promise.all([
        fetch(`/api/food-log?profileId=${profile.id}&date=${today}`),
        fetch(`/api/workout-log?profileId=${profile.id}&date=${today}`),
        fetch(`/api/water?profileId=${profile.id}&date=${today}`),
      ]);
      const [foodData, workoutData, waterData] = await Promise.all([
        foodRes.json(), workoutRes.json(), waterRes.json(),
      ]);
      setTodayFoods(foodData.logs || []);
      setTodayWorkouts(workoutData.logs || []);
      setWaterGlasses(waterData.glasses || 0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [profile.id, today]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addWater = async (delta: number) => {
    const next = Math.max(0, waterGlasses + delta);
    setWaterGlasses(next);
    await fetch("/api/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: profile.id, glasses: next, date: today }),
    });
  };

  const totalCalories = todayFoods.reduce((s, l) => s + l.calories, 0);
  const totalProtein = todayFoods.reduce((s, l) => s + (l.protein || 0), 0);
  const totalCarbs = todayFoods.reduce((s, l) => s + (l.carbs || 0), 0);
  const totalFat = todayFoods.reduce((s, l) => s + (l.fat || 0), 0);
  const caloriePercentage = Math.min((totalCalories / dailyTarget) * 100, 100);
  const remaining = dailyTarget - totalCalories;

  const totalWorkoutMins = todayWorkouts.reduce((s, w) => s + w.duration, 0);
  const totalBurned = todayWorkouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0);
  const waterTarget = 8;
  const waterPct = Math.min((waterGlasses / waterTarget) * 100, 100);

  const getBMIInfo = (b: number) => {
    if (b < 18.5) return { label: "Underweight", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (b < 25) return { label: "Normal", color: "text-green-400", bg: "bg-green-500/20" };
    if (b < 30) return { label: "Overweight", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { label: "Obese", color: "text-red-400", bg: "bg-red-500/20" };
  };
  const bmiInfo = getBMIInfo(bmi);

  const goalEmoji = profile.goal === "lose_weight" ? "🔥" : profile.goal === "gain_muscle" ? "💪" : "⚖️";
  const goalLabel = profile.goal === "lose_weight" ? "Lose Weight" : profile.goal === "gain_muscle" ? "Build Muscle" : "Maintain";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600/30 via-primary-500/20 to-teal-600/10 p-6 border border-primary-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary-300/80 text-sm font-medium">{getGreeting()}</p>
            <h2 className="text-3xl font-bold text-white mt-1">{profile.name} <span className="inline-block animate-bounce-subtle">👋</span></h2>
            <p className="text-gray-300 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-gradient font-semibold">{remaining > 0 ? remaining : 0}</span> kcal remaining
            </p>
          </div>
          <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <span className="text-xl">{goalEmoji}</span>
            <span className="text-sm font-medium text-white">{goalLabel}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Today's Workouts */}
        <div className="glass rounded-2xl p-4 text-center card-hover">
          <div className="w-10 h-10 mx-auto rounded-xl bg-orange-500/20 flex items-center justify-center mb-2"><span className="text-xl">🏋️</span></div>
          <span className="text-2xl font-bold text-orange-400">{todayWorkouts.length}</span>
          <p className="text-xs text-gray-500 mt-0.5">Exercises</p>
        </div>
        {/* Calories Burned */}
        <div className="glass rounded-2xl p-4 text-center card-hover">
          <div className="w-10 h-10 mx-auto rounded-xl bg-red-500/20 flex items-center justify-center mb-2"><span className="text-xl">🔥</span></div>
          <span className="text-2xl font-bold text-red-400">{totalBurned}</span>
          <p className="text-xs text-gray-500 mt-0.5">kcal burned</p>
        </div>
        {/* Workout Minutes */}
        <div className="glass rounded-2xl p-4 text-center card-hover">
          <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/20 flex items-center justify-center mb-2"><span className="text-xl">⏱️</span></div>
          <span className="text-2xl font-bold text-blue-400">{totalWorkoutMins}</span>
          <p className="text-xs text-gray-500 mt-0.5">min trained</p>
        </div>
      </div>

      {/* Calorie Ring + Water + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Calorie Ring */}
        <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center card-hover">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-primary-500/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: "3s" }} />
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-white/5" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#calGrad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(caloriePercentage / 100) * 327} 327`} className="transition-all duration-1000"
                style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))" }} />
              <defs><linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#6ee7b7" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gradient">{totalCalories}</span>
              <span className="text-xs text-gray-400">/ {dailyTarget} kcal</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3 font-medium">Calories Intake</p>
        </div>

        {/* Water Tracker */}
        <div className="glass rounded-3xl p-6 card-hover">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm">💧</span>
            Water Tracker
          </h3>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button onClick={() => addWater(-1)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all active:scale-90">−</button>
            <div className="text-center">
              <span className="text-4xl font-bold text-blue-400">{waterGlasses}</span>
              <span className="text-gray-500 text-sm block">/ {waterTarget} glasses</span>
            </div>
            <button onClick={() => addWater(1)} className="w-10 h-10 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 flex items-center justify-center text-xl transition-all active:scale-90">+</button>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${waterPct}%` }} />
          </div>
          <div className="grid grid-cols-8 gap-1 mt-3">
            {Array.from({ length: waterTarget }).map((_, i) => (
              <div key={i} className={`h-6 rounded-md transition-all ${i < waterGlasses ? "bg-blue-500/40" : "bg-white/5"}`} />
            ))}
          </div>
        </div>

        {/* Body Stats */}
        <div className="glass rounded-3xl p-6 card-hover">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm">📊</span>
            Your Stats
          </h3>
          <div className="space-y-2.5">
            <div className={`flex items-center justify-between p-3 rounded-xl ${bmiInfo.bg} border border-white/5`}>
              <span className="text-gray-300 text-sm">BMI</span>
              <div className="text-right"><span className={`font-bold ${bmiInfo.color}`}>{bmi}</span><span className={`text-xs ${bmiInfo.color} block opacity-80`}>{bmiInfo.label}</span></div>
            </div>
            {[
              { label: "Weight", value: `${profile.weight} kg`, icon: "⚖️" },
              { label: "Height", value: `${profile.height} cm`, icon: "📏" },
              ...(profile.targetWeight ? [{ label: "Target", value: `${profile.targetWeight} kg`, icon: "🎯" }] : []),
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-gray-400 text-sm flex items-center gap-2"><span>{s.icon}</span>{s.label}</span>
                <span className="font-semibold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="glass rounded-3xl p-6 card-hover">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-5">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-pink-500/20 flex items-center justify-center text-sm">🎯</span>
          Today&apos;s Macros
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Protein", value: totalProtein, target: macros.protein, color: "from-blue-500 to-cyan-500", emoji: "🥩" },
            { label: "Carbs", value: totalCarbs, target: macros.carbs, color: "from-amber-500 to-orange-500", emoji: "🍞" },
            { label: "Fat", value: totalFat, target: macros.fat, color: "from-pink-500 to-rose-500", emoji: "🥑" },
          ].map(m => (
            <div key={m.label}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">{m.emoji}</span>
                <span className="text-xs text-gray-400">{m.label}</span>
              </div>
              <div className="text-lg font-bold text-white">{Math.round(m.value)}g <span className="text-xs text-gray-500 font-normal">/ {m.target}g</span></div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-2">
                <div className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all duration-700`} style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Workouts */}
      {todayWorkouts.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center text-sm">💪</span>
            Today&apos;s Training
          </h3>
          <div className="space-y-2">
            {todayWorkouts.map(w => (
              <div key={w.id} className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏋️</span>
                  <span className="text-sm text-gray-300">{w.exerciseName}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>⏱️ {w.duration}min</span>
                  {w.caloriesBurned ? <span className="text-red-400">🔥 {w.caloriesBurned}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
