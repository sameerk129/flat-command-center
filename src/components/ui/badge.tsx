import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/[0.06] text-white/80",
        primary:
          "border-[var(--accent-purple)]/30 bg-[var(--accent-purple)]/12 text-[#d8b4fe]",
        cyan:
          "border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/12 text-[#a5f3fc]",
        success:
          "border-[var(--accent-emerald)]/30 bg-[var(--accent-emerald)]/12 text-[#86efac]",
        warning:
          "border-[var(--accent-amber)]/30 bg-[var(--accent-amber)]/12 text-[#fcd34d]",
        danger:
          "border-[var(--danger)]/30 bg-[var(--danger)]/12 text-[#fca5a5]",
        outline: "border-white/15 text-white/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
