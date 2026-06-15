"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ShieldAlert, NotebookPen, Save, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberAvatar } from "@/components/common/member-avatar";
import { useMembers, type MemberProfile } from "@/store/use-members";
import { memberById } from "@/lib/constants";
import { toast } from "sonner";

export function ProfileCard({ profile, delay = 0 }: { profile: MemberProfile; delay?: number }) {
  const update = useMembers((s) => s.updateMember);
  const m = memberById(profile.id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  function save() {
    update(profile.id, draft);
    setEditing(false);
    toast.success(`${draft.name} updated`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="relative p-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-28 opacity-70"
          style={{
            background: `linear-gradient(135deg, ${m.color}55 0%, ${m.color}22 40%, transparent 80%)`,
          }}
        />
        <div aria-hidden className="absolute -top-12 -right-10 h-32 w-32 rounded-full blur-3xl opacity-40" style={{ background: m.color }} />

        <div className="relative px-5 sm:px-6 pt-6 pb-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <MemberAvatar id={profile.id} size="lg" ring />
              <div>
                <div className="text-lg font-semibold text-white tracking-tight">
                  {profile.name}
                </div>
                <div className="text-xs text-white/55 mt-0.5">{profile.role}</div>
                <div className="mt-1.5">
                  <Badge variant="primary" className="text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
                    {m.id}
                  </Badge>
                </div>
              </div>
            </div>
            {!editing ? (
              <Button size="sm" variant="secondary" onClick={() => { setDraft(profile); setEditing(true); }}>
                <NotebookPen className="h-3.5 w-3.5" /> Edit
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  <X className="h-3.5 w-3.5" /> Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={save}>
                  <Save className="h-3.5 w-3.5" /> Save
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <Field
              label="Phone"
              icon={<Phone className="h-3.5 w-3.5" />}
              value={profile.phone}
              draft={draft.phone}
              editing={editing}
              placeholder="+91 99999 99999"
              onChange={(v) => setDraft({ ...draft, phone: v })}
            />
            <Field
              label="Emergency Contact"
              icon={<ShieldAlert className="h-3.5 w-3.5" />}
              value={profile.emergencyContact}
              draft={draft.emergencyContact}
              editing={editing}
              placeholder="Parent / sibling number"
              onChange={(v) => setDraft({ ...draft, emergencyContact: v })}
            />
            <div>
              <Label className="mb-1.5 flex items-center gap-1.5">
                <NotebookPen className="h-3 w-3" /> Notes
              </Label>
              {editing ? (
                <Textarea
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  placeholder="Allergies, quirks, dietary preferences, fun facts…"
                  rows={3}
                />
              ) : (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white/75 min-h-[60px] whitespace-pre-wrap">
                  {profile.notes || (
                    <span className="text-white/35">No notes yet — click edit to add some.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Field({
  label,
  icon,
  value,
  draft,
  editing,
  placeholder,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  draft: string;
  editing: boolean;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 flex items-center gap-1.5">{icon} {label}</Label>
      {editing ? (
        <Input value={draft} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white/75 font-mono">
          {value || <span className="text-white/35 font-sans">Not set</span>}
        </div>
      )}
    </div>
  );
}
