import Skeleton from "@/components/Skeleton";

function ContactItemSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-5 w-48" />
    </div>
  );
}

export default function ContactLoading() {
  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      <div>
        <Skeleton className="h-7 w-28 sm:h-8" />
        <Skeleton className="mt-2 h-4 w-full max-w-lg" />
        <Skeleton className="mt-1.5 h-4 w-3/4 max-w-lg" />
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 border-t border-border pt-6 sm:pt-8">
        <ContactItemSkeleton />
        <ContactItemSkeleton />
        <ContactItemSkeleton />
      </div>

      <div className="border-t border-border pt-8">
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
    </section>
  );
}
