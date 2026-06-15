"use client";

import { useState } from "react";
import { ArrowRightLeft, RotateCcw, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRotation, useResolvedRotation } from "@/store/use-rotation";
import { currentAndUpcoming, memberForPeriod, periodBounds } from "@/lib/rotation";
import { MEMBERS, memberById } from "@/lib/constants";
import { MemberAvatar } from "@/components/common/member-avatar";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export function ManualOverride() {
  const opts = useResolvedRotation();
  const swapPeriods = useRotation((s) => s.swapPeriods);
  const setOverride = useRotation((s) => s.setOverride);
  const clearOverride = useRotation((s) => s.clearOverride);
  const overrides = useRotation((s) => s.overrides);

  const periods = currentAndUpcoming(opts, 6);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const onDragStart = (periodIdx: number) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/period", String(periodIdx));
    setDraggingIdx(periodIdx);
  };
  const onDragOver = (periodIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setHoverIdx(periodIdx);
  };
  const onDrop = (periodIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/period"));
    setDraggingIdx(null);
    setHoverIdx(null);
    if (Number.isNaN(from) || from === periodIdx) return;
    const a = memberById(memberForPeriod(from, opts)).name;
    const b = memberById(memberForPeriod(periodIdx, opts)).name;
    swapPeriods(from, periodIdx);
    toast.success(`Swapped ${a} ↔ ${b}`, {
      action: {
        label: "Undo",
        onClick: () => {
          swapPeriods(from, periodIdx);
          toast("Reverted swap");
        },
      },
    });
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45 flex items-center gap-1.5">
            <ArrowRightLeft className="h-3 w-3" /> Manual Override
          </div>
          <div className="text-lg font-semibold tracking-tight mt-1">
            Drag a card onto another to swap
          </div>
          <p className="text-[11px] text-white/45 mt-0.5">
            Useful when someone is travelling, sick, or trading favors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {periods.map((p) => {
          const m = memberById(p.memberId);
          const isOverridden = overrides[p.index] !== undefined;
          const { start, end } = periodBounds(p.index, opts);
          const isDragging = draggingIdx === p.index;
          const isHover = hoverIdx === p.index && draggingIdx !== null && draggingIdx !== p.index;

          return (
            <div
              key={p.index}
              draggable
              onDragStart={onDragStart(p.index)}
              onDragOver={onDragOver(p.index)}
              onDrop={onDrop(p.index)}
              onDragLeave={() => setHoverIdx(null)}
              onDragEnd={() => {
                setDraggingIdx(null);
                setHoverIdx(null);
              }}
              className={cn(
                "relative rounded-2xl border p-4 cursor-grab active:cursor-grabbing transition-all",
                "bg-white/[0.025] border-white/[0.08]",
                isDragging && "opacity-50 scale-[0.97]",
                isHover && "border-[#a855f7]/50 ring-2 ring-[#a855f7]/25 bg-[#a855f7]/8"
              )}
              style={{
                boxShadow: `inset 3px 0 0 0 ${m.color}`,
                transition: "transform 200ms cubic-bezier(.2,.7,.2,1), box-shadow 200ms, border-color 200ms",
              }}
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">
                  Period #{p.index + 1}
                </Badge>
                {isOverridden && (
                  <button
                    onClick={() => {
                      clearOverride(p.index);
                      toast("Override cleared");
                    }}
                    className="text-[10px] text-[#fca5a5] hover:text-white inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <MemberAvatar id={m.id} size="md" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{m.name}</div>
                  <div className="text-[11px] text-white/45">
                    {formatDate(start, { month: "short", day: "numeric" })} →{" "}
                    {formatDate(end, { month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-white/35 inline-flex items-center gap-1.5">
                  <span className="text-white/45">Swap with</span>
                  <select
                    onChange={(e) => {
                      const targetMember = e.target.value as (typeof MEMBERS)[number]["id"];
                      if (!targetMember) return;
                      setOverride(p.index, targetMember);
                      toast.success(`Assigned ${memberById(targetMember).name} to this period`);
                      e.currentTarget.value = "";
                    }}
                    defaultValue=""
                    className="bg-white/[0.06] border border-white/10 rounded-md text-[10px] px-1.5 py-0.5 text-white/85"
                  >
                    <option value="" disabled>
                      pick…
                    </option>
                    {MEMBERS.map((mm) => (
                      <option key={mm.id} value={mm.id}>
                        {mm.name}
                      </option>
                    ))}
                  </select>
                </span>
                {isOverridden ? (
                  <Badge variant="primary" className="text-[10px]">
                    <RotateCcw className="h-3 w-3" /> Override
                  </Badge>
                ) : (
                  <span className="text-[10px] text-white/35">Default</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
