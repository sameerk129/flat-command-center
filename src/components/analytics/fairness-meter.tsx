"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useResolvedRotation } from "@/store/use-rotation";
import { distributionFromHistory, fairnessScore } from "@/lib/rotation";
import { MEMBERS, memberById, type MemberId } from "@/lib/constants";

export function FairnessMeter() {
  const opts = useResolvedRotation();
  const counts = useMemo(() => distributionFromHistory(opts, 26), [opts]);
  const score = useMemo(() => fairnessScore(counts), [counts]);

  const tone =
    score >= 90 ? "Excellent — duties are perfectly balanced" :
    score >= 75 ? "Healthy — fairly distributed" :
    score >= 60 ? "OK — slight bias, watch it" :
    "Skewed — someone's pulling more weight";

  const max = Math.max(...Object.values(counts), 1);
  const ideal = Math.round(
    Object.values(counts).reduce((a, b) => a + b, 0) / MEMBERS.length
  );

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45 flex items-center gap-1.5">
            <Scale className="h-3 w-3" /> Fairness Meter
          </div>
          <div className="text-lg font-semibold tracking-tight mt-1">
            Score: <span className="gradient-text">{score}</span>/100
          </div>
        </div>
        <FairnessDial score={score} />
      </div>

      <p className="text-[12px] text-white/55 mb-5">{tone}</p>

      <div className="space-y-3">
        {(Object.keys(counts) as MemberId[]).map((id) => {
          const m = memberById(id);
          const c = counts[id];
          const pct = max ? (c / max) * 100 : 0;
          const diff = c - ideal;
          return (
            <div key={id}>
              <div className="flex items-center justify-between text-[12px] mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: m.color, boxShadow: `0 0 6px ${m.color}77` }}
                  />
                  <span className="text-white/85">{m.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white">{c}</span>
                  <span className={`text-[10px] ${diff > 0 ? "text-[#fcd34d]" : diff < 0 ? "text-[#86efac]" : "text-white/40"}`}>
                    {diff === 0 ? "perfect" : diff > 0 ? `+${diff}` : diff}
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}AA)` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function FairnessDial({ score }: { score: number }) {
  const size = 92;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-semibold tracking-tight" style={{ color }}>
          {score}
        </div>
      </div>
    </div>
  );
}
