"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { detectFoodFromColors } from "@/lib/food-detection";

interface Profile {
  id: number;
  name: string;
  dailyCalorieTarget: number | null;
}

interface FoodResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving: string;
  category?: string;
  emoji?: string;
}

interface FoodGuess {
  query: string;
  confidence: number;
  label: string;
}

export default function FoodScanner({ profile }: { profile: Profile }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodResult | null>(null);
  const [mealType, setMealType] = useState("lunch");
  const [addSuccess, setAddSuccess] = useState(false);
  const [servings, setServings] = useState(1);

  // Camera
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Analysis
  const [analyzing, setAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<FoodGuess[]>([]);
  const [showGuesses, setShowGuesses] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Callback ref for video element — attaches stream as soon as element mounts
  const attachStream = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
      el.onloadedmetadata = () => {
        el.play();
        setCameraReady(true);
      };
    }
  }, []);

  // Start live camera
  const startCamera = async () => {
    setCameraError(false);
    setPreviewImage(null);
    setGuesses([]);
    setShowGuesses(false);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    setShowCamera(false);
    setPreviewImage(null);
    setCameraError(false);
    setAnalyzing(false);
  }, []);

  // Capture from live camera → draw to canvas → analyze
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreviewImage(dataUrl);
    // stop live stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    runAnalysis(canvas);
  };

  // Upload from file → draw to canvas → analyze
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setPreviewImage(dataUrl);
      setShowCamera(true);
      setCameraError(false);
      runAnalysis(canvas);
    };
    img.src = URL.createObjectURL(file);
    e.target.value = "";
  };

  // Actual image analysis
  const runAnalysis = async (canvas: HTMLCanvasElement) => {
    setAnalyzing(true);
    setShowGuesses(false);

    // Small delay so user sees the "analyzing" state
    await new Promise((r) => setTimeout(r, 1200));

    // Detect food from image colors
    const foodGuesses = detectFoodFromColors(canvas);
    setGuesses(foodGuesses);
    setAnalyzing(false);
    setShowGuesses(true);
  };

  // User picks a guess → search the database for it
  const pickGuess = async (guess: FoodGuess) => {
    setShowGuesses(false);
    setShowCamera(false);
    setPreviewImage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/scan-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: guess.query }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // "Not what I see" — close guesses, let user search manually
  const dismissGuesses = () => {
    setShowGuesses(false);
    setShowCamera(false);
    setPreviewImage(null);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/scan-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToLog = async () => {
    if (!selectedFood) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          foodName: selectedFood.name,
          calories: Math.round(selectedFood.calories * servings),
          protein: Math.round(selectedFood.protein * servings * 10) / 10,
          carbs: Math.round(selectedFood.carbs * servings * 10) / 10,
          fat: Math.round(selectedFood.fat * servings * 10) / 10,
          fiber: Math.round(selectedFood.fiber * servings * 10) / 10,
          servingSize: `${servings}x ${selectedFood.serving}`,
          mealType,
          logDate: today,
        }),
      });
      if (res.ok) {
        setAddSuccess(true);
        setTimeout(() => {
          setAddSuccess(false);
          setSelectedFood(null);
          setServings(1);
          setResults([]);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ─────────────────── RENDER ───────────────────

  return (
    <div className="space-y-6 animate-fade-in">
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
      <canvas ref={canvasRef} className="hidden" />

      {/* ══════ CAMERA / ANALYSIS FULLSCREEN ══════ */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
            <button onClick={stopCamera} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-lg">✕</button>
            <span className="text-white font-medium">Scan Your Food</span>
            <div className="w-10" />
          </div>

          {/* ── Analyzing ── */}
          {analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {previewImage && <img src={previewImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" />}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-4xl">🔍</span></div>
                </div>
                <p className="text-white text-lg font-medium mt-6">Analyzing colors & shapes…</p>
                <p className="text-gray-400 text-sm mt-2">Detecting food type</p>
              </div>
            </div>
          )}

          {/* ── Guesses result ── */}
          {showGuesses && (
            <div className="flex-1 flex flex-col relative">
              {previewImage && <img src={previewImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
              <div className="flex-1" />
              <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/95 to-black/60 rounded-t-3xl">
                <h3 className="text-white font-bold text-lg mb-1">What did we detect?</h3>
                <p className="text-gray-400 text-sm mb-4">Pick the food that matches your photo</p>
                <div className="space-y-2">
                  {guesses.map((g, i) => (
                    <button
                      key={g.query}
                      onClick={() => pickGuess(g)}
                      className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-all text-left animate-slide-up"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-lg">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🍽️"}
                        </div>
                        <span className="text-white font-medium">{g.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${g.confidence}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{g.confidence}%</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={dismissGuesses}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-gray-300 font-medium hover:bg-white/20 transition-all text-sm"
                  >
                    ❌ Not what I see — search manually
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Camera error ── */}
          {cameraError && !analyzing && !showGuesses && (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-5"><span className="text-4xl">📷</span></div>
              <h3 className="text-xl font-bold text-white text-center">Camera not available</h3>
              <p className="text-gray-400 text-center mt-2 max-w-xs">Your browser blocked camera access. Upload a photo instead.</p>
              <button onClick={() => { stopCamera(); fileInputRef.current?.click(); }} className="mt-6 btn-primary px-8 py-3 rounded-xl text-white font-semibold">📁 Upload a Photo</button>
              <button onClick={stopCamera} className="mt-3 text-gray-500 hover:text-white text-sm transition-colors">Cancel</button>
            </div>
          )}

          {/* ── Live camera feed ── */}
          {!cameraError && !analyzing && !showGuesses && (
            <>
              <video ref={attachStream} autoPlay playsInline muted className="flex-1 w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                  <div className="viewfinder-corner top-left" />
                  <div className="viewfinder-corner top-right" />
                  <div className="viewfinder-corner bottom-left" />
                  <div className="viewfinder-corner bottom-right" />
                  {cameraReady && <div className="scan-line" />}
                </div>
              </div>
              {cameraReady && (
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-center">
                    <button onClick={capturePhoto} className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/20 active:scale-90 transition-transform">
                      <div className="w-16 h-16 rounded-full border-4 border-black/10" />
                    </button>
                  </div>
                  <p className="text-center text-white/60 text-sm mt-4">Point at your food and tap to capture</p>
                </div>
              )}
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════ HEADER ══════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-cyan-600/10 to-teal-600/20 p-6 border border-white/10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30"><span className="text-2xl">📸</span></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Food Scanner</h2>
            <p className="text-blue-300/80 text-sm">Scan or search to track nutrition</p>
          </div>
        </div>
      </div>

      {/* ══════ ACTION BUTTONS ══════ */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={startCamera} className="relative overflow-hidden group rounded-2xl p-5 bg-gradient-to-r from-primary-600 to-primary-500 shadow-xl shadow-primary-500/25 transition-all hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <div className="relative flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">📷</span>
            <span className="text-white font-semibold">Open Camera</span>
            <span className="text-primary-100/80 text-xs">Take a photo</span>
          </div>
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="relative overflow-hidden group rounded-2xl p-5 glass hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <div className="relative flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">📁</span>
            <span className="text-white font-semibold">Upload Photo</span>
            <span className="text-gray-400 text-xs">From gallery</span>
          </div>
        </button>
      </div>

      {/* ══════ SEARCH BAR ══════ */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><span className="text-gray-500">🔍</span></div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search food… (chicken, rice, avocado)"
          className="w-full pl-12 pr-24 py-4 glass rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
        />
        <button onClick={handleSearch} disabled={loading || !query.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary-500 rounded-xl text-white font-medium hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Search"}
        </button>
      </div>

      {/* ══════ RESULTS ══════ */}
      {results.length > 0 && !selectedFood && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Found {results.length} result{results.length !== 1 ? "s" : ""}</h3>
            <button onClick={() => setResults([])} className="text-xs text-gray-500 hover:text-white transition-colors">Clear</button>
          </div>
          {results.map((food, i) => (
            <button key={i} onClick={() => setSelectedFood(food)} className="w-full glass rounded-2xl p-4 hover:bg-white/5 transition-all text-left group card-hover" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-2xl flex-shrink-0">{food.emoji || "🍽️"}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold group-hover:text-primary-400 transition-colors truncate">{food.name}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{food.serving}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">P: {food.protein}g</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">C: {food.carbs}g</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400">F: {food.fat}g</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-2xl font-bold text-gradient">{food.calories}</span>
                  <span className="text-xs text-gray-500 block">kcal</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {results.length === 0 && !loading && query && !showCamera && (
        <div className="text-center py-12 glass rounded-2xl animate-fade-in">
          <span className="text-5xl block mb-4">🤔</span>
          <p className="text-gray-300 font-medium">No results for &quot;{query}&quot;</p>
          <p className="text-gray-500 text-sm mt-2">Try: apple, chicken, rice, salmon, pasta, pizza…</p>
        </div>
      )}

      {/* ══════ SELECTED FOOD ══════ */}
      {selectedFood && (
        <div className="glass rounded-3xl p-6 animate-scale-in">
          {addSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Added!</h3>
              <p className="text-gray-400 mt-2">{selectedFood.name} → {mealType}</p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center text-3xl">{selectedFood.emoji || "🍽️"}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedFood.name}</h3>
                    <p className="text-gray-500 text-sm">{selectedFood.serving}</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedFood(null); setServings(1); }} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">✕</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Calories", value: Math.round(selectedFood.calories * servings), unit: "kcal", color: "from-primary-500 to-emerald-500" },
                  { label: "Protein", value: Math.round(selectedFood.protein * servings), unit: "g", color: "from-blue-500 to-cyan-500" },
                  { label: "Carbs", value: Math.round(selectedFood.carbs * servings), unit: "g", color: "from-amber-500 to-orange-500" },
                  { label: "Fat", value: Math.round(selectedFood.fat * servings), unit: "g", color: "from-pink-500 to-rose-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}<span className="text-sm font-normal text-gray-500">{s.unit}</span></div>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-2xl">
                <span className="text-gray-400">Servings</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setServings(Math.max(0.5, servings - 0.5))} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all">−</button>
                  <span className="w-12 text-center text-xl font-bold text-white">{servings}</span>
                  <button onClick={() => setServings(servings + 0.5)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-all">+</button>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Add to meal</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: "breakfast", emoji: "🌅", label: "Breakfast" },
                    { value: "lunch", emoji: "☀️", label: "Lunch" },
                    { value: "dinner", emoji: "🌙", label: "Dinner" },
                    { value: "snack", emoji: "🍪", label: "Snack" },
                  ].map((m) => (
                    <button key={m.value} onClick={() => setMealType(m.value)} className={`p-3 rounded-xl text-center transition-all ${mealType === m.value ? "bg-primary-500/20 border-2 border-primary-500/50" : "bg-white/5 border-2 border-transparent hover:bg-white/10"}`}>
                      <span className="text-2xl block mb-1">{m.emoji}</span>
                      <span className={`text-xs ${mealType === m.value ? "text-primary-400" : "text-gray-500"}`}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleAddToLog} className="w-full py-4 btn-primary rounded-2xl text-white font-semibold text-lg">Add to Food Log</button>
            </>
          )}
        </div>
      )}

      {/* ══════ POPULAR FOODS ══════ */}
      {!selectedFood && results.length === 0 && !showCamera && (
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popular Foods</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {[
              { name: "Chicken", q: "chicken_breast", emoji: "🍗" },
              { name: "Salmon", q: "salmon", emoji: "🐟" },
              { name: "Rice", q: "rice", emoji: "🍚" },
              { name: "Egg", q: "egg", emoji: "🥚" },
              { name: "Banana", q: "banana", emoji: "🍌" },
              { name: "Avocado", q: "avocado", emoji: "🥑" },
              { name: "Oatmeal", q: "oatmeal", emoji: "🥣" },
              { name: "Greek Yogurt", q: "greek_yogurt", emoji: "🥛" },
              { name: "Steak", q: "beef_steak", emoji: "🥩" },
              { name: "Pasta", q: "pasta", emoji: "🍝" },
              { name: "Pizza", q: "pizza", emoji: "🍕" },
              { name: "Salad", q: "salad", emoji: "🥗" },
            ].map((item, i) => (
              <button key={item.q} onClick={() => { setQuery(item.q); fetch("/api/scan-food", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: item.q }) }).then((r) => r.json()).then((d) => setResults(d.results || [])); }} className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group" style={{ animationDelay: `${i * 30}ms` }}>
                <span className="text-2xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors truncate w-full text-center">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
