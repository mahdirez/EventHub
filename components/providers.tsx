"use client";

import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

import { QueryToast } from "@/components/query-toast";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
      <Suspense fallback={null}>
        <QueryToast />
      </Suspense>
      <Toaster richColors closeButton position="top-center" />
    </ThemeProvider>
  );
}
