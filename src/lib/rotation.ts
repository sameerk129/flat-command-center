import {
  CADENCE_DAYS,
  MEMBERS,
  type Cadence,
  type MemberId,
  ROTATION_EPOCH,
} from "@/lib/constants";
import { addDays, startOfDay } from "@/lib/utils";

export interface RotationPeriod {
  index: number;
  memberId: MemberId;
  start: Date;
  end: Date;
}

export interface ResolveOptions {
  cadence: Cadence;
  startDate: Date;
  order: MemberId[];
  overrides: Record<number, MemberId>;
}

export function periodIndexForDate(date: Date, opts: { cadence: Cadence; startDate: Date }) {
  const days = Math.max(
    0,
    Math.floor((startOfDay(date).getTime() - startOfDay(opts.startDate).getTime()) / (1000 * 60 * 60 * 24))
  );
  return Math.floor(days / CADENCE_DAYS[opts.cadence]);
}

export function periodBounds(index: number, opts: { cadence: Cadence; startDate: Date }) {
  const length = CADENCE_DAYS[opts.cadence];
  const start = addDays(opts.startDate, index * length);
  const end = addDays(start, length - 1);
  return { start, end };
}

export function memberForPeriod(
  index: number,
  opts: Pick<ResolveOptions, "order" | "overrides">
): MemberId {
  if (opts.overrides[index]) return opts.overrides[index];
  const order = opts.order.length > 0 ? opts.order : MEMBERS.map((m) => m.id);
  const i = ((index % order.length) + order.length) % order.length;
  return order[i];
}

export function rotationForRange(opts: ResolveOptions & { from: Date; to: Date }): RotationPeriod[] {
  const startIdx = periodIndexForDate(opts.from, opts);
  const endIdx = periodIndexForDate(opts.to, opts);
  const periods: RotationPeriod[] = [];
  for (let i = startIdx; i <= endIdx; i++) {
    const { start, end } = periodBounds(i, opts);
    periods.push({
      index: i,
      memberId: memberForPeriod(i, opts),
      start,
      end,
    });
  }
  return periods;
}

export function currentAndUpcoming(opts: ResolveOptions, count = 4): RotationPeriod[] {
  const now = new Date();
  const currentIdx = periodIndexForDate(now, opts);
  const periods: RotationPeriod[] = [];
  for (let i = currentIdx; i < currentIdx + count; i++) {
    const { start, end } = periodBounds(i, opts);
    periods.push({
      index: i,
      memberId: memberForPeriod(i, opts),
      start,
      end,
    });
  }
  return periods;
}

export function defaultRotationOptions(): ResolveOptions {
  return {
    cadence: "weekly",
    startDate: ROTATION_EPOCH,
    order: MEMBERS.map((m) => m.id),
    overrides: {},
  };
}

export function distributionFromHistory(
  opts: ResolveOptions,
  lookbackPeriods: number
) {
  const now = new Date();
  const currentIdx = periodIndexForDate(now, opts);
  const counts: Record<MemberId, number> = {
    shubham: 0,
    sameer: 0,
    disha: 0,
    nikhil: 0,
    pooja: 0,
  };
  const start = Math.max(0, currentIdx - lookbackPeriods + 1);
  for (let i = start; i <= currentIdx; i++) {
    counts[memberForPeriod(i, opts)] += 1;
  }
  return counts;
}

export function fairnessScore(counts: Record<MemberId, number>) {
  const values = Object.values(counts);
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return 100;
  const ideal = total / values.length;
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - ideal, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const normalized = stdDev / Math.max(1, ideal);
  return Math.round(Math.max(0, Math.min(100, (1 - normalized) * 100)));
}
