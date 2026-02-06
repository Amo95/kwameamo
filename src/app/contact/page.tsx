import type { Metadata } from "next";
import Link from "next/link";
import { getVisitorRegion, getContactText } from "@/lib/geo";

export const metadata: Metadata = {
  title: "Contact - James Kwame Amo",
  description: "Get in touch with James Kwame Amo.",
};

export default async function Contact() {
  const region = await getVisitorRegion();
  const contactText = getContactText(region);
  return (
    <section className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          Contact
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
          I am always open to conversations about backend engineering, fintech,
          or new opportunities{contactText ? ` -- ${contactText}` : ""}. Feel free to reach out.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 border-t border-border pt-6 sm:pt-8">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-muted">
            Email
          </span>
          <Link
            href="mailto:kwame.amo.james@gmail.com"
            className="text-[15px] text-foreground transition-colors hover:text-muted"
          >
            kwame.amo.james@gmail.com
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-muted">
            LinkedIn
          </span>
          <Link
            href="https://linkedin.com/in/james-amo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-foreground transition-colors hover:text-muted"
          >
            linkedin.com/in/james-amo
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-muted">
            GitHub
          </span>
          <Link
            href="https://github.com/amo95"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-foreground transition-colors hover:text-muted"
          >
            github.com/amo95
          </Link>
        </div>
      </div>

      {/* Download CV */}
      <div className="border-t border-border pt-8">
        <Link
          href="/james-amo-cv.pdf"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-medium transition-colors border border-[#111111] text-[#111111] bg-white hover:bg-gray-100 dark:border-[#e5e5e5] dark:text-[#e5e5e5] dark:bg-transparent dark:hover:bg-white/5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download CV
        </Link>
      </div>
    </section>
  );
}
