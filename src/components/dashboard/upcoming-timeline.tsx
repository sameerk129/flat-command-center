"use client";

import { motion } from "framer-motion";
import { useResolvedRotation } from "@/store/use-rotation";
import { currentAndUpcoming } from "@/lib/rotation";
import { memberById } from "@/lib/constants";
import { MemberAvatar } from "@/components/common/member-avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate, daysBetween } from "@/lib/utils";

const LABELS = ["Current", "Next", "Next +1", "Next +2"];

export function UpcomingTimeline() {
  const opts = useResolvedRotation();
  const items = currentAndUpcoming(opts, 4);
  const today = new Date();

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45">
            Upcoming Rotation
          </div>
          <div className="text-lg font-semibold tracking-tight mt-1">
            Next four periods
          </div>
        </div>
        <Badge variant="primary">{items.length} periods</Badge>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent hidden sm:block"
        />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, i) => {
            const m = memberById(item.memberId);
            const isCurrent = i === 0;
            const daysAway = Math.max(0, daysBetween(today, item.start));
            return (
              <motion.div
                key={item.index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.05 }}
                className="relative"
              >
                <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-4 z-10">
                  <span
                    className="h-3 w-3 rounded-full ring-4"
                    style={{
                      background: m.color,
                      boxShadow: `0 0 14px 1px ${m.color}99`,
                      ["--tw-ring-color" as never]: "rgba(7,7,11,1)",
                    }}
                  />
                </div>
                <div
                  className={`mt-0 sm:mt-10 rounded-2xl border p-4 hover-lift ${
                    isCurrent
                      ? "border-white/[0.14] bg-white/[0.05]"
                      : "border-white/[0.06] bg-white/[0.025]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/45">
                      {LABELS[i] ?? `Future +${i}`}
                    </span>
                    {isCurrent ? (
                      <Badge variant="success">Now</Badge>
                    ) : (
                      <Badge variant="outline">
                        in {daysAway}d
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <MemberAvatar id={m.id} size="sm" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-white/45">
                        {formatDate(item.start, { month: "short", day: "numeric" })} →{" "}
                        {formatDate(item.end, { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
