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
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useContacts, type Contact } from "@/store/use-contacts";
import { toast } from "sonner";

const EMOJIS = ["📞", "🔧", "💡", "🧺", "🛡️", "💧", "🔥", "📶", "🏠", "🏥", "💊", "🍕", "🚕", "🍷", "🛠️"];

export function ContactFormDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Contact;
}) {
  const add = useContacts((s) => s.add);
  const update = useContacts((s) => s.update);

  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Repairs");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "📞");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (initial) {
      update(initial.id, { name, category, phone, notes, emoji });
      toast.success(`${name} updated`);
    } else {
      add({ name, category, phone, notes, emoji });
      toast.success(`${name} added`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit contact" : "Add contact"}</DialogTitle>
          <DialogDescription>
            Saved locally to this browser. No account or backend needed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div>
              <Label className="mb-1.5 block">Icon</Label>
              <div className="flex flex-wrap gap-1.5 w-[110px]">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`h-7 w-7 rounded-md border text-sm flex items-center justify-center transition ${
                      emoji === e
                        ? "border-[#a855f7]/60 bg-[#a855f7]/15"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="mb-1.5 block">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electrician" autoFocus />
              </div>
              <div>
                <Label className="mb-1.5 block">Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Repairs, Utilities, Emergency…" />
              </div>
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block">Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999" />
          </div>
          <div>
            <Label className="mb-1.5 block">Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Working hours, special instructions, address…" rows={3} />
          </div>
          <DialogFooter className="!mt-5">
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="primary">
              {initial ? "Save changes" : "Add contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
