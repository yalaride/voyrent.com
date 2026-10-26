import { Skeleton } from "@/components/ui/skeleton";

export function ListingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-72 rounded-2xl" />
      ))}
    </div>
  );
}
