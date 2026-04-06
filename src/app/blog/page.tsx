import type { Metadata } from "next";
import Link from "next/link";
import { fetchMediumPosts } from "@/lib/medium";

export const metadata: Metadata = {
  title: "Blog - James Kwame Amo",
  description:
    "Thoughts on backend engineering, distributed systems, and fintech.",
};

export default async function Blog() {
  const posts = await fetchMediumPosts();

  return (
    <section className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          Blog
        </h1>
        <p className="mt-2 text-[14px] text-muted sm:text-[15px]">
          Thoughts on backend engineering, distributed systems, and fintech.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border-t border-border pt-8">
          <p className="text-[14px] text-muted">
            No posts yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => (
            <div
              key={post.link}
              className="border-t border-border py-5 sm:py-6"
            >
              <h2 className="text-[15px] font-medium text-foreground">
                {post.title}
              </h2>
              <p className="mt-1 text-[13px] text-muted">{post.date}</p>
              <Link
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[13px] text-muted transition-colors hover:text-foreground"
              >
                Read on Medium &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
