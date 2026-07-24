"use client";

import { useState, useEffect } from "react";
import WeightTracker from "@/components/WeightTracker";
import { RankSection, GallerySection } from "@/components/RankGallery";
import { useLang } from "@/lib/i18n";

interface Profile {
  id: number;
  weight: number;
  targetWeight: number | null;
}

type SubTab = "weight" | "rank" | "gallery";

export default function ProgressHub({ profile }: { profile: Profile }) {
  const [subTab, setSubTab] = useState<SubTab>("weight");
  const { t } = useLang();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [subTab]);

  const subTabs: { id: SubTab; label: string; emoji: string }[] = [
    { id: "weight", label: t("progress.weight"), emoji: "⚖️" },
    { id: "rank", label: t("progress.rank"), emoji: "🏆" },
    { id: "gallery", label: t("progress.gallery"), emoji: "📸" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-white/5 p-1 rounded-2xl">
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
              subTab === t.id
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20"
                : "text-gray-400"
            }`}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div key={subTab} className="tab-transition">
        {subTab === "weight" && <WeightTracker profile={profile} />}
        {subTab === "rank" && <RankSection profileId={profile.id} />}
        {subTab === "gallery" && <GallerySection profileId={profile.id} />}
      </div>
    </div>
  );
}
