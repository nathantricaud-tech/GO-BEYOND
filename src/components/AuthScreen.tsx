"use client";

import { useState } from "react";

export default function AuthScreen({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }
      onAuthed();
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient animated glow blobs — pure CSS, cheap on mobile GPUs */}
      <div className="glow-blob glow-blob-a" />
      <div className="glow-blob glow-blob-b" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8 animate-fade-up">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary-500/40 rounded-3xl blur-2xl animate-pulse-slow" />
            <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <span className="text-3xl">⚡</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gradient">GO BEYOND</h1>
          <p className="text-gray-400 text-sm mt-1">Ton sport, ta nutrition, ta progression.</p>
        </div>

        <form
          onSubmit={submit}
          className="glass-strong rounded-3xl p-6 space-y-4 animate-fade-up card-border-glow"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex bg-white/5 p-1 rounded-2xl mb-2">
            {(["login", "signup"] as const).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  mode === m
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                    : "text-gray-400"
                }`}
              >
                {m === "login" ? "Connexion" : "Créer un compte"}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              placeholder="toi@exemple.com"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/25 active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>

          <p className="text-center text-xs text-gray-500">
            Tu restes connecté(e) automatiquement sur cet appareil.
          </p>
        </form>
      </div>
    </div>
  );
}
