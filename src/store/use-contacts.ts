"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Contact {
  id: string;
  name: string;
  category: string;
  phone: string;
  notes: string;
  emoji?: string;
}

const seed: Contact[] = [
  {
    id: "c1",
    name: "Washing Machine Guy",
    category: "Repairs",
    phone: "+91 98765 43210",
    notes: "Calls before arriving. Cash only.",
    emoji: "🧺",
  },
  {
    id: "c2",
    name: "Main Gate Security",
    category: "Society",
    phone: "+91 98765 11122",
    notes: "Day shift: Ramesh. Night shift: Vikas.",
    emoji: "🛡️",
  },
  {
    id: "c3",
    name: "Electrician",
    category: "Repairs",
    phone: "+91 98765 22233",
    notes: "Available between 10am – 7pm.",
    emoji: "💡",
  },
  {
    id: "c4",
    name: "Plumber",
    category: "Repairs",
    phone: "+91 98765 33344",
    notes: "Charges Rs 300 visiting fee.",
    emoji: "🔧",
  },
  {
    id: "c5",
    name: "Water Supplier",
    category: "Utilities",
    phone: "+91 98765 44455",
    notes: "20L cans, order by 9am for same-day.",
    emoji: "💧",
  },
  {
    id: "c6",
    name: "Gas Agency",
    category: "Utilities",
    phone: "+91 98765 55566",
    notes: "Book online; delivery in 24h.",
    emoji: "🔥",
  },
  {
    id: "c7",
    name: "Internet Provider",
    category: "Utilities",
    phone: "+91 98765 66677",
    notes: "ACT support. Reference ID 2164-FBR.",
    emoji: "📶",
  },
  {
    id: "c8",
    name: "House Owner",
    category: "Society",
    phone: "+91 98765 77788",
    notes: "Rent due on 5th. WhatsApp preferred.",
    emoji: "🏠",
  },
  {
    id: "c9",
    name: "Nearby Hospital",
    category: "Emergency",
    phone: "+91 98765 88899",
    notes: "24x7 emergency, 7 min away.",
    emoji: "🏥",
  },
  {
    id: "c10",
    name: "Nearby Pharmacy",
    category: "Emergency",
    phone: "+91 98765 99900",
    notes: "Open till 11pm. Home delivery.",
    emoji: "💊",
  },
];

interface ContactsStore {
  contacts: Contact[];
  add: (c: Omit<Contact, "id">) => void;
  update: (id: string, patch: Partial<Contact>) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const useContacts = create<ContactsStore>()(
  persist(
    (set) => ({
      contacts: seed,
      add: (c) =>
        set((s) => ({
          contacts: [
            { id: `c_${Date.now().toString(36)}`, ...c },
            ...s.contacts,
          ],
        })),
      update: (id, patch) =>
        set((s) => ({
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      remove: (id) =>
        set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),
      reset: () => set({ contacts: seed }),
    }),
    {
      name: "2164.contacts.v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
