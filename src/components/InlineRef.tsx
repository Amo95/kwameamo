import Link from "next/link";
import type { ReactNode } from "react";

// A name inside running text: a round picture and the name on a soft pill. Projects open their details; companies
// link to their site.
export const refClass =
  "group/ref relative mx-px inline cursor-pointer whitespace-nowrap rounded-full bg-foreground/[0.06] py-[3px] pl-[3px] pr-[9px] font-medium text-foreground transition-colors duration-150 hover:bg-foreground/[0.1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function RefPicture({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="mr-1.5 inline-block h-[22px] w-[22px] rounded-full object-cover align-[-6px] ring-1 ring-border ring-offset-[1.5px] ring-offset-background transition-transform duration-200 ease-[cubic-bezier(.23,1,.32,1)] group-hover/ref:scale-110 motion-reduce:transition-none"
    />
  );
}

/** A company named in the text: its logo and a ↗, opening its site in a new tab. */
export function CompanyRef({ name, href, logo }: { name: string; href: string; logo: string }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={refClass} aria-label={`${name} (opens their website)`}>
      <RefPicture src={logo} />
      {name}
      <span aria-hidden="true" className="ml-1 text-[11px] text-muted">↗</span>
    </Link>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-[15px] leading-[1.95] text-muted [text-wrap:pretty]">{children}</p>;
}
