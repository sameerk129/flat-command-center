"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useEasterEgg } from "@/components/easter-egg";

export function Logo({ collapsed = false, className }: { collapsed?: boolean; className?: string }) {
  const trigger = useEasterEgg((s) => s.trigger);
  const [clicks, setClicks] = useState<number[]>([]);

  function handleClick() {
    const now = Date.now();
    const recent = [...clicks.filter((t) => now - t < 2000), now];
    setClicks(recent);
    if (recent.length >= 5) {
      trigger();
      setClicks([]);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-2.5 select-none rounded-xl px-1.5 py-1 hover:bg-white/[0.04] transition",
        className
      )}
      aria-label="2164 Command Center logo"
    >
      <div className="relative h-9 w-9 shrink-0">
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#a855f7] via-[#6366f1] to-[#22d3ee] shadow-[0_8px_30px_-8px_rgba(168,85,247,0.6)]"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <div className="absolute inset-[1.5px] rounded-[10px] bg-[#0a0a10] flex items-center justify-center">
          <span className="text-[11px] font-bold tracking-tight gradient-text">
            21
            <br />
            64
          </span>
        </div>
        <div aria-hidden className="absolute -inset-1 rounded-2xl bg-[#a855f7]/20 blur-xl opacity-60 group-hover:opacity-100 transition" />
      </div>
      {!collapsed && (
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[13px] font-semibold tracking-tight text-white">2164</span>
          <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/45">
            Command Center
          </span>
        </div>
      )}
    </button>
  );
}
