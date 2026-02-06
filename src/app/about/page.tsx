import type { Metadata } from "next";
import { getVisitorRegion, getAboutText } from "@/lib/geo";

export const metadata: Metadata = {
  title: "About - James Kwame Amo",
  description:
    "Backend Software Engineer with 4+ years of experience in fintech and investment banking.",
};

export default async function About() {
  const region = await getVisitorRegion();
  const aboutText = getAboutText(region);
  return (
    <section className="flex flex-col gap-5 sm:gap-6 animate-fade-in-up">
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
        About
      </h1>

      <div className="flex flex-col gap-4 sm:gap-5 text-[14px] leading-relaxed text-muted sm:text-[15px]">
        <p>
          I am a backend software engineer with over four years of experience
          building scalable, distributed systems in fintech and investment
          banking. My core stack spans{" "}
          <span className="text-foreground">
            Java, Scala, Kotlin, and Python
          </span>
          , and I have deep experience with frameworks like Spring Boot,
          Temporal, and event-driven architectures.
        </p>

        <p>
          Most recently, I have been at{" "}
          <span className="text-foreground">Tunic Pay</span> building fraud
          detection orchestration systems, and before that I spent nearly four
          years at <span className="text-foreground">Morgan Stanley</span>{" "}
          working on structured equity products. At Morgan Stanley, I automated
          confirms generation resulting in a 90% productivity increase, built
          trade reflow tools that reduced processing time from one hour to
          fifteen minutes, and created a failed trade replay API that doubled
          developer efficiency.
        </p>

        <p>
          I also freelanced with{" "}
          <span className="text-foreground">GMoney</span>, building payment
          middleware for P2P transfers, bank-to-wallet flows, and GhIPSS
          interoperability, integrating with Mastercard and Brij APIs. On the
          side, I co-founded{" "}
          <span className="text-foreground">Infusi Technologies ltd</span>, a
          software agency where I lead backend engineering on mobile and web
          platforms, including the Anyigba Land Security Platform for property
          verification in Ghana.
        </p>

        <p>
          I hold a BSc in Computer Science from Koforidua Technical University.
          Based in Accra, Ghana, I am currently {aboutText}.
        </p>
      </div>

      {/* Skills */}
      <div className="mt-2 sm:mt-4 border-t border-border pt-6 sm:pt-8">
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">
          Languages
        </h2>
        <p className="mt-3 text-[15px] text-muted">
          Java, Scala, Kotlin, Python, SQL
        </p>
      </div>

      <div>
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">
          Frameworks & Tools
        </h2>
        <p className="mt-3 text-[15px] text-muted">
          Spring Boot, Temporal, PostgreSQL, AWS, Docker, Kubernetes, Kafka,
          SonarQube, CloudWatch
        </p>
      </div>

      <div>
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">
          Domains
        </h2>
        <p className="mt-3 text-[15px] text-muted">
          Fintech, Investment Banking, Payments, Fraud Detection
        </p>
      </div>

      <div>
        <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">
          Education
        </h2>
        <p className="mt-3 text-[15px] text-muted">
          BSc Computer Science, Koforidua Technical University
        </p>
      </div>
    </section>
  );
}
