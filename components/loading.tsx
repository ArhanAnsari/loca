import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full max-w-[900px]" />
        <Skeleton className="h-4 w-full max-w-[900px]" />
        <Skeleton className="h-4 w-full max-w-[900px]" />
        <Skeleton className="h-4 w-full max-w-[900px]" />
      </div>
      <Skeleton className="h-[125px] max-w-[900px] rounded-xl" />
    </div>
  );
}
