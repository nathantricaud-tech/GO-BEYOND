"use client";

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/lib/i18n";

interface Props {
  profileId: number;
}

type DayStatus = "workout" | "food" | "both";

const STATUS_COLOR: Record<DayStatus, string> = {
  workout: "bg-red-500",
  food: "bg-green-500",
  both: "bg-amber-400",
};

export default function ActivityCalendar({ profileId }: Props) {
  const { lang } = useLang();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 }; // month 1-12
  });
  const [days, setDays] = useState<Record<string, DayStatus>>({});
  const [loading, setLoading] = useState(true);

  const monthKey = `${cursor.year}-${String(cursor.month).padStart(2, "0")}`;

  const fetchMonth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activity-calendar?profileId=${profileId}&month=${monthKey}`);
      const data = await res.json();
      setDays(data.days || {});
    } catch {
      setDays({});
    } finally {
      setLoading(false);
    }
  }, [profileId, monthKey]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  const monthLabel = new Date(cursor.year, cursor.month - 1, 1).toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US",
    { month: "long", year: "numeric" }
  );

  const daysInMonth = new Date(cursor.year, cursor.month, 0).getDate();
  // getDay(): 0=Sun..6=Sat -> convert to Monday-first index 0=Mon..6=Sun
  const firstWeekday = (new Date(cursor.year, cursor.month - 1, 1).getDay() + 6) % 7;
  const todayKey = new Date().toISOString().slice(0, 10);
  const weekdayLabels = lang === "fr" ? ["L", "M", "M", "J", "V", "S", "D"] : ["M", "T", "W", "T", "F", "S", "S"];

  const cells: (string | null)[] = [...Array(firstWeekday).fill(null)];
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${monthKey}-${String(d).padStart(2, "0")}`);
  }

  const goMonth = (delta: number) => {
    setCursor((c) => {
      let m = c.month + delta;
      let y = c.year;
      if (m > 12) { m = 1; y++; }
      if (m < 1) { m = 12; y--; }
      return { year: y, month: m };
    });
  };

  return (
    <div className="glass px-4 py-3 rounded-2xl w-full">
      <div className="flex items-center justify-between mb-2.5">
        <button onClick={() => goMonth(-1)} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all text-sm">
          ‹
        </button>
        <span className="text-xs font-semibold text-white capitalize">{monthLabel}</span>
        <button onClick={() => goMonth(1)} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all text-sm">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {weekdayLabels.map((w, i) => (
          <span key={i} className="text-[9px] text-gray-600 text-center">{w}</span>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-1.5 transition-opacity ${loading ? "opacity-40" : "opacity-100"}`}>
        {cells.map((dateKey, i) => {
          if (!dateKey) return <div key={i} className="aspect-square" />;
          const status = days[dateKey];
          const isToday = dateKey === todayKey;
          return (
            <div
              key={i}
              title={dateKey}
              className={`aspect-square rounded-md ${status ? STATUS_COLOR[status] : "bg-white/[0.06]"} ${isToday ? "ring-1 ring-white/70" : ""}`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" />{lang === "fr" ? "Sport" : "Workout"}</span>
        <span className="flex items-center gap-1.5 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block" />{lang === "fr" ? "Repas" : "Food"}</span>
        <span className="flex items-center gap-1.5 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />{lang === "fr" ? "Les deux" : "Both"}</span>
      </div>
    </div>
  );
}
