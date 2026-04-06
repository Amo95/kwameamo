import Skeleton from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      {/* Hero */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <Skeleton className="h-8 w-64 sm:h-9" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
      </div>

      {/* Badge */}
      <Skeleton className="h-7 w-48 rounded-full" />

      {/* Social links */}
      <div className="flex gap-4 sm:gap-5">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>

      {/* Currently */}
      <div className="mt-2 sm:mt-4 border-t border-border pt-6 sm:pt-8">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </div>

      {/* Previously */}
      <div>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <Skeleton className="mt-2 h-4 w-4/6" />
      </div>

      {/* Side Projects */}
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </div>

      {/* GitHub */}
      <div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-4 w-56" />
        <div className="mt-3 flex gap-[3px]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, j) => (
                <Skeleton key={j} className="h-3 w-3 rounded-sm" />
              ))}
            </div>
          ))}
        </div>
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
    </section>
  );
}
