"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResolvedRotation } from "@/store/use-rotation";
import { memberForPeriod, periodIndexForDate } from "@/lib/rotation";
import { memberById, MEMBERS } from "@/lib/constants";
import { addDays, cn, startOfDay } from "@/lib/utils";

function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Mon=0
  const days: Date[] = [];
  for (let i = 0; i < startWeekday; i++) {
    days.push(addDays(first, -(startWeekday - i)));
  }
  let d = new Date(first);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d = addDays(d, 1);
  }
  while (days.length % 7 !== 0) {
    days.push(new Date(days[days.length - 1].getTime() + 86400000));
  }
  while (days.length < 42) {
    days.push(new Date(days[days.length - 1].getTime() + 86400000));
  }
  return days;
}

export function RotationCalendar() {
  const opts = useResolvedRotation();
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const grid = useMemo(
    () => monthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  const monthLabel = cursor.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45">
            Monthly Calendar
          </div>
          <div className="text-lg font-semibold tracking-tight mt-1">
            {monthLabel}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          >
            Today
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-1 py-1.5 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {grid.map((d, idx) => {
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = d.getTime() === today.getTime();
          const periodIdx = periodIndexForDate(d, opts);
          const memberId = memberForPeriod(periodIdx, opts);
          const m = memberById(memberId);

          const prevDay = addDays(d, -1);
          const prevPeriod = periodIndexForDate(prevDay, opts);
          const isHandoverStart = prevPeriod !== periodIdx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.005 }}
              className={cn(
                "relative rounded-xl border min-h-[64px] sm:min-h-[78px] p-1.5 sm:p-2 overflow-hidden",
                inMonth ? "border-white/[0.06] bg-white/[0.02]" : "border-white/[0.03] bg-transparent",
                isToday && "ring-1 ring-[#a855f7]/40"
              )}
              style={{
                boxShadow: inMonth
                  ? `inset 4px 0 0 -2px ${m.color}99`
                  : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    inMonth ? "text-white/75" : "text-white/30",
                    isToday && "text-white"
                  )}
                >
                  {d.getDate()}
                </span>
                {isHandoverStart && inMonth && (
                  <Dot className="h-3 w-3" style={{ color: m.color }} />
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: m.color, boxShadow: `0 0 6px ${m.color}77` }}
                />
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] truncate",
                    inMonth ? "text-white/65" : "text-white/30"
                  )}
                >
                  {m.name.split(" ")[0]}
                </span>
              </div>
              {isToday && (
                <span className="absolute bottom-1 right-1 text-[9px] font-semibold tracking-wider uppercase text-[#c4b5fd]">
                  Today
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px]">
        <span className="text-white/45">Legend</span>
        {MEMBERS.map((m) => (
          <div key={m.id} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: m.color, boxShadow: `0 0 6px ${m.color}77` }}
            />
            <span className="text-white/65">{m.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
