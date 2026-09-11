export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/3] w-full animate-pulse bg-sand-100" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-sand-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-sand-100" />
        <div className="h-5 w-2/5 animate-pulse rounded bg-sand-100" />
        <div className="h-3 w-full animate-pulse rounded bg-sand-100" />
      </div>
    </div>
  );
}
