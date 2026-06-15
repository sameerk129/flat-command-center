"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ClipboardCheck, CalendarRange } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { NoSSR } from "@/components/common/no-ssr";
import { DutyItem } from "@/components/runbook/duty-item";
import { DutyFormDialog } from "@/components/runbook/duty-form";
import { useRunbook } from "@/store/use-runbook";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 rounded-lg shimmer" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-72 rounded-2xl shimmer" />
        <div className="h-72 rounded-2xl shimmer" />
      </div>
    </div>
  );
}

export default function RunbookPage() {
  const duties = useRunbook((s) => s.duties);
  const [open, setOpen] = useState(false);

  const weekly = useMemo(() => duties.filter((d) => d.frequency === "weekly"), [duties]);
  const monthly = useMemo(() => duties.filter((d) => d.frequency === "monthly"), [duties]);
  const total = duties.length;
  const done = duties.filter((d) => d.done).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <NoSSR fallback={<Skeleton />}>
      <PageHeader
        eyebrow="Duty Runbook"
        title="Weekly & monthly checklist"
        description="A living runbook for the things the on-call SRE keeps an eye on. Like an incident playbook, but for the house."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> Add duty
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45">
                Overall progress
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-tight mt-1">
                <span className="gradient-text">{done}</span>
                <span className="text-white/45 text-base sm:text-lg"> / {total} duties complete</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary">Weekly · {weekly.filter((d) => d.done).length}/{weekly.length}</Badge>
              <Badge variant="cyan">Monthly · {monthly.filter((d) => d.done).length}/{monthly.length}</Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2.5" />
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        <Section
          title="Weekly Duties"
          icon={<CalendarRange className="h-4 w-4" />}
          duties={weekly}
        />
        <Section
          title="Monthly Duties"
          icon={<ClipboardCheck className="h-4 w-4" />}
          duties={monthly}
        />
      </div>

      <DutyFormDialog open={open} onOpenChange={setOpen} />
    </NoSSR>
  );
}

function Section({
  title,
  icon,
  duties,
}: {
  title: string;
  icon: React.ReactNode;
  duties: ReturnType<typeof useRunbook.getState>["duties"];
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-white/65">{icon}</span>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        </div>
        <Badge variant="outline">{duties.length}</Badge>
      </div>
      <div className="space-y-2">
        {duties.length === 0 && (
          <div className="text-center py-10 text-white/45 text-sm">
            Nothing here yet. Add a duty to get started.
          </div>
        )}
        {duties.map((d, i) => (
          <DutyItem key={d.id} duty={d} delay={i * 0.03} />
        ))}
      </div>
    </Card>
  );
}
