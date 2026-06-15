"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Repeat, CalendarClock, Save, Undo2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRotation } from "@/store/use-rotation";
import { type Cadence, MEMBERS } from "@/lib/constants";
import { MemberAvatar } from "@/components/common/member-avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CADENCE_OPTIONS: { id: Cadence; label: string; hint: string }[] = [
  { id: "weekly", label: "Weekly", hint: "7 day cycles" },
  { id: "biweekly", label: "Bi-weekly", hint: "14 day cycles" },
  { id: "monthly", label: "Monthly", hint: "30 day cycles" },
];

export function RotationConfig() {
  const cadence = useRotation((s) => s.cadence);
  const setCadence = useRotation((s) => s.setCadence);
  const startDateISO = useRotation((s) => s.startDateISO);
  const setStartDate = useRotation((s) => s.setStartDate);
  const order = useRotation((s) => s.order);
  const setOrder = useRotation((s) => s.setOrder);
  const reset = useRotation((s) => s.reset);

  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const onDragStart = (idx: number) => setDraggingIdx(idx);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (idx: number) => {
    if (draggingIdx === null || draggingIdx === idx) return;
    const next = [...order];
    const [moved] = next.splice(draggingIdx, 1);
    next.splice(idx, 0, moved);
    setOrder(next);
    setDraggingIdx(null);
    toast.success("Rotation order updated");
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-5 gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45 flex items-center gap-1.5">
            <Repeat className="h-3 w-3 shrink-0" />
            <span className="truncate">Rotation Configuration</span>
          </div>
          <div className="text-base sm:text-lg font-semibold tracking-tight mt-0.5 sm:mt-1">
            Cadence & order
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            reset();
            toast.success("Rotation reset to defaults");
          }}
        >
          <Undo2 className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="mb-2 block">Cadence</Label>
          <div className="grid grid-cols-3 gap-2">
            {CADENCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setCadence(opt.id);
                  toast.success(`Switched to ${opt.label.toLowerCase()} rotation`);
                }}
                className={cn(
                  "relative rounded-xl border p-3 text-left transition-all",
                  cadence === opt.id
                    ? "border-[#a855f7]/40 bg-[#a855f7]/8"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14]"
                )}
              >
                <div className="text-sm font-medium text-white">{opt.label}</div>
                <div className="text-[11px] text-white/45 mt-0.5">{opt.hint}</div>
                {cadence === opt.id && (
                  <motion.span
                    layoutId="cadence-pill"
                    className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_2px_rgba(168,85,247,0.55)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block flex items-center gap-1.5">
            <CalendarClock className="h-3 w-3" /> Rotation start date
          </Label>
          <Input
            type="date"
            value={new Date(startDateISO).toISOString().slice(0, 10)}
            onChange={(e) => {
              const d = new Date(e.target.value);
              if (!isNaN(d.getTime())) setStartDate(d);
            }}
          />
          <p className="mt-1.5 text-[11px] text-white/40">
            The first period in the rotation begins on this date.
          </p>
        </div>

        <div>
          <Label className="mb-2 block">Order — drag to reorder</Label>
          <ul className="space-y-1.5">
            {order.map((id, idx) => {
              const m = MEMBERS.find((x) => x.id === id)!;
              return (
                <li
                  key={id}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(idx)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl border bg-white/[0.025] cursor-grab active:cursor-grabbing transition-all",
                    draggingIdx === idx
                      ? "border-[#a855f7]/40 ring-2 ring-[#a855f7]/20 opacity-80"
                      : "border-white/[0.08] hover:border-white/[0.14]"
                  )}
                >
                  <span className="text-xs font-mono text-white/40 w-5">
                    {idx + 1}.
                  </span>
                  <MemberAvatar id={m.id} size="xs" />
                  <span className="text-sm text-white/85 flex-1">{m.name}</span>
                  <span className="text-[10px] text-white/35">{m.role}</span>
                  <span className="text-white/30">⋮⋮</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[11px] text-white/40 flex items-center gap-1.5">
            <Save className="h-3 w-3" /> Order saves automatically and persists locally.
          </p>
        </div>
      </div>
    </Card>
  );
}
