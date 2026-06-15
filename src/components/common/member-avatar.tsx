"use client";

import { memberById, type MemberId } from "@/lib/constants";
import { initialsOf, cn } from "@/lib/utils";

const sizes = {
  xs: "h-7 w-7 text-[10px] rounded-lg",
  sm: "h-9 w-9 text-xs rounded-xl",
  md: "h-12 w-12 text-sm rounded-2xl",
  lg: "h-16 w-16 text-base rounded-2xl",
  xl: "h-24 w-24 text-2xl rounded-3xl",
};

export function MemberAvatar({
  id,
  size = "md",
  ring = false,
  pulse = false,
  className,
}: {
  id: MemberId;
  size?: keyof typeof sizes;
  ring?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  const m = memberById(id);
  return (
    <div
      aria-label={m.name}
      className={cn(
        "relative shrink-0 flex items-center justify-center font-semibold text-white shadow-inner",
        "ring-1 ring-white/[0.08]",
        ring && "ring-2 ring-offset-2 ring-offset-[#0a0a10]",
        ring && m.ring,
        pulse && "pulse-ring",
        sizes[size],
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${m.color} 0%, ${m.color}AA 50%, ${m.color}66 100%)`,
      }}
    >
      <span className="relative drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        {initialsOf(m.name)}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 rounded-[inherit] opacity-50 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 50%)",
        }}
      />
    </div>
  );
}
