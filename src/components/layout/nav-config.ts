import {
  LayoutDashboard,
  CalendarRange,
  Users,
  PhoneCall,
  ClipboardCheck,
  LineChart,
  Activity,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
  description: string;
  hotkey?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    short: "Home",
    icon: LayoutDashboard,
    description: "Current on-call, upcoming rotation, house status",
    hotkey: "G then D",
  },
  {
    href: "/rotation",
    label: "Rotation Planner",
    short: "Rotation",
    icon: CalendarRange,
    description: "Calendar, cadence, manual overrides",
    hotkey: "G then R",
  },
  {
    href: "/team",
    label: "Team Directory",
    short: "Team",
    icon: Users,
    description: "Profiles, phone numbers, emergency contacts",
    hotkey: "G then T",
  },
  {
    href: "/contacts",
    label: "Important Contacts",
    short: "Contacts",
    icon: PhoneCall,
    description: "Plumber, electrician, hospital, owner",
    hotkey: "G then C",
  },
  {
    href: "/runbook",
    label: "Duty Runbook",
    short: "Runbook",
    icon: ClipboardCheck,
    description: "Weekly and monthly checklists",
    hotkey: "G then B",
  },
  {
    href: "/analytics",
    label: "Analytics",
    short: "Stats",
    icon: LineChart,
    description: "Distribution, fairness, history",
    hotkey: "G then A",
  },
  {
    href: "/ops",
    label: "House Ops",
    short: "Ops",
    icon: Activity,
    description: "Coffee, WiFi, vibes — live status",
    hotkey: "G then O",
  },
];
