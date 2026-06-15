"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OpsMetric {
  id: string;
  label: string;
  value: number;
  emoji: string;
  hint: string;
}

const seed: OpsMetric[] = [
  { id: "coffee", label: "Coffee Availability", value: 82, emoji: "☕", hint: "1.2 kg beans, 4 days of oat milk left" },
  { id: "maggi", label: "Maggi Stock", value: 64, emoji: "🍜", hint: "6 packets — emergency dinner ready" },
  { id: "wifi", label: "WiFi Health", value: 96, emoji: "📶", hint: "240 Mbps, last drop 3 days ago" },
  { id: "ac", label: "AC Status", value: 88, emoji: "❄️", hint: "Living room cooling at 22°C" },
  { id: "mood", label: "House Mood Index", value: 91, emoji: "🌈", hint: "Vibes are immaculate this week" },
  { id: "fridge", label: "Fridge Fullness", value: 58, emoji: "🥬", hint: "Veggies running low — grocery run soon" },
];

interface OpsStore {
  metrics: OpsMetric[];
  setValue: (id: string, value: number) => void;
  reset: () => void;
}

export const useOps = create<OpsStore>()(
  persist(
    (set) => ({
      metrics: seed,
      setValue: (id, value) =>
        set((s) => ({
          metrics: s.metrics.map((m) =>
            m.id === id ? { ...m, value: Math.max(0, Math.min(100, value)) } : m
          ),
        })),
      reset: () => set({ metrics: seed }),
    }),
    {
      name: "2164.ops.v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
