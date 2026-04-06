import Skeleton from "@/components/Skeleton";

function TimelineItemSkeleton() {
  return (
    <div className="relative border-l border-border pl-6 pb-8 last:pb-0">
      {/* Timeline dot */}
      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-border" />
      <Skeleton className="h-4 w-32 sm:h-5" />
      <Skeleton className="mt-1 h-3 w-48" />
      <Skeleton className="mt-1 h-3 w-36" />
      <div className="mt-3 space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export default function ExperienceLoading() {
  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      <Skeleton className="h-7 w-36 sm:h-8" />
      <div className="flex flex-col">
        <TimelineItemSkeleton />
        <TimelineItemSkeleton />
        <TimelineItemSkeleton />
        <TimelineItemSkeleton />
      </div>
    </section>
  );
}
