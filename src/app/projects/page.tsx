import type { Metadata } from "next";
import ProjectList from "@/components/ProjectList";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects - James Kwame Amo",
  description: "Things I have built: products, tools and client work in fintech, payments and AI.",
};

export default function Projects() {
  return (
    <section className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Projects</h1>
        <p className="mt-2 text-[15px] text-muted">Things I&apos;ve built. Click one for the details.</p>
      </div>
      <ProjectList projects={projects} />
    </section>
  );
}
