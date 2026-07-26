"use client";

import { useState } from "react";
import { AVATARS } from "@/lib/avatars";
import { useLang } from "@/lib/i18n";

interface ProfileSetupProps {
  onComplete: () => void;
  existingProfile?: ProfileData | null;
}

interface ProfileData {
  id?: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  goal: string;
  targetWeight?: number | null;
  avatar?: string | null;
}

export default function ProfileSetup({ onComplete, existingProfile }: ProfileSetupProps) {
  const { lang } = useLang();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProfileData>({
    name: existingProfile?.name || "",
    age: existingProfile?.age || 25,
    weight: existingProfile?.weight || 70,
    height: existingProfile?.height || 170,
    gender: existingProfile?.gender || "male",
    activityLevel: existingProfile?.activityLevel || "moderate",
    goal: existingProfile?.goal || "lose_weight",
    targetWeight: existingProfile?.targetWeight || undefined,
    avatar: existingProfile?.avatar || "eclair",
  });

  const steps = [
    { title: "About You", icon: "👤", description: "Tell us your name and age" },
    { title: "Body Metrics", icon: "📏", description: "Your physical measurements" },
    { title: "Your Goals", icon: "🎯", description: "What do you want to achieve?" },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = existingProfile?.id ? "PUT" : "POST";
      const body = existingProfile?.id ? { ...form, id: existingProfile.id } : form;

      const res = await fetch("/api/profile", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary-500/30 rounded-3xl blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30">
            <span className="text-4xl">⚡</span>
          </div>
          </div>
          <h1 className="text-4xl font-bold mt-5 text-gradient">GO BEYOND</h1>
          <p className="text-gray-400 mt-2">{lang === "fr" ? "Ton compagnon d’entraînement complet" : "Your complete training companion"}</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                  i === step
                    ? "bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 scale-110"
                    : i < step
                    ? "bg-primary-500/20 text-primary-400"
                    : "bg-white/5 text-gray-500"
                }`}
              >
                {i < step ? (
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-lg">{s.icon}</span>
                )}
              </button>
              {i < steps.length - 1 && (
                <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${i < step ? "bg-primary-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step title */}
        <div className="text-center mb-6 animate-slide-up">
          <h2 className="text-xl font-bold text-white">{steps[step].title}</h2>
          <p className="text-gray-500 text-sm mt-1">{steps[step].description}</p>
        </div>

        {/* Form card */}
        <div className="glass-strong rounded-3xl p-6 shadow-2xl animate-scale-in">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{lang === "fr" ? "Ton Prénom" : "Your Name"}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-4 input-modern rounded-2xl text-white placeholder-gray-500 focus:outline-none"
                  placeholder={lang === "fr" ? "Entre ton prénom" : "Enter your name"}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{lang === "fr" ? "Choisis ton avatar" : "Choose your avatar"}</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {AVATARS.map((a) => {
                    const selected = form.avatar === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setForm({ ...form, avatar: a.id })}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-95 ${
                          selected ? "ring-2" : "bg-white/5"
                        }`}
                        style={selected ? { background: `${a.primary}22`, boxShadow: `0 0 0 2px ${a.primary}` } : undefined}
                      >
                        <span className="text-2xl">{a.emoji}</span>
                        <span className="text-[10px] font-medium" style={{ color: selected ? a.primary : "#9ca3af" }}>{a.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">{AVATARS.find((a) => a.id === form.avatar)?.desc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{lang === "fr" ? "Âge" : "Age"}</label>
                <input
                  type="number"
                  value={form.age || ""}
                  onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-4 input-modern rounded-2xl text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{lang === "fr" ? "Genre" : "Gender"}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "male", label: lang === "fr" ? "Homme" : "Male", icon: "♂️" },
                    { value: "female", label: lang === "fr" ? "Femme" : "Female", icon: "♀️" },
                  ].map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setForm({ ...form, gender: g.value })}
                      className={`p-5 rounded-2xl border-2 transition-all duration-300 text-center group ${
                        form.gender === g.value
                          ? "border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{g.icon}</span>
                      <span className={`text-sm font-medium ${form.gender === g.value ? "text-primary-400" : "text-gray-400"}`}>
                        {g.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{lang === "fr" ? "Poids" : "Weight"}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.weight || ""}
                    onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-4 pr-12 input-modern rounded-2xl text-white focus:outline-none text-lg font-semibold"
                    step="0.1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">kg</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{lang === "fr" ? "Taille" : "Height"}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.height || ""}
                    onChange={(e) => setForm({ ...form, height: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-4 pr-12 input-modern rounded-2xl text-white focus:outline-none text-lg font-semibold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">cm</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{lang === "fr" ? "Poids Cible" : "Target Weight"} <span className="text-gray-500">(optionnel)</span></label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.targetWeight || ""}
                    onChange={(e) => setForm({ ...form, targetWeight: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-4 py-4 pr-12 input-modern rounded-2xl text-white placeholder-gray-500 focus:outline-none"
                    placeholder={lang === "fr" ? "Ton poids cible" : "Your goal weight"}
                    step="0.1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">kg</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{lang === "fr" ? "Niveau d’Activité" : "Activity Level"}</label>
                <div className="space-y-2">
                  {[
                    { value: "sedentary", label: lang === "fr" ? "Sédentaire" : "Sedentary", desc: lang === "fr" ? "Peu ou pas d’exercice" : "Little or no exercise", icon: "🪑" },
                    { value: "light", label: lang === "fr" ? "Légèrement Actif" : "Lightly Active", desc: lang === "fr" ? "Exercice léger 1-3 jours/semaine" : "Light exercise 1-3 days/week", icon: "🚶" },
                    { value: "moderate", label: lang === "fr" ? "Modérément Actif" : "Moderately Active", desc: lang === "fr" ? "Exercice modéré 3-5 jours/semaine" : "Moderate exercise 3-5 days/week", icon: "🏃" },
                    { value: "active", label: lang === "fr" ? "Très Actif" : "Very Active", desc: lang === "fr" ? "Exercice intense 6-7 jours/semaine" : "Hard exercise 6-7 days/week", icon: "💪" },
                    { value: "very_active", label: "Extra Active", desc: "Very intense exercise daily", icon: "🏋️" },
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setForm({ ...form, activityLevel: level.value })}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left ${
                        form.activityLevel === level.value
                          ? "border-primary-500 bg-primary-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-2xl">{level.icon}</span>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${form.activityLevel === level.value ? "text-primary-400" : "text-gray-300"}`}>
                          {level.label}
                        </div>
                        <div className="text-xs text-gray-500">{level.desc}</div>
                      </div>
                      {form.activityLevel === level.value && (
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{lang === "fr" ? "Ton Objectif" : "Your Goal"}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: "lose_weight", label: lang === "fr" ? "Perdre du Poids" : "Lose Weight", desc: lang === "fr" ? "Brûler les graisses & s'affiner" : "Burn fat & slim down", icon: "🔥", color: "from-blue-500 to-cyan-500" },
                    { value: "gain_muscle", label: lang === "fr" ? "Prendre du Muscle" : "Build Muscle", desc: lang === "fr" ? "Gagner force & masse" : "Gain strength & mass", icon: "💪", color: "from-orange-500 to-red-500" },
                    { value: "maintain", label: lang === "fr" ? "Maintenir le Poids" : "Maintain Weight", desc: lang === "fr" ? "Rester en forme & en bonne santé" : "Stay fit & healthy", icon: "⚖️", color: "from-green-500 to-emerald-500" },
                  ].map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setForm({ ...form, goal: g.value })}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                        form.goal === g.value
                          ? "border-primary-500 bg-primary-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-2xl">{g.icon}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`font-semibold block ${form.goal === g.value ? "text-primary-400" : "text-white"}`}>
                          {g.label}
                        </span>
                        <span className="text-xs text-gray-500">{g.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3.5 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all font-medium"
              >
                {lang === "fr" ? "Retour" : "Back"}
              </button>
            )}
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && !form.name}
                className="flex-1 px-6 py-3.5 btn-primary rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {lang === "fr" ? "Continuer" : "Continue"}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3.5 btn-primary rounded-xl text-white font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {lang === "fr" ? "Enregistrement..." : "Saving..."}
                  </span>
                ) : existingProfile?.id ? (
                  lang === "fr" ? "Mettre à jour le profil" : "Update Profile"
                ) : (
                  <>{lang === "fr" ? "C’est parti 🚀" : "Get Started 🚀"}</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          {lang === "fr" ? "En continuant, tu acceptes nos Conditions d’Utilisation" : "By continuing, you agree to our Terms of Service"}
        </p>

        {existingProfile?.id && <DangerZone profileId={existingProfile.id} />}
      </div>
    </div>
  );
}

