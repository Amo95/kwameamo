import Skeleton from "@/components/Skeleton";

function ProjectCardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <Skeleton className="h-4 w-32 sm:h-5" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="mt-2 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-5/6" />
      <div className="mt-2 sm:mt-3 space-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-18 rounded-full" />
      </div>
    </div>
  );
}

export default function ProjectsLoading() {
  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      <div>
        <Skeleton className="h-7 w-28 sm:h-8" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="flex flex-col gap-4 sm:gap-5">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </section>
  );
}
