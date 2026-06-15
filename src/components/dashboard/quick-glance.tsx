"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ClipboardCheck, PhoneCall, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRunbook } from "@/store/use-runbook";
import { useContacts } from "@/store/use-contacts";
import { useOps } from "@/store/use-ops";

export function QuickGlance() {
  const duties = useRunbook((s) => s.duties);
  const contacts = useContacts((s) => s.contacts);
  const metrics = useOps((s) => s.metrics);

  const dutiesPending = duties.filter((d) => !d.done).length;
  const dutiesDone = duties.length - dutiesPending;
  const opsAvg =
    metrics.length > 0
      ? Math.round(metrics.reduce((a, b) => a + b.value, 0) / metrics.length)
      : 0;

  const tiles = [
    {
      href: "/runbook",
      label: "Runbook progress",
      value: `${dutiesDone}/${duties.length}`,
      hint: dutiesPending > 0 ? `${dutiesPending} duties still open` : "All duties checked off",
      icon: <ClipboardCheck className="h-4 w-4" />,
      progress: duties.length ? (dutiesDone / duties.length) * 100 : 0,
    },
    {
      href: "/contacts",
      label: "Important contacts",
      value: contacts.length.toString(),
      hint: "Plumber, hospital, owner & more",
      icon: <PhoneCall className="h-4 w-4" />,
      progress: Math.min(100, contacts.length * 8),
    },
    {
      href: "/ops",
      label: "House ops health",
      value: `${opsAvg}%`,
      hint: opsAvg > 80 ? "Vibes are excellent" : opsAvg > 60 ? "Stable, with watch items" : "Needs attention",
      icon: <Activity className="h-4 w-4" />,
      progress: opsAvg,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
      {tiles.map((t, i) => (
        <motion.div
          key={t.href}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i + 0.1 }}
        >
          <Link href={t.href as never} className="block">
            <Card className="p-5 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/45">
                  <span className="text-white/65">{t.icon}</span>
                  {t.label}
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-white/80 transition" />
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{t.value}</div>
              <div className="mt-1 text-[12px] text-white/50">{t.hint}</div>
              <div className="mt-4 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${t.progress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#a855f7] via-[#6366f1] to-[#22d3ee]"
                />
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
