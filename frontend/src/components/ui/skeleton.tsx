import clsx from "clsx";

type Props = {
  className?: string;
};

export function Skeleton({ className }: Props) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-slate-800 rounded-md",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function ProductViewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
        <Skeleton className="h-12 w-40" />
      </div>
      <div className="border-t border-slate-800 pt-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}