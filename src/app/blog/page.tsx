import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - James Kwame Amo",
  description: "Thoughts on backend engineering, distributed systems, and fintech.",
};

export default function Blog() {
  return (
    <section className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Blog
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          Thoughts on backend engineering, distributed systems, and fintech.
        </p>
      </div>

      <div className="border-t border-border pt-8">
        <p className="text-[14px] text-muted">
          No posts yet. Check back soon.
        </p>
      </div>
    </section>
  );
}
