import Skeleton from "@/components/Skeleton";

export default function ProjectsLoading() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="flex flex-col gap-1.5 overflow-hidden rounded-3xl">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-4 bg-panel px-4 py-3.5">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1.5 h-3 w-64 max-w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
