# 2164 · Command Center

A premium, frontend-only on-call roster website for the inhabitants of flat **2164**. Think Linear × Notion Calendar × Apple HIG, applied to managing house chores.

> "An SRE on-call rotation — for a flat."

Members: **Shubham · Sameer · Disha · Nikhil · Pooja**

---

## Tech stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **shadcn-style UI** built on **Radix UI** primitives
- **Framer Motion** for animations
- **Lucide** icons
- **Zustand** (with `persist` middleware) for state — **everything saves to LocalStorage**
- **Recharts** for visualizations
- **cmdk** for the command palette
- **canvas-confetti** for the easter egg
- **sonner** for toast notifications

No backend. No auth. No database. **Works fully offline.**

---

## Features

### Dashboard (`/`)

- Large **current on-call hero card** with avatar, days remaining, start & end dates, live pulse, "up next" badge
- **House status widgets**: members, current week #, rotation cadence, days until handover
- **Upcoming rotation timeline** with Current → Next → Next +1 → Next +2
- **Quick glance** tiles linking to runbook, contacts, and ops

### Rotation Planner (`/rotation`)

- **Monthly calendar** with each day color-coded by who is on-call
- **Cadence configuration**: Weekly / Bi-weekly / Monthly
- **Rotation start date** picker
- **Drag-and-drop order** of members
- **Drag-and-drop manual override** to swap entire periods — with undo via toast
- Per-period select dropdown to assign anyone for a specific week

### Team Directory (`/team`)

- Profile cards for all five members
- Editable: name (role), phone, emergency contact, notes — inline edit mode
- Search across name, role, phone, notes

### Important Contacts (`/contacts`)

- Default seeds: Washing Machine Guy, Main Gate Security, Electrician, Plumber, Water Supplier, Gas Agency, Internet Provider, House Owner, Nearby Hospital, Nearby Pharmacy
- Add / Edit / Delete with **undo toast** for deletes
- Search + category filter chips
- Click-to-call (`tel:`) links and "copy phone" action

### Duty Runbook (`/runbook`)

- Weekly and monthly duty sections, like an incident runbook
- Checkboxes, due date, notes per duty
- Overall progress bar
- Add / Edit / Delete with undo

### Analytics (`/analytics`)

- **On-call distribution** pie chart with per-member percentages
- **Fairness meter** with animated score dial (0–100) and per-member deltas
- **Rotation history** timeline (past + upcoming periods)

### House Ops Status (`/ops`)

- Animated indicators for Coffee Availability, Maggi Stock, WiFi Health, AC Status, Mood Index, Fridge Fullness
- Composite **vibe score**
- Sliders to tweak any metric; **Randomize** quick action

### UX polish

- **Command palette** at `⌘K` / `Ctrl+K` (navigate, search members & contacts, quick actions)
- **Onboarding screen** on first visit (skippable, multi-step)
- **Easter egg**: click the logo 5 times — confetti + "2164 Mission Control Activated 🚀"
- Toast notifications via Sonner (with undo actions where appropriate)
- Loading skeletons (shimmer) before client-only data hydrates
- Empty states everywhere
- Animated background blobs + subtle grid
- Glassmorphism cards, gradient borders, gradient text
- Smooth Framer Motion transitions between active states
- Hover lift effects
- Responsive: **sidebar on desktop**, **floating bottom nav on mobile**, sticky topbar with quick search

---

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint
```

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout + AppShell
│   ├── page.tsx            # Dashboard
│   ├── rotation/page.tsx
│   ├── team/page.tsx
│   ├── contacts/page.tsx
│   ├── runbook/page.tsx
│   ├── analytics/page.tsx
│   └── ops/page.tsx
├── components/
│   ├── ui/                 # shadcn-style primitives (Button, Card, Dialog, …)
│   ├── layout/             # AppShell, Sidebar, BottomNav, Topbar, AnimatedBackground, Logo
│   ├── common/             # PageHeader, MemberAvatar, NoSSR
│   ├── dashboard/          # CurrentOnCallCard, UpcomingTimeline, HouseStatus, QuickGlance
│   ├── rotation/           # RotationCalendar, RotationConfig, ManualOverride
│   ├── team/               # ProfileCard
│   ├── contacts/           # ContactCard, ContactFormDialog
│   ├── runbook/            # DutyItem, DutyFormDialog
│   ├── analytics/          # DistributionChart, FairnessMeter, RotationHistory
│   ├── ops/                # OpsCard
│   ├── command-palette.tsx
│   ├── onboarding.tsx
│   └── easter-egg.tsx
├── lib/
│   ├── constants.ts        # Members, colors, cadence
│   ├── rotation.ts         # Period math, fairness, distribution
│   └── utils.ts            # cn, date helpers, initials
└── store/
    ├── use-members.ts      # Persisted: member profiles
    ├── use-rotation.ts     # Persisted: cadence, order, overrides
    ├── use-contacts.ts     # Persisted: contacts CRUD
    ├── use-runbook.ts      # Persisted: duties CRUD
    ├── use-ops.ts          # Persisted: live ops metrics
    └── use-ui.ts           # Persisted: onboarding flag, command palette state
```

LocalStorage keys are namespaced under `2164.*` (versioned: `.v1`).

---

## Design system

- **Background**: deep charcoal `#07070b`
- **Accents**: Purple `#a855f7`, Indigo `#6366f1`, Cyan `#22d3ee`, plus per-member greens & pinks
- **Surface**: glass (`backdrop-blur`) with translucent dark grays
- **Typography**: Geist Sans / Geist Mono
- **Radius**: generous (xs → 2xl)
- **Effects**: gradient borders, subtle noise, pulsing rings, drifting blobs
