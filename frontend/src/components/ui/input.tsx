// src/components/ui/input.tsx
import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={clsx(
        "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500",
        className
      )}
    />
  )
);

Input.displayName = "Input";
