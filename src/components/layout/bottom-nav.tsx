"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/nav-config";

const PRIMARY = ["/", "/rotation", "/team", "/contacts", "/runbook"];

export function BottomNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((n) => PRIMARY.includes(n.href));

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pt-2"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
    >
      <div className="glass-elevated rounded-2xl px-1 py-1 sm:px-1.5 sm:py-1.5 flex items-center justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-xl text-[10px] font-medium transition-colors",
                active ? "text-white" : "text-white/55"
              )}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="bottom-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.10]"
                  transition={{ type: "spring", damping: 22, stiffness: 300 }}
                />
              )}
              <Icon
                className={cn(
                  "relative h-[18px] w-[18px] shrink-0",
                  active && "text-[#c4b5fd]"
                )}
              />
              <span className="relative truncate max-w-full">{item.short}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
