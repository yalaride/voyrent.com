import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ListingSkeleton } from "@/features/catalog/listing-skeleton";

export default function CompanyLoading() {
  return (
    <main className="w-full bg-background-primary pb-12">
      <LayoutWrapper>
        <div className="flex flex-col gap-3 border-b border-border-subtle py-8">
          <div className="h-8 w-72 animate-pulse rounded-md bg-background-secondary" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded-md bg-background-secondary" />
          <div className="mt-2 flex gap-4">
            <div className="h-4 w-36 animate-pulse rounded-md bg-background-secondary" />
            <div className="h-4 w-36 animate-pulse rounded-md bg-background-secondary" />
          </div>
        </div>
      </LayoutWrapper>

      <div className="pt-6">
        <ListingSkeleton />
      </div>
    </main>
  );
}
