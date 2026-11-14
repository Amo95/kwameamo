import { work, years } from "@/lib/work";

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

/** One row per role: logo, company, role and years. A click opens the highlights. Current roles first. */
export default function WorkList() {
  const roles = [...work].sort((a, b) => Number(b.current) - Number(a.current));
  return (
    <div className="mt-3 border-t border-border">
      {roles.map((w) => {
        const row = (
          <>
            {w.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={w.logo} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-border" />
            ) : (
              <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-foreground/[0.07] text-[10px] font-semibold text-muted">
                {initials(w.company)}
              </span>
            )}
            <span className="min-w-0">
              <b className="block truncate text-[14.5px] font-semibold text-foreground">{w.company.replace(/ ltd$/, "")}</b>
              <small className="block truncate text-[13px] text-muted">{w.role}</small>
            </span>
            <span className="whitespace-nowrap text-[12.5px] tabular-nums text-muted">{years(w.period)}</span>
            {w.description.length > 0 ? (
              <span aria-hidden="true" className="text-[12px] text-muted transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none">›</span>
            ) : <span />}
          </>
        );
        const grid = "grid grid-cols-[28px_minmax(0,1fr)_auto_14px] items-center gap-3 py-3";
        // A role without highlights is a plain row; the others open on click.
        return w.description.length === 0 ? (
          <div key={w.company} className={`${grid} border-b border-border`}>{row}</div>
        ) : (
          <details key={w.company} className="group border-b border-border">
            <summary className={`${grid} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>{row}</summary>
            <ul className="mb-4 ml-10 list-disc space-y-1.5 pl-4 text-[14px] leading-relaxed text-muted">
              {w.description.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
