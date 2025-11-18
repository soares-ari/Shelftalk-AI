// src/components/ui/button.tsx
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function Button({ className, loading, children, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950",
        "hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors",
        className
      )}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}
