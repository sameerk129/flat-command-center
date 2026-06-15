"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  ArrowRight,
  Users as UsersIcon,
  PhoneCall,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useUI } from "@/store/use-ui";
import { useMembers } from "@/store/use-members";
import { useContacts } from "@/store/use-contacts";
import { useRotation } from "@/store/use-rotation";
import { NAV_ITEMS } from "@/components/layout/nav-config";
import { useEasterEgg } from "@/components/easter-egg";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const open = useUI((s) => s.commandOpen);
  const setOpen = useUI((s) => s.setCommandOpen);
  const router = useRouter();
  const members = useMembers((s) => s.members);
  const contacts = useContacts((s) => s.contacts);
  const resetRotation = useRotation((s) => s.reset);
  const trigger = useEasterEgg((s) => s.trigger);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const run = (fn: () => void) => () => {
    fn();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[8vh] sm:pt-[12vh] px-3 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="relative w-full max-w-xl glass-elevated rounded-2xl shadow-2xl overflow-hidden gradient-border"
          >
            <Command label="Command palette" className="flex flex-col">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <Search className="h-4 w-4 text-white/40" />
                <Command.Input
                  autoFocus
                  placeholder="Search members, contacts, pages, actions…"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40 py-1"
                />
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-white/55">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-[65dvh] sm:max-h-[60vh] overflow-y-auto overscroll-contain p-2">
                <Command.Empty className="px-3 py-8 text-center text-sm text-white/45">
                  No matches. Try a different search.
                </Command.Empty>

                <Command.Group
                  heading="Navigate"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-white/40"
                >
                  {NAV_ITEMS.map((item) => (
                    <Command.Item
                      key={item.href}
                      value={`go ${item.label} ${item.short} ${item.description}`}
                      onSelect={run(() => router.push(item.href as never))}
                      className="group flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-white/75 cursor-pointer data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white"
                    >
                      <item.icon className="h-4 w-4 text-white/55 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="hidden sm:inline text-[11px] text-white/40 truncate max-w-[200px]">
                        {item.description}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/30 opacity-0 group-data-[selected=true]:opacity-100 shrink-0" />
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Members"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-white/40"
                >
                  {members.map((m) => (
                    <Command.Item
                      key={m.id}
                      value={`member ${m.name} ${m.role} ${m.phone}`}
                      onSelect={run(() => router.push("/team" as never))}
                      className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-white/75 cursor-pointer data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white"
                    >
                      <UsersIcon className="h-4 w-4 text-white/55" />
                      <span className="flex-1">{m.name}</span>
                      <span className="text-[11px] text-white/40">{m.role}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Contacts"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-white/40"
                >
                  {contacts.slice(0, 10).map((c) => (
                    <Command.Item
                      key={c.id}
                      value={`contact ${c.name} ${c.category} ${c.phone}`}
                      onSelect={run(() => router.push("/contacts" as never))}
                      className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-white/75 cursor-pointer data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white"
                    >
                      <PhoneCall className="h-4 w-4 text-white/55" />
                      <span className="flex-1">{c.name}</span>
                      <span className="text-[11px] text-white/40">{c.category}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Quick actions"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-white/40"
                >
                  <Command.Item
                    value="action reset rotation"
                    onSelect={run(() => resetRotation())}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-white/75 cursor-pointer data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white"
                  >
                    <RotateCcw className="h-4 w-4 text-white/55" />
                    <span className="flex-1">Reset rotation to defaults</span>
                  </Command.Item>
                  <Command.Item
                    value="action confetti easter egg"
                    onSelect={run(() => trigger())}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-white/75 cursor-pointer data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white"
                  >
                    <Sparkles className="h-4 w-4 text-white/55" />
                    <span className="flex-1">Launch confetti</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
              <div className="flex items-center justify-between gap-4 px-3 py-2 border-t border-white/[0.06] text-[11px] text-white/45">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="font-mono">↑↓</kbd> navigate
                  </span>
                  <span>
                    <kbd className="font-mono">↵</kbd> select
                  </span>
                </div>
                <span>2164 · Command Center</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
