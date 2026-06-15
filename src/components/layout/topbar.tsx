"use client";

import { Command } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { useUI } from "@/store/use-ui";
import { useResolvedRotation } from "@/store/use-rotation";
import { currentAndUpcoming } from "@/lib/rotation";
import { memberById } from "@/lib/constants";
import { initialsOf } from "@/lib/utils";
import { useMounted } from "@/components/common/no-ssr";

export function Topbar() {
  const setCommandOpen = useUI((s) => s.setCommandOpen);
  const opts = useResolvedRotation();
  const [current] = currentAndUpcoming(opts, 1);
  const mounted = useMounted();
  const m = mounted && current ? memberById(current.memberId) : null;

  return (
    <header
      className="lg:hidden sticky top-0 z-20 px-4 pb-2 backdrop-blur-2xl bg-black/40 border-b border-white/[0.06]"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <Logo />
        <div className="flex items-center gap-1.5 min-w-0">
          {m && (
            <div className="flex items-center gap-1.5 h-9 px-1.5 rounded-xl border border-white/10 bg-white/[0.04] min-w-0">
              <div
                className="h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}AA)` }}
              >
                {initialsOf(m.name)}
              </div>
              <span className="text-xs text-white/80 pr-1 truncate max-w-[88px]">
                {m.name.split(" ")[0]}
              </span>
            </div>
          )}
          <button
            onClick={() => setCommandOpen(true)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:text-white shrink-0"
            aria-label="Open command palette"
          >
            <Command className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
