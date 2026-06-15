"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { CurrentOnCallCard } from "@/components/dashboard/current-oncall";
import { UpcomingTimeline } from "@/components/dashboard/upcoming-timeline";
import { HouseStatus } from "@/components/dashboard/house-status";
import { QuickGlance } from "@/components/dashboard/quick-glance";
import { NoSSR } from "@/components/common/no-ssr";
import { useUI } from "@/store/use-ui";
import { Command } from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 rounded-lg shimmer" />
      <div className="h-60 rounded-3xl shimmer" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl shimmer" />
        ))}
      </div>
      <div className="h-48 rounded-2xl shimmer" />
    </div>
  );
}

export default function DashboardPage() {
  const setCommandOpen = useUI((s) => s.setCommandOpen);
  return (
    <NoSSR fallback={<DashboardSkeleton />}>
      <PageHeader
        eyebrow="2164 · Mission Control"
        title="Dashboard"
        description="See who's on duty, what's next, and how the house is feeling today."
        actions={
          <Button variant="secondary" onClick={() => setCommandOpen(true)}>
            <Command className="h-4 w-4" /> Quick search
            <kbd className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
              ⌘K
            </kbd>
          </Button>
        }
      />

      <div className="space-y-6 lg:space-y-8">
        <CurrentOnCallCard />
        <HouseStatus />
        <UpcomingTimeline />
        <QuickGlance />
      </div>
    </NoSSR>
  );
}
