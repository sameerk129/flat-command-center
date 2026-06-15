"use client";

import { useEffect } from "react";
import { create } from "zustand";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EasterEggStore {
  open: boolean;
  trigger: () => void;
  close: () => void;
}

export const useEasterEgg = create<EasterEggStore>((set) => ({
  open: false,
  trigger: () => set({ open: true }),
  close: () => set({ open: false }),
}));

function fireConfetti() {
  const end = Date.now() + 1200;
  const colors = ["#a855f7", "#6366f1", "#22d3ee", "#f472b6", "#34d399"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
      scalar: 0.9,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
      scalar: 0.9,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({
    particleCount: 80,
    spread: 120,
    origin: { y: 0.4 },
    colors,
    startVelocity: 45,
  });
}

export function EasterEggModal() {
  const { open, close } = useEasterEgg();

  useEffect(() => {
    if (open) fireConfetti();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={close}
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            className="relative max-w-md w-full glass-elevated rounded-3xl p-8 text-center gradient-border"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2 }}
              className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#a855f7] to-[#6366f1] shadow-[0_20px_60px_-20px_rgba(168,85,247,0.8)]"
            >
              <Rocket className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              <span className="gradient-text">2164 Mission Control</span>
              <br />
              <span className="text-white">Activated</span>
              <span className="ml-1">🚀</span>
            </h2>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              You found the secret handshake. The house thanks you for your{" "}
              <span className="text-white">superior on-call energy</span>.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button variant="primary" onClick={() => { fireConfetti(); }}>
                <Sparkles className="w-4 h-4" /> More confetti
              </Button>
              <Button variant="secondary" onClick={close}>
                Back to base
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
