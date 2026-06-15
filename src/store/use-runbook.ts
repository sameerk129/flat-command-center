"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type DutyFrequency = "weekly" | "monthly";

export interface Duty {
  id: string;
  title: string;
  frequency: DutyFrequency;
  notes: string;
  dueDate: string | null;
  done: boolean;
  emoji?: string;
}

const seed: Duty[] = [
  { id: "d1", title: "Garbage drop-off", frequency: "weekly", notes: "Wet & dry segregation. Mon, Wed, Fri.", dueDate: null, done: false, emoji: "🗑️" },
  { id: "d2", title: "Water tank check", frequency: "weekly", notes: "Top up if below half. Note motor runtime.", dueDate: null, done: false, emoji: "💧" },
  { id: "d3", title: "Groceries restock", frequency: "weekly", notes: "Eggs, milk, fruits, bread, snacks.", dueDate: null, done: false, emoji: "🛒" },
  { id: "d4", title: "Electricity meter reading", frequency: "weekly", notes: "Log reading on Sunday night.", dueDate: null, done: false, emoji: "⚡" },
  { id: "d5", title: "Deep cleaning", frequency: "monthly", notes: "Hire help. Includes balcony + kitchen hood.", dueDate: null, done: false, emoji: "🧽" },
  { id: "d6", title: "AC service / filter clean", frequency: "monthly", notes: "Rotate units. Service every 3 months.", dueDate: null, done: false, emoji: "❄️" },
  { id: "d7", title: "Bills & utilities review", frequency: "monthly", notes: "Pay rent, internet, gas, electricity.", dueDate: null, done: false, emoji: "🧾" },
  { id: "d8", title: "Pantry audit", frequency: "monthly", notes: "Check expiry. Restock spices & condiments.", dueDate: null, done: false, emoji: "📦" },
];

interface RunbookStore {
  duties: Duty[];
  add: (d: Omit<Duty, "id" | "done">) => void;
  toggle: (id: string) => void;
  update: (id: string, patch: Partial<Duty>) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const useRunbook = create<RunbookStore>()(
  persist(
    (set) => ({
      duties: seed,
      add: (d) =>
        set((s) => ({
          duties: [
            { id: `d_${Date.now().toString(36)}`, done: false, ...d },
            ...s.duties,
          ],
        })),
      toggle: (id) =>
        set((s) => ({
          duties: s.duties.map((d) =>
            d.id === id ? { ...d, done: !d.done } : d
          ),
        })),
      update: (id, patch) =>
        set((s) => ({
          duties: s.duties.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
      remove: (id) =>
        set((s) => ({ duties: s.duties.filter((d) => d.id !== id) })),
      reset: () => set({ duties: seed }),
    }),
    {
      name: "2164.runbook.v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
