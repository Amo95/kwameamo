import Skeleton from "@/components/Skeleton";

function ParagraphSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-4/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

function SkillSectionSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-3 h-4 w-64" />
    </div>
  );
}

export default function AboutLoading() {
  return (
    <section className="flex flex-col gap-5 sm:gap-6">
      <Skeleton className="h-7 w-20 sm:h-8" />

      <div className="flex flex-col gap-4 sm:gap-5">
        <ParagraphSkeleton lines={4} />
        <ParagraphSkeleton lines={5} />
        <ParagraphSkeleton lines={4} />
        <ParagraphSkeleton lines={2} />
      </div>

      <div className="mt-2 sm:mt-4 border-t border-border pt-6 sm:pt-8">
        <SkillSectionSkeleton />
      </div>
      <SkillSectionSkeleton />
      <SkillSectionSkeleton />
      <SkillSectionSkeleton />
    </section>
  );
}
