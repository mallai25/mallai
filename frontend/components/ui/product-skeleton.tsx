
import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg h-full">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
      {Array(4).fill(0).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}