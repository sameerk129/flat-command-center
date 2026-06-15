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
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-30">
      <div className="glass-elevated rounded-2xl px-1.5 py-1.5 flex items-center justify-between">
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
                "relative flex-1 flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-xl text-[10px] font-medium transition-colors",
                active ? "text-white" : "text-white/55"
              )}
            >
              {active && (
                <motion.span
                  layoutId="bottom-active"
                  className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.10]"
                  transition={{ type: "spring", damping: 22, stiffness: 300 }}
                />
              )}
              <Icon className={cn("relative h-[18px] w-[18px]", active && "text-[#c4b5fd]")} />
              <span className="relative">{item.short}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
