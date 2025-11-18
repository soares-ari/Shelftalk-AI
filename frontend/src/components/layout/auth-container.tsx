// src/components/layout/auth-container.tsx
import { ReactNode } from "react";

export function AuthContainer({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-xl p-8 shadow-xl">
        {children}
      </div>
    </main>
  );
}
