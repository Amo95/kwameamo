import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  features?: string[];
  link?: string;
  image?: string | null;
}

export default function ProjectCard({
  title,
  description,
  tech,
  features,
  link,
  image,
}: ProjectCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border transition-all duration-200 hover:border-muted hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-[180px] overflow-hidden sm:h-[240px]">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
            <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
              {title}
            </span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(to top, var(--color-background), transparent)" }}
        />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <h3 className="text-[14px] font-semibold text-foreground sm:text-[15px]">
            {title}
          </h3>
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
          <ul className="mt-2 space-y-1 sm:mt-3">
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

        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
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
    </div>
  );
}
