export type MemberId = "shubham" | "sameer" | "disha" | "nikhil" | "pooja";

export interface MemberSeed {
  id: MemberId;
  name: string;
  role: string;
  color: string;
  ring: string;
  soft: string;
  emoji: string;
}

export const HOUSE_NAME = "2164";
export const HOUSE_TAGLINE = "Command Center";

export const MEMBERS: MemberSeed[] = [
  {
    id: "shubham",
    name: "Shubham",
    role: "House SRE",
    color: "#a855f7",
    ring: "ring-[#a855f7]/40",
    soft: "from-[#a855f7]/30 to-[#a855f7]/0",
    emoji: "🟣",
  },
  {
    id: "sameer",
    name: "Sameer",
    role: "House SRE",
    color: "#6366f1",
    ring: "ring-[#6366f1]/40",
    soft: "from-[#6366f1]/30 to-[#6366f1]/0",
    emoji: "🔵",
  },
  {
    id: "disha",
    name: "Disha",
    role: "House SRE",
    color: "#22d3ee",
    ring: "ring-[#22d3ee]/40",
    soft: "from-[#22d3ee]/30 to-[#22d3ee]/0",
    emoji: "🟦",
  },
  {
    id: "nikhil",
    name: "Nikhil",
    role: "House SRE",
    color: "#34d399",
    ring: "ring-[#34d399]/40",
    soft: "from-[#34d399]/30 to-[#34d399]/0",
    emoji: "🟢",
  },
  {
    id: "pooja",
    name: "Pooja",
    role: "House SRE",
    color: "#f472b6",
    ring: "ring-[#f472b6]/40",
    soft: "from-[#f472b6]/30 to-[#f472b6]/0",
    emoji: "🌸",
  },
];

export const memberById = (id: MemberId) =>
  MEMBERS.find((m) => m.id === id) ?? MEMBERS[0];

export const ROTATION_EPOCH = new Date("2025-01-06T00:00:00Z"); // a Monday

export type Cadence = "weekly" | "biweekly" | "monthly";

export const CADENCE_DAYS: Record<Cadence, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

export const CADENCE_LABEL: Record<Cadence, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
};
