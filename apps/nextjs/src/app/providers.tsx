"use client";

import type { PropsWithChildren } from "react";

import { Toaster } from "@acme/ui/components/ui/sonner";
import { TooltipProvider } from "@acme/ui/components/ui/tooltip";

import { Confetti } from "./_components/confetti";

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      {/* <ThemeProvider attribute="class"> */}
      <Confetti />
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
      {/* </ThemeProvider> */}
    </>
  );
}
