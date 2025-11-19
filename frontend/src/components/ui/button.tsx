// src/components/ui/button.tsx
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Button({ 
  className, 
  loading, 
  size = "md",
  children, 
  ...props 
}: Props) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "rounded-md bg-emerald-500 font-medium text-slate-950",
        "hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors",
        sizeClasses[size],
        className?.includes("w-full") ? "w-full" : "", // Mantém w-full se passar no className
        className
      )}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}