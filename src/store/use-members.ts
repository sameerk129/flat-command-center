"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MEMBERS, type MemberId } from "@/lib/constants";

export interface MemberProfile {
  id: MemberId;
  name: string;
  role: string;
  phone: string;
  emergencyContact: string;
  notes: string;
}

interface MembersStore {
  members: MemberProfile[];
  updateMember: (id: MemberId, patch: Partial<MemberProfile>) => void;
  reset: () => void;
}

const seed: MemberProfile[] = MEMBERS.map((m) => ({
  id: m.id,
  name: m.name,
  role: m.role,
  phone: "",
  emergencyContact: "",
  notes: "",
}));

export const useMembers = create<MembersStore>()(
  persist(
    (set) => ({
      members: seed,
      updateMember: (id, patch) =>
        set((s) => ({
          members: s.members.map((m) =>
            m.id === id ? { ...m, ...patch } : m
          ),
        })),
      reset: () => set({ members: seed }),
    }),
    {
      name: "2164.members.v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