function DangerZone({ profileId }: { profileId: number }) {
  const { lang } = useLang();
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await fetch("/api/profile/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      setDone(true);
      setConfirming(false);
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-white/5">
      <h3 className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-3">{lang === "fr" ? "Zone dangereuse" : "Danger zone"}</h3>
      {done ? (
        <p className="text-sm text-primary-400 bg-primary-500/10 border border-primary-500/20 rounded-xl px-4 py-3">
          {lang === "fr" ? "✓ Progression réinitialisée. Recharge l’app pour voir les changements." : "✓ Progress reset. Reload the app to see the changes."}
        </p>
      ) : !confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/15 transition-colors"
        >
          {lang === "fr" ? "Réinitialiser ma progression" : "Reset my progress"}
        </button>
      ) : (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
          <p className="text-sm text-red-300">
            {lang === "fr"
              ? <>Ça supprime <strong>définitivement</strong> ton historique de poids, tes repas et séances loggés, tes photos de progression et ton rang (il repartira de zéro). Ton compte et tes infos de profil (nom, taille, objectif...) sont conservés. Cette action est irréversible.</>
              : <>This <strong>permanently</strong> deletes your weight history, logged meals and workouts, progress photos, and your rank (it will restart from zero). Your account and profile info (name, height, goal...) are kept. This action is irreversible.</>}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setConfirming(false)} className="flex-1 py-2.5 rounded-lg bg-white/5 text-gray-300 text-sm">
              {lang === "fr" ? "Annuler" : "Cancel"}
            </button>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium disabled:opacity-60"
            >
              {resetting ? "..." : (lang === "fr" ? "Oui, tout effacer" : "Yes, erase everything")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
