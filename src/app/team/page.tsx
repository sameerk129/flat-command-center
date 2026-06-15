"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/team/profile-card";
import { NoSSR } from "@/components/common/no-ssr";
import { useMembers } from "@/store/use-members";

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 rounded-lg shimmer" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-72 rounded-2xl shimmer" />
        ))}
      </div>
    </div>
  );
}

export default function TeamPage() {
  const members = useMembers((s) => s.members);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      members.filter((m) => {
        const q = query.toLowerCase().trim();
        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.phone.toLowerCase().includes(q) ||
          m.notes.toLowerCase().includes(q)
        );
      }),
    [members, query]
  );

  return (
    <NoSSR fallback={<Skeleton />}>
      <PageHeader
        eyebrow="Team Directory"
        title="The 2164 crew"
        description="Quick access to phones, emergency contacts, and personal notes. Everything edits inline and saves locally."
        actions={
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members…"
              className="pl-9 w-full"
            />
          </div>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {filtered.map((m, i) => (
          <ProfileCard key={m.id} profile={m} delay={i * 0.04} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-white/45">
            No teammates match that search.
          </div>
        )}
      </div>
    </NoSSR>
  );
}
