import Skeleton from "@/components/Skeleton";

export default function ProjectsLoading() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="border-t border-border">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-4 border-b border-border px-1 py-3">
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
