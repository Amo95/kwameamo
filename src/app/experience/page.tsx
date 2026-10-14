import type { Metadata } from "next";
import ExperienceItem from "@/components/ExperienceItem";

export const metadata: Metadata = {
  title: "Experience - James Kwame Amo",
  description:
    "Professional experience in fintech, investment banking, and software engineering.",
};

const experiences = [
  {
    company: "Tunic Pay",
    role: "Backend Software Engineer",
    period: "Dec 2025 - Oct 2026",
    current: false,
    description: [
      "Led async step-up, letting partner banks ask customers for evidence after a payment without leaving the bank's app. Built the partner API, evidence pipeline and end-to-end tests.",
      "Planned and built isolated deployments for banks that would not share infrastructure, each with its own cloud project, database, storage and messaging.",
      "Wrote the RFC for progressive loading and led the team that built it: first results in about 2 seconds instead of up to 15, and one failing source no longer blocks the rest.",
      "Integrated OpenCorporates for company checks outside the UK, including officer search.",
      "Started the migration of the analysis engine from Kotlin to Go and tracked parity across check types.",
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

export default function Experience() {
  return (
    <section className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up">
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
        Experience
      </h1>

      <div className="flex flex-col">
        {experiences.map((exp, index) => (
          <ExperienceItem
            key={exp.company}
            company={exp.company}
            role={exp.role}
            period={exp.period}
            description={exp.description}
            current={exp.current}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
