import Skeleton from "@/components/Skeleton";

function PostSkeleton() {
  return (
    <div className="border-t border-border py-5 sm:py-6">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-1 h-3 w-28" />
      <Skeleton className="mt-2 h-3 w-32" />
    </div>
  );
}

export default function BlogLoading() {
  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      <div>
        <Skeleton className="h-7 w-16 sm:h-8" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>
      <div className="flex flex-col">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    </section>
  );
}
