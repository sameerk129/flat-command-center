"use client";

import { PageHeader } from "@/components/common/page-header";
import { DistributionChart } from "@/components/analytics/distribution-chart";
import { FairnessMeter } from "@/components/analytics/fairness-meter";
import { RotationHistory } from "@/components/analytics/rotation-history";
import { NoSSR } from "@/components/common/no-ssr";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 rounded-lg shimmer" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-80 rounded-2xl shimmer" />
        <div className="h-80 rounded-2xl shimmer" />
      </div>
      <div className="h-96 rounded-2xl shimmer" />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <NoSSR fallback={<Skeleton />}>
      <PageHeader
        eyebrow="Analytics"
        title="House on-call insights"
        description="How even is the rotation? Who has been carrying the torch lately? Look at the receipts."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-5 lg:mb-6">
        <DistributionChart />
        <FairnessMeter />
      </div>
      <RotationHistory />
    </NoSSR>
  );
}
