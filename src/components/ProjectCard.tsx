import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  features?: string[];
  link?: string;
}

export default function ProjectCard({
  title,
  description,
  tech,
  features,
  link,
}: ProjectCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 sm:p-5 transition-all duration-200 hover:border-muted hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <h3 className="text-[14px] font-semibold text-foreground sm:text-[15px]">{title}</h3>
        {link && (
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[12px] text-muted transition-colors hover:text-foreground sm:text-[13px]"
          >
            View &rarr;
          </Link>
        )}
      </div>

      <p className="mt-2 text-[13px] leading-relaxed text-muted sm:text-[14px]">
        {description}
      </p>

      {features && features.length > 0 && (
        <ul className="mt-2 sm:mt-3 space-y-1">
          {features.map((feature, index) => (
            <li
              key={index}
              className="text-[12px] leading-relaxed text-muted sm:text-[13px]"
            >
              &bull; {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {tech.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted sm:px-2.5 sm:text-[12px]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
