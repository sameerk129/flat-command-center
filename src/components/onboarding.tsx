"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CalendarRange, ClipboardCheck, Rocket } from "lucide-react";
import { useUI } from "@/store/use-ui";
import { Button } from "@/components/ui/button";
import { MEMBERS } from "@/lib/constants";
import { initialsOf } from "@/lib/utils";
import { useMounted } from "@/components/common/no-ssr";

const STEPS = [
  {
    icon: Rocket,
    title: "Welcome to 2164 Command Center",
    body: "Your house on-call rotation, contacts, and runbook — all in one premium control center. Lovingly engineered for the inhabitants of flat 2164.",
  },
  {
    icon: CalendarRange,
    title: "Fair, transparent rotations",
    body: "Pick weekly, bi-weekly, or monthly cadence. Swap weeks with a drag, and let everyone see who is on duty at a glance.",
  },
  {
    icon: ClipboardCheck,
    title: "Runbook & contacts, ready when you need them",
    body: "Plumber acting up? Maggi running low? Find every important contact and weekly checklist in two clicks.",
  },
  {
    icon: Sparkles,
    title: "Press ⌘K to fly through the app",
    body: "Open the command palette to navigate, search members, jump to contacts, or trigger quick actions.",
  },
];

export function Onboarding() {
  const hasOnboarded = useUI((s) => s.hasOnboarded);
  const setOnboarded = useUI((s) => s.setOnboarded);
  const mounted = useMounted();
  const [step, setStep] = useState(0);

  if (!mounted) return null;
  if (hasOnboarded) return null;

  const Active = STEPS[step].icon;
  const last = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 22, stiffness: 240 }}
          className="relative w-full max-w-xl glass-elevated rounded-2xl sm:rounded-3xl p-5 sm:p-8 gradient-border overflow-hidden"
        >
          <div aria-hidden className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#a855f7]/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#22d3ee]/25 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#a855f7] to-[#6366f1] shadow-[0_15px_40px_-15px_rgba(168,85,247,0.6)] shrink-0">
              <Active className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/45">
                Step {step + 1} of {STEPS.length}
              </div>
              <div className="text-sm text-white/70">2164 · Setup</div>
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative mt-5 sm:mt-6"
          >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight">
              <span className="gradient-text">{STEPS[step].title}</span>
            </h1>
            <p className="mt-2.5 sm:mt-3 text-[13px] sm:text-sm text-white/65 leading-relaxed max-w-[40ch]">
              {STEPS[step].body}
            </p>
          </motion.div>

          {step === 0 && (
            <div className="relative mt-6">
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/45 mb-3">
                The crew
              </div>
              <div className="flex flex-wrap gap-2">
                {MEMBERS.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] pl-1 pr-3 py-1"
                  >
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-inner"
                      style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}AA)` }}
                    >
                      {initialsOf(m.name)}
                    </div>
                    <span className="text-xs font-medium text-white/85">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative mt-8 flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-8 bg-white" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>

          <div className="relative mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => setOnboarded(true)}
              className="text-white/55 sm:flex-none"
            >
              Skip intro
            </Button>
            <div className="flex items-center gap-2 sm:gap-2">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1 sm:flex-none">
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => (last ? setOnboarded(true) : setStep(step + 1))}
                className="flex-1 sm:flex-none"
              >
                {last ? "Enter" : "Continue"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
