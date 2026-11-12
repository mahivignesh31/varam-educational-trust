"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";
import { startCampusSync } from "@/lib/remote";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startCampusSync();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <TooltipProvider delayDuration={250}>
          {children}
          <Toaster position="top-center" closeButton />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
