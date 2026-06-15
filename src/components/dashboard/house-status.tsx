"use client";

import { motion } from "framer-motion";
import { Users, Hash, Repeat, Hourglass } from "lucide-react";
import { MEMBERS } from "@/lib/constants";
import { useResolvedRotation } from "@/store/use-rotation";
import { currentAndUpcoming } from "@/lib/rotation";
import { Card } from "@/components/ui/card";
import { daysBetween, weekNumber } from "@/lib/utils";

export function HouseStatus() {
  const opts = useResolvedRotation();
  const [current] = currentAndUpcoming(opts, 1);
  const today = new Date();
  const daysUntilHandover = current ? Math.max(0, daysBetween(today, current.end) + 1) : 0;

  const widgets = [
    {
      icon: <Users className="h-4 w-4" />,
      label: "Total Members",
      value: MEMBERS.length.toString(),
      hint: "Active SREs",
      tint: "from-[#a855f7]/25 to-[#a855f7]/0",
    },
    {
      icon: <Hash className="h-4 w-4" />,
      label: "Current Week",
      value: weekNumber(today).toString(),
      hint: `${today.getFullYear()}`,
      tint: "from-[#22d3ee]/25 to-[#22d3ee]/0",
    },
    {
      icon: <Repeat className="h-4 w-4" />,
      label: "Rotation Cycle",
      value:
        opts.cadence === "weekly"
          ? "7d"
          : opts.cadence === "biweekly"
            ? "14d"
            : "30d",
      hint:
        opts.cadence === "weekly"
          ? "Weekly cadence"
          : opts.cadence === "biweekly"
            ? "Bi-weekly cadence"
            : "Monthly cadence",
      tint: "from-[#6366f1]/25 to-[#6366f1]/0",
    },
    {
      icon: <Hourglass className="h-4 w-4" />,
      label: "Until handover",
      value: `${daysUntilHandover}d`,
      hint: "Next rotation",
      tint: "from-[#f472b6]/25 to-[#f472b6]/0",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {widgets.map((w, i) => (
        <motion.div
          key={w.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i + 0.05 }}
        >
          <Card className="p-4 sm:p-5 relative overflow-hidden">
            <div
              aria-hidden
              className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl bg-gradient-to-br ${w.tint}`}
            />
            <div className="relative flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/45">
              <span className="text-white/65">{w.icon}</span>
              {w.label}
            </div>
            <div className="relative mt-2 text-3xl font-semibold tracking-tight">
              {w.value}
            </div>
            <div className="relative text-[11px] text-white/45 mt-0.5">{w.hint}</div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
