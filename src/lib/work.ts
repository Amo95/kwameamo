// Where I've worked, newest first. The home page's Work list shows these; the full CV has more.
export interface Work {
  company: string;
  role: string;
  /** "Dec 2025 - Oct 2026" or "2025 - Present". */
  period: string;
  current: boolean;
  logo?: string;
  href?: string;
  description: string[];
}

export const work: Work[] = [
  {
    company: "Turntabl",
    role: "Software Engineer",
    period: "2020 - Present",
    current: true,
    logo: "/logos/turntabl.png",
    href: "https://turntabl.io",
    description: [],
  },
  {
    company: "Tunic Pay",
    logo: "/logos/tunicpay.png",
    href: "https://tunicpay.com",
    role: "Backend Software Engineer",
    period: "Dec 2025 - Oct 2026",
    current: false,
    description: [
      "Built async step-up end to end, from the external partner API and signed outcome webhook to the internal step-up logic, so banks can ask customers for evidence after a payment without leaving the bank's app.",
      "Planned and rolled out isolated deployments of the evidence service for 8 partner banks, each in its own cloud project with its own database, storage, messaging and TLS ingress, with rollback behind a feature flag.",
      "Wrote the RFC for progressive loading and led the 4-engineer team that built it. Results now stream in per data source, cutting about 90% of the wait for first results in measured runs.",
      "Integrated OpenCorporates for non-UK company and officer checks, from a new Go data source to the UI, and made risk indicators name their real source.",
      "Worked on moving the analysis engine from Kotlin to Go: tracked parity across 13 check types, moved the fraud database lookup into Go, and added the last missing check.",
    ],
  },
  {
    company: "GMoney",
    role: "Backend Developer, Freelance",
    period: "Jan 2025 - Jul 2025",
    current: false,
    description: [
      "Built payment middleware supporting P2P transfers, bank-to-wallet flows, and GhIPSS interoperability.",
      "Integrated Mastercard and Brij APIs for seamless payment processing.",
      "Developed a loyalty system and implemented AWS CloudWatch observability for production monitoring.",
    ],
  },
  {
    company: "Morgan Stanley",
    logo: "/logos/morganstanley.png",
    href: "https://www.morganstanley.com",
    role: "Contingent Software Engineer",
    period: "Feb 2021 - Dec 2025",
    current: false,
    description: [
      "Automated confirms generation for structured equity products, resulting in a 90% productivity increase.",
      "Built a trade reflow tool that reduced processing time from 1 hour to 15 minutes.",
      "Created a failed trade replay API that doubled developer efficiency during incident resolution.",
      "Led Jackson library migration, integrated Spring Boot Actuators, and rolled out SonarQube Enterprise.",
    ],
  },
  {
    company: "Infusi Technologies ltd",
    logo: "/logos/infusi.png",
    href: "https://github.com/infusi-gh",
    role: "Co-Founder & Lead Backend Engineer",
    period: "2025 - Present",
    current: true,
    description: [
      "Co-founded a software agency building mobile and web platforms for clients across Ghana.",
      "Lead backend engineering on the flagship Anyigba Land Security Platform for property verification.",
      "Architect systems using Spring Boot, PostgreSQL, and event-driven patterns.",
    ],
  },
];

/** "Dec 2025 - Oct 2026" as "2025 - 2026", "2025 - Present" as "2025 - now", a single year once. */
export function years(period: string): string {
  const [from, to] = period.split(" - ").map((p) => (p === "Present" ? "now" : p.slice(-4)));
  return !to || from === to ? from : `${from} - ${to}`;
}
