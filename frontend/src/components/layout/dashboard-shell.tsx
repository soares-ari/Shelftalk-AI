// src/components/layout/dashboard-shell.tsx
"use client";

import { ReactNode } from "react";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="px-6 py-10 max-w-6xl mx-auto">
        {children}
      </div>
    </main>
  );
}
