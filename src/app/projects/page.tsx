import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects - James Kwame Amo",
  description:
    "Selected projects in fintech, payments, AI, and accessible technology.",
};

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
            image={project.image}
          />
        ))}
      </div>
    </section>
  );
}
