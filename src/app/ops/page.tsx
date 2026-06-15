"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NoSSR } from "@/components/common/no-ssr";
import { OpsCard } from "@/components/ops/ops-card";
import { useOps } from "@/store/use-ops";
import { RotateCcw, Wand2 } from "lucide-react";
import { toast } from "sonner";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 rounded-lg shimmer" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-44 rounded-2xl shimmer" />
        ))}
      </div>
    </div>
  );
}

export default function OpsPage() {
  const metrics = useOps((s) => s.metrics);
  const setValue = useOps((s) => s.setValue);
  const reset = useOps((s) => s.reset);

  const avg = Math.round(metrics.reduce((a, b) => a + b.value, 0) / Math.max(1, metrics.length));
  const sentiment =
    avg >= 80 ? { label: "Living the dream", tone: "success" as const, color: "#34d399" } :
    avg >= 60 ? { label: "Cruising", tone: "cyan" as const, color: "#22d3ee" } :
    avg >= 40 ? { label: "Could use a top-up", tone: "warning" as const, color: "#fbbf24" } :
    { label: "Code red, stock up", tone: "danger" as const, color: "#f87171" };

  return (
    <NoSSR fallback={<Skeleton />}>
      <PageHeader
        eyebrow="House Ops Status"
        title="Live house telemetry"
        description="Fake (mostly) operational metrics so you know if the vibes need engineering attention."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                metrics.forEach((m) => setValue(m.id, Math.round(60 + Math.random() * 40)));
                toast.success("Status randomized");
              }}
            >
              <Wand2 className="h-4 w-4" /> Randomize
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                reset();
                toast("Reset to defaults");
              }}
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-5 sm:p-6 mb-6 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-30"
            style={{ background: sentiment.color }}
          />
          <div className="relative flex items-end justify-between flex-wrap gap-3">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45">
                Composite vibe score
              </div>
              <div className="mt-2 text-4xl font-semibold tracking-tight">
                <span style={{ color: sentiment.color }}>{avg}</span>
                <span className="text-white/35 text-xl">/100</span>
              </div>
              <Badge variant={sentiment.tone} className="mt-2">
                {sentiment.label}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-white/45">Tracking</div>
              <div className="text-lg font-semibold text-white">{metrics.length}</div>
              <div className="text-[11px] text-white/45">live indicators</div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {metrics.map((m, i) => (
          <OpsCard key={m.id} metric={m} delay={i * 0.04} />
        ))}
      </div>
    </NoSSR>
  );
}
