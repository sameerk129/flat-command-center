"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Topbar } from "@/components/layout/topbar";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { CommandPalette } from "@/components/command-palette";
import { EasterEggModal } from "@/components/easter-egg";
import { Onboarding } from "@/components/onboarding";
import { Toaster } from "sonner";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <>
      <AnimatedBackground />
      <Sidebar />
      <div className="lg:pl-[260px] min-h-screen flex flex-col">
        <Topbar />
        <main
          className="flex-1 px-4 sm:px-6 lg:px-10 py-5 sm:py-6 lg:py-10 w-full max-w-[1480px] mx-auto pb-[calc(env(safe-area-inset-bottom)+6rem)] lg:pb-12"
        >
          {children}
        </main>
      </div>
      <BottomNav />
      <CommandPalette />
      <EasterEggModal />
      <Onboarding />
      <Toaster
        theme="dark"
        position={isMobile ? "top-center" : "top-right"}
        offset={isMobile ? 12 : 16}
        toastOptions={{
          style: {
            background: "rgba(20, 20, 28, 0.92)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            color: "white",
          },
        }}
      />
    </>
  );
}
