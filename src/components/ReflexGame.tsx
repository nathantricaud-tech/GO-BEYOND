"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/lib/i18n";

const ROUNDS = 12;
const COLORS = [
  { key: "red", bg: "#ef4444", label_fr: "Rouge", label_en: "Red" },
  { key: "blue", bg: "#3b82f6", label_fr: "Bleu", label_en: "Blue" },
  { key: "yellow", bg: "#eab308", label_fr: "Jaune", label_en: "Yellow" },
];

type GameKey = "colors" | "dots";
type Screen = "picker" | "rules" | "playing" | "results";

interface RoundResult {
  label: string;
  ms: number;
}

interface BestScore {
  avgMs: number;
  totalMs: number;
}

function pickColor(exclude?: string) {
  let c = COLORS[Math.floor(Math.random() * COLORS.length)];
  let tries = 0;
  while (exclude && c.key === exclude && tries < 10) {
    c = COLORS[Math.floor(Math.random() * COLORS.length)];
    tries++;
  }
  return c;
}

function randomDotPosition() {
  // keep the dot within a safe inset of the play area so it's never clipped
  const x = 10 + Math.random() * 80; // % 
  const y = 10 + Math.random() * 80; // %
  return { x, y };
}

export default function ReflexGame({ profileId }: { profileId: number }) {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  const [docked, setDocked] = useState(false); // starts tucked away so it doesn't get in the way on open
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("picker");
  const [game, setGame] = useState<GameKey | null>(null);

  // colors game state
  const [current, setCurrent] = useState<{ key: string; bg: string } | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  // dots game state
  const [dotPos, setDotPos] = useState<{ x: number; y: number } | null>(null);

  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [bestByGame, setBestByGame] = useState<Record<GameKey, BestScore | null>>({ colors: null, dots: null });
  const roundStartRef = useRef<number>(0);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    try {
      const c = localStorage.getItem(`gb-reflex-best-colors-${profileId}`);
      const d = localStorage.getItem(`gb-reflex-best-dots-${profileId}`);
      setBestByGame({
        colors: c ? JSON.parse(c) : null,
        dots: d ? JSON.parse(d) : null,
      });
    } catch {}
  }, [profileId]);

  const startGame = useCallback((g: GameKey) => {
    setGame(g);
    setResults([]);
    setRound(0);
    if (g === "colors") {
      setCurrent(pickColor());
    } else {
      setDotPos(randomDotPosition());
    }
    roundStartRef.current = performance.now();
    setScreen("playing");
  }, []);

  const finishGame = useCallback((finalResults: RoundResult[], g: GameKey) => {
    const totalMs = finalResults.reduce((s, r) => s + r.ms, 0);
    const avgMs = totalMs / finalResults.length;
    setBestByGame((prev) => {
      const prevBest = prev[g];
      const next = !prevBest || avgMs < prevBest.avgMs ? { avgMs, totalMs } : prevBest;
      try { localStorage.setItem(`gb-reflex-best-${g}-${profileId}`, JSON.stringify(next)); } catch {}
      return { ...prev, [g]: next };
    });
    setCurrent(null);
    setDotPos(null);
    setScreen("results");
  }, [profileId]);

  const handleColorAnswer = useCallback((colorKey: string) => {
    if (screen !== "playing" || !current) return;
    if (colorKey !== current.key) {
      setWrongFlash(colorKey);
      setTimeout(() => setWrongFlash(null), 200);
      return;
    }
    const elapsed = performance.now() - roundStartRef.current;
    const newResults = [...results, { label: colorKey, ms: elapsed }];
    setResults(newResults);

    if (newResults.length >= ROUNDS) {
      finishGame(newResults, "colors");
      return;
    }
    setCurrent(pickColor(colorKey));
    setRound(newResults.length);
    roundStartRef.current = performance.now();
  }, [screen, current, results, finishGame]);

  const handleDotHit = useCallback(() => {
    if (screen !== "playing" || !dotPos) return;
    const elapsed = performance.now() - roundStartRef.current;
    const newResults = [...results, { label: `${Math.round(dotPos.x)},${Math.round(dotPos.y)}`, ms: elapsed }];
    setResults(newResults);

    if (newResults.length >= ROUNDS) {
      finishGame(newResults, "dots");
      return;
    }
    setDotPos(randomDotPosition());
    setRound(newResults.length);
    roundStartRef.current = performance.now();
  }, [screen, dotPos, results, finishGame]);

  // --- swipe handling on the docked bubble ---
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.touches[0].clientX - dragStartX.current;
    dragDeltaX.current = delta;
    setDragOffset(Math.max(0, delta));
  };
  const onTouchEnd = () => {
    if (dragDeltaX.current > 50) {
      setDocked(false);
    }
    dragStartX.current = null;
    setDragOffset(0);
  };

  const onTabTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragDeltaX.current = 0;
  };
  const onTabTouchMove = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    dragDeltaX.current = e.touches[0].clientX - dragStartX.current;
  };
  const onTabTouchEnd = () => {
    if (dragDeltaX.current < -30) {
      setDocked(true);
    }
    dragStartX.current = null;
  };

  if (!mounted) return null;

  const closeGame = () => {
    setOpen(false);
    setScreen("picker");
    setGame(null);
    setCurrent(null);
    setDotPos(null);
    setResults([]);
  };

  const backToPicker = () => {
    setScreen("picker");
    setGame(null);
    setCurrent(null);
    setDotPos(null);
    setResults([]);
  };

  const colorLabel = (key: string) => {
    const c = COLORS.find((x) => x.key === key);
    if (!c) return key;
    return lang === "fr" ? c.label_fr : c.label_en;
  };

  const gameTitle = (g: GameKey) => {
    if (g === "colors") return lang === "fr" ? "Réflexe Éclair" : "Flash Reflex";
    return lang === "fr" ? "Frappe la Cible" : "Hit the Target";
  };

  const gameEmoji = (g: GameKey) => (g === "colors" ? "⚡" : "🎯");

  return createPortal(
    <>
      {/* Docked floating bubble */}
      {docked && (
        <button
          onClick={() => setOpen(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ transform: `translateX(${dragOffset}px)`, transition: dragOffset ? "none" : "transform 0.3s ease" }}
          className="fixed bottom-36 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 via-blue-500 to-yellow-400 shadow-lg shadow-black/40 flex items-center justify-center text-2xl active:scale-90 transition-transform"
          aria-label={lang === "fr" ? "Ouvrir les mini-jeux" : "Open mini-games"}
        >
          🎮
        </button>
      )}

      {/* Edge tab to bring it back */}
      {!docked && (
        <div
          onClick={() => setDocked(true)}
          onTouchStart={onTabTouchStart}
          onTouchMove={onTabTouchMove}
          onTouchEnd={onTabTouchEnd}
          className="fixed bottom-36 right-0 z-40 w-4 h-12 rounded-l-full bg-gradient-to-br from-red-500 via-blue-500 to-yellow-400 opacity-60 active:opacity-90 transition-opacity"
          aria-label={lang === "fr" ? "Ramener les mini-jeux" : "Bring the mini-games back"}
        />
      )}

      {/* Game modal */}
      {open && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={closeGame}>
          <div className="glass-strong rounded-3xl w-full max-w-sm max-h-[85dvh] overflow-y-auto p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeGame} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 z-10">✕</button>

            {screen === "picker" && (
              <div className="pt-4">
                <p className="text-3xl text-center mb-1">🎮</p>
                <h3 className="text-xl font-bold text-white text-center mb-5">{lang === "fr" ? "Mini-Jeux" : "Mini-Games"}</h3>
                <div className="space-y-3">
                  {(["colors", "dots"] as GameKey[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => { setGame(g); setScreen("rules"); }}
                      className="w-full glass rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-white/5 transition-all"
                    >
                      <span className="text-3xl">{gameEmoji(g)}</span>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{gameTitle(g)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {bestByGame[g] ? `${lang === "fr" ? "Record" : "Best"} : ${Math.round(bestByGame[g]!.avgMs)} ms` : (lang === "fr" ? "Pas encore de record" : "No record yet")}
                        </p>
                      </div>
                      <span className="text-gray-500">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {screen === "rules" && game && (
              <div className="text-center pt-4">
                <p className="text-4xl mb-3">{gameEmoji(game)}</p>
                <h3 className="text-xl font-bold text-white mb-3">{gameTitle(game)}</h3>
                {game === "colors" ? (
                  <p className="text-sm text-gray-400 mb-2">
                    {lang === "fr"
                      ? "Un cercle coloré apparaît au centre. Appuie le plus vite possible sur le bouton de la même couleur en bas."
                      : "A colored circle appears in the center. Tap the matching color button below as fast as you can."}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 mb-2">
                    {lang === "fr"
                      ? "Un point apparaît à un endroit aléatoire de l'écran. Touche-le le plus vite possible — un nouveau point apparaît aussitôt ailleurs."
                      : "A dot appears at a random spot on the screen. Tap it as fast as you can — a new one appears right away somewhere else."}
                  </p>
                )}
                <p className="text-sm text-gray-400 mb-5">
                  {lang === "fr" ? `${ROUNDS} manches. Ton temps par manche, le total et la moyenne s'affichent à la fin.` : `${ROUNDS} rounds. Your time per round, total, and average show up at the end.`}
                </p>
                {bestByGame[game] && (
                  <div className="glass rounded-xl px-4 py-3 mb-5 inline-block">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wide">{lang === "fr" ? "Meilleure moyenne" : "Best average"}</p>
                    <p className="text-lg font-bold text-primary-400">{Math.round(bestByGame[game]!.avgMs)} ms</p>
                  </div>
                )}
                <button onClick={() => startGame(game)} className="w-full py-3.5 btn-primary rounded-xl text-white font-semibold mb-2">
                  {lang === "fr" ? "Commencer" : "Start"}
                </button>
                <button onClick={backToPicker} className="w-full py-2.5 text-gray-400 text-sm">
                  {lang === "fr" ? "‹ Choisir un autre jeu" : "‹ Choose another game"}
                </button>
              </div>
            )}

            {screen === "playing" && game === "colors" && current && (
              <div className="text-center pt-4 flex flex-col min-h-[55vh]">
                <p className="text-xs text-gray-500 mb-4">{lang === "fr" ? "Manche" : "Round"} {round + 1} / {ROUNDS}</p>
                <div className="flex justify-center mb-8">
                  <div
                    className="w-32 h-32 rounded-full shadow-lg transition-colors duration-150"
                    style={{ background: current.bg, boxShadow: `0 0 40px ${current.bg}66` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-auto pb-1">
                  {COLORS.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => handleColorAnswer(c.key)}
                      className={`h-16 rounded-2xl font-bold text-white transition-transform active:scale-90 ${wrongFlash === c.key ? "ring-4 ring-white/80" : ""}`}
                      style={{ background: c.bg }}
                    >
                      {lang === "fr" ? c.label_fr : c.label_en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {screen === "playing" && game === "dots" && dotPos && (
              <div className="pt-4 flex flex-col min-h-[65vh]">
                <p className="text-xs text-gray-500 mb-2 text-center">{lang === "fr" ? "Manche" : "Round"} {round + 1} / {ROUNDS}</p>
                <div className="relative flex-1 rounded-2xl bg-white/5 overflow-hidden">
                  <button
                    onClick={handleDotHit}
                    style={{ left: `${dotPos.x}%`, top: `${dotPos.y}%`, transform: "translate(-50%, -50%)" }}
                    className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg active:scale-90 transition-transform"
                    aria-label={lang === "fr" ? "Toucher la cible" : "Hit the target"}
                  />
                </div>
              </div>
            )}

            {screen === "results" && game && (
              <div className="pt-4">
                <p className="text-3xl text-center mb-2">🏁</p>
                <h3 className="text-lg font-bold text-white text-center mb-4">{lang === "fr" ? "Résultats" : "Results"} — {gameTitle(game)}</h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-primary-400">{Math.round(results.reduce((s, r) => s + r.ms, 0))} ms</p>
                    <p className="text-[11px] text-gray-500">{lang === "fr" ? "Temps total" : "Total time"}</p>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-amber-400">{Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length)} ms</p>
                    <p className="text-[11px] text-gray-500">{lang === "fr" ? "Temps moyen" : "Average time"}</p>
                  </div>
                </div>

                {bestByGame[game] && (
                  <p className="text-center text-xs text-gray-500 mb-4">
                    {lang === "fr" ? "Meilleure moyenne" : "Best average"}: <span className="text-primary-400 font-semibold">{Math.round(bestByGame[game]!.avgMs)} ms</span>
                  </p>
                )}

                <div className="space-y-1.5 max-h-40 overflow-y-auto mb-5">
                  {results.map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        {game === "colors" ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.find((c) => c.key === r.label)?.bg }} />
                            {lang === "fr" ? "Manche" : "Round"} {i + 1} · {colorLabel(r.label)}
                          </>
                        ) : (
                          <>{lang === "fr" ? "Manche" : "Round"} {i + 1}</>
                        )}
                      </span>
                      <span className="text-white font-medium">{Math.round(r.ms)} ms</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => startGame(game)} className="w-full py-3.5 btn-primary rounded-xl text-white font-semibold mb-2">
                  {lang === "fr" ? "Rejouer" : "Play again"}
                </button>
                <button onClick={backToPicker} className="w-full py-2.5 text-gray-400 text-sm">
                  {lang === "fr" ? "‹ Choisir un autre jeu" : "‹ Choose another game"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
