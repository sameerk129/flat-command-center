"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { CommandPalette } from "@/components/command-palette";
import { EasterEggModal } from "@/components/easter-egg";
import { Onboarding } from "@/components/onboarding";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <Sidebar />
      <div className="lg:pl-[260px] min-h-screen flex flex-col">
        <Topbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-28 lg:pb-12 w-full max-w-[1480px] mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
      <CommandPalette />
      <EasterEggModal />
      <Onboarding />
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(20, 20, 28, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            color: "white",
          },
        }}
      />
    </>
  );
}
