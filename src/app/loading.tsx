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
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="mt-3 flex gap-7">
          <div>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="mt-[5px] h-3.5 w-36" />
          </div>
          <div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="mt-[5px] h-3.5 w-14" />
          </div>
        </div>
        <Skeleton className="mt-4 h-[72px] w-full sm:h-[100px]" />
        <div className="mt-2 flex justify-end">
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </section>
  );
}
