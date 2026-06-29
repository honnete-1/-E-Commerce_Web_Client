export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-stone-200 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/3" />
      <Skeleton className="mt-3 h-9 w-full rounded-lg" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
