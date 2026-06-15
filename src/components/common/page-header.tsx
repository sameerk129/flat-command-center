"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-6 lg:mb-8",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_2px_rgba(168,85,247,0.55)]" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold tracking-tight leading-[1.1]">
          <span className="gradient-text">{title}</span>
        </h1>
        {description && (
          <p className="mt-2 text-sm sm:text-[15px] text-white/55 max-w-[60ch]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </motion.div>
  );
}
