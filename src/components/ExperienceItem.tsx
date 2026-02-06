interface ExperienceItemProps {
  company: string;
  role: string;
  period: string;
  description: string[];
  current?: boolean;
  index?: number;
}

export default function ExperienceItem({
  company,
  role,
  period,
  description,
  current = false,
  index = 0,
}: ExperienceItemProps) {
  return (
    <div
      className="relative border-l border-border pl-4 sm:pl-6 pb-8 sm:pb-10 last:pb-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Timeline dot */}
      <div
        className={`absolute -left-[4px] sm:-left-[5px] top-[6px] h-[8px] w-[8px] sm:h-[9px] sm:w-[9px] rounded-full border-2 ${
          current
            ? "border-foreground bg-foreground"
            : "border-border bg-background"
        }`}
      />

      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground sm:text-[15px]">
            {company}
          </h3>
          <p className="text-[13px] text-muted sm:text-[14px]">{role}</p>
        </div>
        <p className="text-[12px] text-muted sm:text-[13px] sm:whitespace-nowrap">{period}</p>
      </div>

      <ul className="mt-2 sm:mt-3 space-y-1.5">
        {description.map((item, index) => (
          <li
            key={index}
            className="text-[13px] leading-relaxed text-muted sm:text-[14px]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
