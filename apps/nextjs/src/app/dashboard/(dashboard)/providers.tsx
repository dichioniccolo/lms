"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

export function DashboardProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
