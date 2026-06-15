"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Pencil, Trash2, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContacts, type Contact } from "@/store/use-contacts";
import { ContactFormDialog } from "@/components/contacts/contact-form";
import { toast } from "sonner";

export function ContactCard({ contact, delay = 0 }: { contact: Contact; delay?: number }) {
  const remove = useContacts((s) => s.remove);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        layout
      >
        <Card className="p-5 h-full flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.08]">
                {contact.emoji ?? "📞"}
              </div>
              <div>
                <div className="text-[15px] font-semibold tracking-tight text-white">
                  {contact.name}
                </div>
                <Badge variant="outline" className="mt-1">
                  {contact.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(true)} aria-label="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Delete"
                onClick={() => {
                  const c = contact;
                  remove(c.id);
                  toast(`Deleted ${c.name}`, {
                    action: {
                      label: "Undo",
                      onClick: () => useContacts.getState().add({
                        name: c.name,
                        category: c.category,
                        phone: c.phone,
                        notes: c.notes,
                        emoji: c.emoji,
                      }),
                    },
                  });
                }}
              >
                <Trash2 className="h-3.5 w-3.5 text-[#fca5a5]" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Phone className="h-3.5 w-3.5 text-white/45" />
            <a
              href={contact.phone ? `tel:${contact.phone.replace(/\s+/g, "")}` : undefined}
              className="text-sm font-mono text-white/85 hover:text-white truncate"
            >
              {contact.phone || <span className="text-white/35 font-sans">No phone</span>}
            </a>
            {contact.phone && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contact.phone);
                  toast.success("Phone copied to clipboard");
                }}
                className="ml-auto text-white/45 hover:text-white"
                aria-label="Copy phone"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <p className="text-[13px] text-white/55 leading-relaxed flex-1">
            {contact.notes || <span className="text-white/30 italic">No notes.</span>}
          </p>
        </Card>
      </motion.div>
      <ContactFormDialog open={editing} onOpenChange={setEditing} initial={contact} />
    </>
  );
}
