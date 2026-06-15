"use client";

import { PageHeader } from "@/components/common/page-header";
import { RotationCalendar } from "@/components/rotation/calendar";
import { RotationConfig } from "@/components/rotation/config";
import { ManualOverride } from "@/components/rotation/manual-override";
import { NoSSR } from "@/components/common/no-ssr";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 rounded-lg shimmer" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <div className="h-[520px] rounded-2xl shimmer" />
        <div className="h-[520px] rounded-2xl shimmer" />
      </div>
      <div className="h-72 rounded-2xl shimmer" />
    </div>
  );
}

export default function RotationPage() {
  return (
    <NoSSR fallback={<Skeleton />}>
      <PageHeader
        eyebrow="Rotation Planner"
        title="Who's on next?"
        description="Visualize the rotation, tweak the cadence, and drag-and-drop to swap weeks between roommates."
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-6">
        <RotationCalendar />
        <RotationConfig />
      </div>
      <ManualOverride />
    </NoSSR>
  );
}
