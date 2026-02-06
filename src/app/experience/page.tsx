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
    period: "Dec 2024 -- Present",
    current: true,
    description: [
      "Designed and built a fraud detection orchestrator using Kotlin, Python, and Temporal.",
      "Implemented distributed worker services across 3 microservices for real-time transaction monitoring.",
      "Built event-driven transaction flows for scalable fraud prevention pipelines.",
    ],
  },
  {
    company: "GMoney",
    role: "Backend Developer, Freelance",
    period: "Jan 2025 -- Jul 2025",
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
    period: "Feb 2021 -- Dec 2025",
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
    period: "2025 -- Present",
    current: false,
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
