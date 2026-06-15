"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useOps, type OpsMetric } from "@/store/use-ops";
import { cn } from "@/lib/utils";

function statusFor(value: number) {
  if (value >= 80) return { label: "Excellent", color: "#34d399", glow: "rgba(52,211,153,0.5)" };
  if (value >= 60) return { label: "Stable", color: "#22d3ee", glow: "rgba(34,211,238,0.5)" };
  if (value >= 40) return { label: "Watch", color: "#fbbf24", glow: "rgba(251,191,36,0.5)" };
  return { label: "Action", color: "#f87171", glow: "rgba(248,113,113,0.5)" };
}

export function OpsCard({ metric, delay = 0 }: { metric: OpsMetric; delay?: number }) {
  const setValue = useOps((s) => s.setValue);
  const status = statusFor(metric.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-5 sm:p-6 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-30"
          style={{ background: status.color }}
        />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.08]">
              {metric.emoji}
            </div>
            <div>
              <div className="text-sm font-semibold text-white tracking-tight">
                {metric.label}
              </div>
              <div className="text-[11px] text-white/45 mt-0.5">{metric.hint}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase px-2 py-0.5 rounded-full border"
              style={{
                color: status.color,
                background: `${status.color}14`,
                borderColor: `${status.color}40`,
              }}
            >
              <Pulse color={status.color} /> {status.label}
            </span>
            <span className="mt-2 text-2xl font-semibold tracking-tight" style={{ color: status.color }}>
              {metric.value}
              <span className="text-white/35 text-sm">%</span>
            </span>
          </div>
        </div>

        <div className="relative mt-5">
          <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              key={metric.value}
              initial={{ width: 0 }}
              animate={{ width: `${metric.value}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${status.color}AA, ${status.color})`,
                boxShadow: `0 0 14px ${status.glow}`,
              }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={metric.value}
            onChange={(e) => setValue(metric.id, Number(e.target.value))}
            aria-label={`${metric.label} adjuster`}
            className={cn(
              "mt-2 w-full appearance-none bg-transparent cursor-pointer",
              "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/[0.06]",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
            )}
          />
        </div>
      </Card>
    </motion.div>
  );
}

function Pulse({ color }: { color: string }) {
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
        style={{ background: color }}
      />
      <span
        className="relative inline-flex rounded-full h-1.5 w-1.5"
        style={{ background: color }}
      />
    </span>
  );
}
