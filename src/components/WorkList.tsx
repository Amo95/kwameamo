import { work, years, type Work } from "@/lib/work";

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

/**
 * One row per role: logo, company, role and years; a click opens the highlights. Current roles first, and contracts
 * done through an employer sit under it.
 */
export default function WorkList() {
  const roles = work.filter((w) => !w.via).sort((a, b) => Number(b.current) - Number(a.current));
  return (
    // Grey bands with small gaps (Swipe File's table): the outer corners round, no lines.
    <div className="mt-3 flex flex-col gap-1.5 overflow-hidden rounded-3xl">
      {roles.flatMap((w) => [
        <Role key={w.company} w={w} />,
        ...work.filter((c) => c.via === w.company).map((c) => <Role key={c.company} w={c} contract />),
      ])}
    </div>
  );
}

function Role({ w, contract = false }: { w: Work; contract?: boolean }) {
  const row = (
    <>
      {w.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={w.logo} alt="" className="h-7 w-7 rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-panel-2 text-[10px] font-semibold text-muted">
          {initials(w.company)}
        </span>
      )}
      <span className="min-w-0">
        <b className="block truncate text-[14.5px] font-semibold text-foreground">{w.company.replace(/ ltd$/, "")}</b>
        <small className="block text-[13px] leading-snug text-muted">{w.role}{contract && ` · contract via ${w.via}`}</small>
      </span>
      <span className="whitespace-nowrap text-[12.5px] tabular-nums text-muted">{years(w.period)}</span>
      {w.description.length > 0 ? (
        <span aria-hidden="true" className="text-[12px] text-muted transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none">›</span>
      ) : <span />}
    </>
  );
  // Contracts sit indented under their employer.
  const grid = `grid grid-cols-[28px_minmax(0,1fr)_auto_14px] items-center gap-3 py-3.5 pr-4 ${contract ? "pl-9 sm:pl-14" : "pl-4 sm:pl-5"}`;
  // A role without highlights is a plain row; the others open on click.
  return w.description.length === 0 ? (
    <div className={`${grid} bg-panel`}>{row}</div>
  ) : (
    <details className="group bg-panel">
      <summary className={`${grid} cursor-pointer list-none transition-colors hover:bg-panel-2 [&::-webkit-details-marker]:hidden`}>{row}</summary>
      <ul className={`list-disc space-y-1.5 pb-4 pr-5 text-[14px] leading-relaxed text-muted ${contract ? "ml-[76px] sm:ml-24" : "ml-14 sm:ml-[60px]"}`}>
        {w.description.map((d) => <li key={d}>{d}</li>)}
      </ul>
    </details>
  );
}
