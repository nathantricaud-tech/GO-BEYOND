"use client";

import { useState, useEffect, useCallback } from "react";
import ProfileSetup from "@/components/ProfileSetup";
import Dashboard from "@/components/Dashboard";
import MealPlanner from "@/components/MealPlanner";
import Recipes from "@/components/Recipes";
import Exercises from "@/components/Exercises";
import ProgressHub from "@/components/ProgressHub";
import AuthScreen from "@/components/AuthScreen";
import { useLang } from "@/lib/i18n";

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

type TabType = "dashboard" | "training" | "nutrition" | "recipes" | "progress";

export default function Home() {
  const { t, lang, setLang } = useLang();
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking session
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setAuthed(true);
        setProfile(data.profile || null);
      } else {
        setAuthed(false);
      }
    } catch {
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthed(false);
    setProfile(null);
  }

  // ---- 1. Checking existing session (auto-reconnect) ----
  if (authed === null || loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary-500/30 rounded-3xl blur-2xl animate-pulse-slow" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <span className="text-4xl">⚡</span>
            </div>
          </div>
          <p className="text-gray-400 mt-4">{t("auth.loading")}</p>
        </div>
      </div>
    );
  }

  // ---- 2. Not logged in ----
  if (!authed) {
    return <AuthScreen onAuthed={checkSession} />;
  }

  // ---- 3. Logged in, no profile yet (or editing) ----
  if (!profile || showProfileEdit) {
    return (
      <ProfileSetup
        existingProfile={profile}
        onComplete={() => {
          setShowProfileEdit(false);
          checkSession();
        }}
      />
    );
  }

  const tabs: { id: TabType; label: string; emoji: string }[] = [
    { id: "dashboard", label: t("nav.dashboard"), emoji: "🏠" },
    { id: "training", label: t("nav.training"), emoji: "🏋️" },
    { id: "nutrition", label: t("nav.nutrition"), emoji: "🥗" },
    { id: "recipes", label: t("nav.recipes"), emoji: "🍳" },
    { id: "progress", label: t("nav.progress"), emoji: "📊" },
  ];

  return (
    <div className="min-h-screen bg-mesh pb-24 sm:pb-6">
      <header className="sticky top-0 z-40 glass-strong safe-top">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/30 rounded-xl blur-lg" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-xl">⚡</span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gradient">GO BEYOND</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="px-3 py-2 glass rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              title="FR / EN"
            >
              {lang === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
            </button>
            <button
              onClick={() => setShowProfileEdit(true)}
              className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-600/20 transition-all">
                <span>👤</span>
              </div>
              <span className="hidden sm:inline text-sm font-medium">{profile.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 glass rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
              title={t("header.logout")}
            >
              🚪
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 hidden sm:block pb-2">
          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={activeTab === tab.id ? "animate-bounce-subtle" : ""}>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main key={activeTab} className="max-w-4xl mx-auto px-4 py-6 tab-transition">
        {activeTab === "dashboard" && <Dashboard profile={profile} />}
        {activeTab === "training" && <Exercises userGoal={profile.goal} profileId={profile.id} />}
        {activeTab === "nutrition" && <MealPlanner profile={profile} />}
        {activeTab === "recipes" && <Recipes userGoal={profile.goal} profileId={profile.id} />}
        {activeTab === "progress" && <ProgressHub profile={profile} />}
      </main>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 glass-strong z-40 safe-bottom">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all relative tappable ${
                activeTab === tab.id ? "text-primary-400" : "text-gray-500"
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" />
              )}
              <span className={`text-xl ${activeTab === tab.id ? "animate-bounce-subtle" : ""}`}>{tab.emoji}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
