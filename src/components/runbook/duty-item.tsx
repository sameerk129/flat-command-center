"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRunbook, type Duty } from "@/store/use-runbook";
import { cn, formatDate } from "@/lib/utils";
import { DutyFormDialog } from "@/components/runbook/duty-form";
import { toast } from "sonner";

export function DutyItem({ duty, delay = 0 }: { duty: Duty; delay?: number }) {
  const toggle = useRunbook((s) => s.toggle);
  const remove = useRunbook((s) => s.remove);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={cn(
          "group flex items-start gap-3 px-4 py-3.5 rounded-xl border bg-white/[0.025] hover:border-white/[0.14] transition-all",
          duty.done
            ? "border-emerald-400/15 bg-emerald-400/[0.04]"
            : "border-white/[0.06]"
        )}
      >
        <Checkbox
          checked={duty.done}
          onCheckedChange={() => {
            toggle(duty.id);
            if (!duty.done) toast.success(`Nice — “${duty.title}” checked off`);
          }}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base shrink-0">{duty.emoji}</span>
            <span
              className={cn(
                "text-sm font-medium",
                duty.done ? "line-through text-white/40" : "text-white"
              )}
            >
              {duty.title}
            </span>
            <Badge variant={duty.frequency === "weekly" ? "primary" : "cyan"} className="text-[10px]">
              {duty.frequency}
            </Badge>
            {duty.dueDate && (
              <Badge variant="warning" className="text-[10px]">
                <CalendarDays className="h-3 w-3" />
                {formatDate(duty.dueDate, { month: "short", day: "numeric" })}
              </Badge>
            )}
          </div>
          {duty.notes && (
            <p className={cn(
              "mt-1 text-[12px] leading-relaxed",
              duty.done ? "text-white/30" : "text-white/55"
            )}>
              {duty.notes}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <Button size="icon" variant="ghost" onClick={() => setEditing(true)} aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Delete"
            onClick={() => {
              const d = duty;
              remove(duty.id);
              toast(`Removed “${d.title}”`, {
                action: {
                  label: "Undo",
                  onClick: () =>
                    useRunbook.getState().add({
                      title: d.title,
                      frequency: d.frequency,
                      notes: d.notes,
                      dueDate: d.dueDate,
                      emoji: d.emoji,
                    }),
                },
              });
            }}
          >
            <Trash2 className="h-3.5 w-3.5 text-[#fca5a5]" />
          </Button>
        </div>
      </motion.div>
      <DutyFormDialog open={editing} onOpenChange={setEditing} initial={duty} />
    </>
  );
}
