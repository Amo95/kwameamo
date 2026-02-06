import Link from "next/link";
import { getVisitorRegion, getBadgeText } from "@/lib/geo";

export default async function Home() {
  const region = await getVisitorRegion();
  const badgeText = getBadgeText(region);
  return (
    <section className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up">
      {/* Hero */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          James Kwame Amo
        </h1>
        <p className="text-[15px] font-medium text-foreground sm:text-[16px]">
          Backend Software Engineer
        </p>
        <p className="max-w-xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
          Building scalable systems in fintech and investment banking. Currently
          at Tunic Pay, previously Morgan Stanley.
        </p>
      </div>

      {/* Location-based badge */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[13px] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
          {badgeText}
        </span>
      </div>

      {/* Social links */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-5">
        <Link
          href="https://github.com/amo95"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-muted transition-colors hover:text-foreground sm:text-[14px]"
        >
          GitHub
        </Link>
        <Link
          href="https://linkedin.com/in/james-amo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-muted transition-colors hover:text-foreground sm:text-[14px]"
        >
          LinkedIn
        </Link>
        <Link
          href="mailto:kwame.amo.james@gmail.com"
          className="text-[13px] text-muted transition-colors hover:text-foreground sm:text-[14px]"
        >
          Email
        </Link>
      </div>

      {/* Brief intro sections */}
      <div className="mt-2 sm:mt-4 border-t border-border pt-6 sm:pt-8">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">
          Currently
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Designing and building fraud detection systems at{" "}
          <span className="text-foreground">Tunic Pay</span>, working with
          Kotlin, Python, and Temporal to orchestrate distributed worker
          services across microservices.
        </p>
      </div>

      <div>
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">
          Previously
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Spent nearly four years at{" "}
          <span className="text-foreground">Morgan Stanley</span> working on
          structured equity products, automating confirms generation, building
          trade reflow tools, and improving developer efficiency across the
          team.
        </p>
      </div>

      <div>
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">
          Side Projects
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Co-founded{" "}
          <span className="text-foreground">Infusi Technologies ltd</span>, a
          software agency building mobile and web platforms. Our flagship
          project is the Anyigba Land Security Platform for property
          verification in Ghana.
        </p>
      </div>
    </section>
  );
}
