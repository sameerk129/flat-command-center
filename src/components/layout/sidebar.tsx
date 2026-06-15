"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/nav-config";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Command, Sparkles } from "lucide-react";
import { useUI } from "@/store/use-ui";

export function Sidebar() {
  const pathname = usePathname();
  const setCommandOpen = useUI((s) => s.setCommandOpen);

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-[260px] flex-col border-r border-white/[0.06] bg-black/30 backdrop-blur-2xl z-30">
      <div className="px-5 pt-5">
        <Logo />
      </div>

      <button
        onClick={() => setCommandOpen(true)}
        className="mx-4 mt-6 group flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition px-3 py-2 text-sm text-white/55"
      >
        <Command className="h-4 w-4" />
        <span className="flex-1 text-left">Quick search…</span>
        <kbd className="text-[10px] font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-white/55">
          ⌘K
        </kbd>
      </button>

      <nav className="mt-6 px-3 flex-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/35">
          Workspace
        </div>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    active
                      ? "text-white bg-white/[0.06]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#a855f7]/12 to-transparent border border-[#a855f7]/20"
                      transition={{ type: "spring", damping: 22, stiffness: 280 }}
                    />
                  )}
                  <Icon className={cn("relative h-4 w-4 shrink-0", active && "text-[#c4b5fd]")} />
                  <span className="relative flex-1 truncate">{item.label}</span>
                  {active && (
                    <span className="relative h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_10px_2px_rgba(168,85,247,0.6)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-4 bg-gradient-to-br from-[#a855f7]/10 via-[#6366f1]/8 to-[#22d3ee]/8">
          <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#a855f7]/30 blur-2xl" />
          <div className="relative flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60">
            <Sparkles className="h-3 w-3" /> Pro tip
          </div>
          <p className="relative mt-2 text-[13px] text-white/75 leading-relaxed">
            Click the logo five times for a small surprise.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="relative mt-3 w-full"
            onClick={() => setCommandOpen(true)}
          >
            Open command palette
          </Button>
        </div>
      </div>
    </aside>
  );
}
