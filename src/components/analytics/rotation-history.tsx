"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useResolvedRotation } from "@/store/use-rotation";
import {
  memberForPeriod,
  periodBounds,
  periodIndexForDate,
} from "@/lib/rotation";
import { memberById } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { MemberAvatar } from "@/components/common/member-avatar";

export function RotationHistory() {
  const opts = useResolvedRotation();
  const now = new Date();
  const currentIdx = periodIndexForDate(now, opts);
  const items = useMemo(() => {
    const start = Math.max(0, currentIdx - 11);
    const arr = [];
    for (let i = currentIdx + 1; i >= start; i--) {
      const { start, end } = periodBounds(i, opts);
      arr.push({
        index: i,
        memberId: memberForPeriod(i, opts),
        start,
        end,
        relative: i === currentIdx ? "now" : i > currentIdx ? "future" : "past",
      });
    }
    return arr;
  }, [opts, currentIdx]);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45">
            Rotation History
          </div>
          <div className="text-lg font-semibold tracking-tight mt-1">
            Recent & upcoming periods
          </div>
        </div>
      </div>

      <div className="relative">
        <div aria-hidden className="absolute left-[19px] top-2 bottom-2 w-px bg-white/[0.08]" />
        <ul className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1.5">
          {items.map((it, i) => {
            const m = memberById(it.memberId);
            return (
              <motion.li
                key={it.index}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025 }}
                className="relative pl-12"
              >
                <span
                  className="absolute left-[14px] top-3 h-2.5 w-2.5 rounded-full ring-4 ring-[#07070b]"
                  style={{ background: m.color, boxShadow: `0 0 8px ${m.color}88` }}
                />
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition px-3.5 py-2.5">
                  <MemberAvatar id={m.id} size="xs" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white truncate">{m.name}</div>
                    <div className="text-[11px] text-white/45">
                      {formatDate(it.start)} → {formatDate(it.end)}
                    </div>
                  </div>
                  <Badge
                    variant={it.relative === "now" ? "success" : it.relative === "future" ? "outline" : "default"}
                  >
                    {it.relative === "now" ? "Now" : it.relative === "future" ? "Upcoming" : "Past"}
                  </Badge>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
