"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  MEMBERS,
  ROTATION_EPOCH,
  type Cadence,
  type MemberId,
} from "@/lib/constants";

interface RotationState {
  cadence: Cadence;
  startDateISO: string;
  order: MemberId[];
  overrides: Record<number, MemberId>;
  setCadence: (cadence: Cadence) => void;
  setStartDate: (date: Date) => void;
  setOrder: (order: MemberId[]) => void;
  setOverride: (periodIndex: number, memberId: MemberId) => void;
  clearOverride: (periodIndex: number) => void;
  swapPeriods: (a: number, b: number) => void;
  reset: () => void;
}

const initial = {
  cadence: "weekly" as Cadence,
  startDateISO: ROTATION_EPOCH.toISOString(),
  order: MEMBERS.map((m) => m.id),
  overrides: {} as Record<number, MemberId>,
};

export const useRotation = create<RotationState>()(
  persist(
    (set, get) => ({
      ...initial,
      setCadence: (cadence) => set({ cadence }),
      setStartDate: (date) => set({ startDateISO: date.toISOString() }),
      setOrder: (order) => set({ order }),
      setOverride: (periodIndex, memberId) =>
        set((s) => ({
          overrides: { ...s.overrides, [periodIndex]: memberId },
        })),
      clearOverride: (periodIndex) =>
        set((s) => {
          const next = { ...s.overrides };
          delete next[periodIndex];
          return { overrides: next };
        }),
      swapPeriods: (a, b) => {
        const state = get();
        const order = state.order.length > 0 ? state.order : MEMBERS.map((m) => m.id);
        const memberAt = (idx: number): MemberId => {
          if (state.overrides[idx]) return state.overrides[idx];
          const i = ((idx % order.length) + order.length) % order.length;
          return order[i];
        };
        const memberA = memberAt(a);
        const memberB = memberAt(b);
        set((s) => ({
          overrides: {
            ...s.overrides,
            [a]: memberB,
            [b]: memberA,
          },
        }));
      },
      reset: () => set(initial),
    }),
    {
      name: "2164.rotation.v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useResolvedRotation() {
  const s = useRotation();
  return {
    cadence: s.cadence,
    startDate: new Date(s.startDateISO),
    order: s.order,
    overrides: s.overrides,
  };
}
