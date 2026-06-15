"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRunbook, type Duty, type DutyFrequency } from "@/store/use-runbook";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DutyFormDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Duty;
}) {
  const add = useRunbook((s) => s.add);
  const update = useRunbook((s) => s.update);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [frequency, setFrequency] = useState<DutyFrequency>(initial?.frequency ?? "weekly");
  const [dueDate, setDueDate] = useState<string>(initial?.dueDate ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "✅");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }
    if (initial) {
      update(initial.id, { title, frequency, dueDate: dueDate || null, notes, emoji });
      toast.success("Duty updated");
    } else {
      add({ title, frequency, dueDate: dueDate || null, notes, emoji });
      toast.success("Duty added");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit duty" : "New duty"}</DialogTitle>
          <DialogDescription>
            Add a recurring task with optional due date and notes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-3 items-start">
            <div>
              <Label className="mb-1.5 block">Emoji</Label>
              <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={3} className="text-center" />
            </div>
            <div>
              <Label className="mb-1.5 block">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Garbage drop-off" autoFocus />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block">Frequency</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["weekly", "monthly"] as DutyFrequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={cn(
                    "rounded-xl border p-2.5 text-sm capitalize transition",
                    frequency === f
                      ? "border-[#a855f7]/40 bg-[#a855f7]/10 text-white"
                      : "border-white/[0.08] bg-white/[0.02] text-white/65 hover:text-white"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block">Due date (optional)</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Specific instructions, recurring details…" rows={3} />
          </div>
          <DialogFooter className="!mt-5">
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="primary">
              {initial ? "Save" : "Add duty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
