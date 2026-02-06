import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects - James Kwame Amo",
  description:
    "Selected projects in fintech, payments, AI, and accessible technology.",
};

const projects = [
  {
    title: "AI Educational Chat Platform",
    description:
      "An AI-powered educational chat platform with support for Claude AI and Wolfram Alpha integration. Features OAuth2 authentication and comprehensive API documentation.",
    tech: [
      "Spring Boot 4.0.1",
      "Java 21",
      "PostgreSQL",
      "Claude AI",
      "Wolfram Alpha",
      "Springdoc OpenAPI 2.7.0",
    ],
    features: [
      "JWT authentication with OAuth2 support (Google, Microsoft)",
      "Claude AI integration for conversational learning",
      "Wolfram Alpha integration for computational queries",
      "RESTful API with OpenAPI documentation",
    ],
    link: "https://github.com/amo95",
  },
  {
    title: "Logiciel Loans - WhatsApp Flow Integration",
    description:
      "WhatsApp Flow integration for loan management API, enabling customers to apply for and manage loans through WhatsApp's conversational interface.",
    tech: ["Spring Boot", "WhatsApp Business API", "PostgreSQL"],
    features: [
      "WhatsApp Flow implementation for loan applications",
      "Loan management API endpoints",
      "Integration with existing loan processing system",
      "Automated notifications and status updates via WhatsApp",
    ],
  },
  {
    title: "Anyigba Land Security Platform",
    description:
      "A property verification system addressing land fraud in Ghana's real estate sector. Provides secure document management, role-based access control, and automated workflows for property transactions.",
    tech: ["Spring Boot", "PostgreSQL", "React", "Railway"],
    features: [
      "JWT authentication with role-based access control",
      "Event-driven notifications for transaction updates",
      "State machine workflows for multi-step verification processes",
      "RESTful API serving both web and mobile clients",
    ],
    link: "https://github.com/amo95",
  },
  {
    title: "cedAI",
    description:
      "A mobile currency recognition application designed to help visually impaired users identify banknotes. Developed as a final year thesis project, achieving 99.5% mAP50 accuracy.",
    tech: ["Flutter", "TensorFlow Lite", "YOLO", "Dart"],
    features: [
      "Real-time banknote detection using device camera",
      "Offline inference with TensorFlow Lite models",
      "Audio feedback for accessibility",
      "Trained on custom dataset of Ghanaian banknotes",
    ],
    link: "https://github.com/amo95",
  },
  {
    title: "GMoney Middleware",
    description:
      "A payment orchestration layer powering peer-to-peer transfers, bank-to-wallet flows, and interbank settlements across multiple payment providers in Ghana.",
    tech: ["Java", "Spring Boot", "AWS", "PostgreSQL", "CloudWatch"],
    features: [
      "Mastercard and Brij API integrations",
      "GhIPSS interoperability for cross-bank transfers",
      "Loyalty points system for transaction rewards",
      "Production observability with AWS CloudWatch dashboards",
    ],
  },
];

export default function Projects() {
  return (
    <section className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          Projects
        </h1>
        <p className="mt-2 text-[14px] text-muted sm:text-[15px]">
          Selected projects I have built or contributed to.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            tech={project.tech}
            features={project.features}
            link={project.link}
          />
        ))}
      </div>
    </section>
  );
}
