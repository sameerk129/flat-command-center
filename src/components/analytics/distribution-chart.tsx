"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { useResolvedRotation } from "@/store/use-rotation";
import { distributionFromHistory } from "@/lib/rotation";
import { MEMBERS, memberById, type MemberId } from "@/lib/constants";

export function DistributionChart() {
  const opts = useResolvedRotation();
  const counts = useMemo(() => distributionFromHistory(opts, 26), [opts]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const data = (Object.keys(counts) as MemberId[]).map((id) => ({
    id,
    name: memberById(id).name,
    value: counts[id],
    color: memberById(id).color,
  }));

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45">
            On-Call Distribution
          </div>
          <div className="text-lg font-semibold tracking-tight mt-1">Last 26 periods</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4 items-center">
        <div className="h-[240px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {MEMBERS.map((m) => (
                  <radialGradient id={`grad-${m.id}`} key={m.id} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={m.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={m.color} stopOpacity={0.55} />
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={92}
                paddingAngle={3}
                dataKey="value"
                stroke="rgba(7,7,11,1)"
                strokeWidth={2}
                isAnimationActive
                animationBegin={150}
                animationDuration={800}
              >
                {data.map((d) => (
                  <Cell key={d.id} fill={`url(#grad-${d.id})`} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(20, 20, 28, 0.92)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "white",
                }}
                formatter={(value, _name, item) => {
                  const v = Number(value ?? 0);
                  const itm = item as { payload?: { name?: string } };
                  return [
                    `${v} period${v === 1 ? "" : "s"} · ${total ? Math.round((v / total) * 100) : 0}%`,
                    itm?.payload?.name ?? "",
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/45">
              Total
            </div>
            <div className="text-2xl font-semibold tracking-tight gradient-text">
              {total}
            </div>
            <div className="text-[10px] text-white/45">periods</div>
          </div>
        </div>
        <div className="space-y-2">
          {data
            .slice()
            .sort((a, b) => b.value - a.value)
            .map((d, i) => {
              const pct = total ? Math.round((d.value / total) * 100) : 0;
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: d.color, boxShadow: `0 0 8px ${d.color}66` }}
                  />
                  <span className="text-sm text-white/85 truncate flex-1">{d.name}</span>
                  <span className="text-sm font-mono text-white">{pct}%</span>
                </motion.div>
              );
            })}
        </div>
      </div>
    </Card>
  );
}
