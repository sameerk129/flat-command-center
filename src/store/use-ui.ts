"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIState {
  hasOnboarded: boolean;
  setOnboarded: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      setOnboarded: (v) => set({ hasOnboarded: v }),
      commandOpen: false,
      setCommandOpen: (v) => set({ commandOpen: v }),
    }),
    {
      name: "2164.ui.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ hasOnboarded: s.hasOnboarded }),
    }
  )
);
