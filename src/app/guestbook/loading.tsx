import Skeleton from "@/components/Skeleton";

export default function GuestbookLoading() {
  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col items-center">
        <Skeleton className="h-8 w-40 sm:h-9" />
        <Skeleton className="mt-2 h-4 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-4 sm:p-5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-1.5 h-3 w-5/6" />
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
