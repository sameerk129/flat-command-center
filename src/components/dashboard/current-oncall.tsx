"use client";

import { motion } from "framer-motion";
import { Clock, CalendarDays, ArrowRightLeft, Sparkles } from "lucide-react";
import { useResolvedRotation } from "@/store/use-rotation";
import { currentAndUpcoming } from "@/lib/rotation";
import { memberById } from "@/lib/constants";
import { daysBetween, formatDate, pluralize } from "@/lib/utils";
import { MemberAvatar } from "@/components/common/member-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CurrentOnCallCard() {
  const opts = useResolvedRotation();
  const [current, next] = currentAndUpcoming(opts, 2);
  if (!current) return null;
  const m = memberById(current.memberId);
  const today = new Date();
  const daysLeft = Math.max(0, daysBetween(today, current.end) + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl glass-elevated gradient-border"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute -top-32 -right-20 h-80 w-80 rounded-full blur-3xl opacity-60"
          style={{ background: m.color }}
        />
        <div
          className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full blur-3xl opacity-40"
          style={{ background: "#22d3ee" }}
        />
      </div>

      <div className="relative p-5 sm:p-7 lg:p-10 grid lg:grid-cols-[auto_1fr_auto] gap-5 sm:gap-6 lg:gap-8 items-center">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <div className="hidden sm:block">
              <MemberAvatar id={m.id} size="xl" ring pulse />
            </div>
            <div className="sm:hidden">
              <MemberAvatar id={m.id} size="lg" ring pulse />
            </div>
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 sm:-inset-3 rounded-full border border-white/[0.06] border-dashed"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase text-white/55">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="truncate">On Duty · Live</span>
            </div>
            <div className="mt-1.5 sm:mt-2 text-[26px] sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight truncate">
              {m.name}
            </div>
            <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-white/55">{m.role}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
          <Metric
            icon={<Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            label="Days left"
            mobileLabel="Left"
            value={daysLeft.toString()}
            sub={pluralize(daysLeft, "day")}
            accent={m.color}
          />
          <Metric
            icon={<CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            label="Starts"
            value={formatDate(current.start, { month: "short", day: "numeric" })}
            sub={formatDate(current.start, { weekday: "short" })}
          />
          <Metric
            icon={<CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            label="Ends"
            value={formatDate(current.end, { month: "short", day: "numeric" })}
            sub={formatDate(current.end, { weekday: "short" })}
          />
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 lg:items-end w-full lg:w-auto">
          {next && (
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 sm:px-3.5 py-2 sm:py-2.5 flex-1 lg:flex-none min-w-0">
              <ArrowRightLeft className="h-4 w-4 text-white/45 shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/45">
                  Up next
                </span>
                <span className="text-sm text-white truncate">
                  {memberById(next.memberId).name}
                </span>
              </div>
              <MemberAvatar id={next.memberId} size="xs" />
            </div>
          )}
          <Button variant="primary" asChild className="w-full sm:w-auto">
            <Link href="/rotation">
              <Sparkles className="h-4 w-4" /> Manage rotation
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06] px-5 sm:px-7 lg:px-10 py-2.5 sm:py-3 flex items-center justify-between text-[11px] sm:text-xs text-white/45">
        <span>
          Period <span className="text-white/70">#{current.index + 1}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Cadence</span>
          <Badge variant="outline" className="text-[10px]">
            {opts.cadence === "weekly"
              ? "Weekly"
              : opts.cadence === "biweekly"
                ? "Bi-weekly"
                : "Monthly"}
          </Badge>
        </span>
      </div>
    </motion.div>
  );
}

function Metric({
  icon,
  label,
  mobileLabel,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  mobileLabel?: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="relative rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 sm:px-4 py-2.5 sm:py-3 min-w-0">
      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] uppercase text-white/45">
        <span className="text-white/55 shrink-0">{icon}</span>
        <span className="truncate">
          <span className="sm:hidden">{mobileLabel ?? label}</span>
          <span className="hidden sm:inline">{label}</span>
        </span>
      </div>
      <div
        className="mt-1 sm:mt-1.5 text-lg sm:text-2xl font-semibold tracking-tight leading-tight"
        style={accent ? { color: "#fff" } : undefined}
      >
        <span className="truncate inline-block max-w-full align-bottom">{value}</span>
        {accent && (
          <span
            aria-hidden
            className="ml-1 inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full align-middle"
            style={{
              background: accent,
              boxShadow: `0 0 12px 1px ${accent}55`,
            }}
          />
        )}
      </div>
      <div className="text-[10px] sm:text-[11px] text-white/45 mt-0.5 truncate">{sub}</div>
    </div>
  );
}
