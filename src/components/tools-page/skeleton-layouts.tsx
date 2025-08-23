import { Skeleton } from "@/components/ui";

// Skeleton for Icons Layout
export function IconsLayoutSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <Skeleton className="w-20 h-4" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for Cards Layout
export function CardsLayoutSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-14 h-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for Bricks Layout
export function BricksLayoutSkeleton() {
  const widths = [200, 220, 180, 240, 200, 260, 190, 210, 230, 195];

  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 space-y-3 bg-card"
          style={{ width: `${widths[i]}px` }}
        >
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-14 h-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for Tags
export function TagsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="w-20 h-8 rounded-full" />
      ))}
    </div>
  );
}

// Skeleton for Filters
export function FiltersSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="w-32 h-8 rounded-lg" />
      <Skeleton className="w-24 h-8 rounded-lg" />
      <Skeleton className="w-28 h-8 rounded-lg" />
      <Skeleton className="w-20 h-8 rounded-lg" />
    </div>
  );
}

// Skeleton for Results Summary
export function ResultsSummarySkeleton() {
  return (
    <div className="mb-6">
      <Skeleton className="w-64 h-4" />
    </div>
  );
}
