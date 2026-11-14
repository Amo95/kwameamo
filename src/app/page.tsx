import Link from "next/link";
import { getVisitorRegion, getBadgeText } from "@/lib/geo";
import { fetchContributions } from "@/lib/github";
import { showsStreakIntro, streakStats } from "@/lib/streak";
import { displayName, isRecent, timeAgo } from "@/lib/activity";
import { getLatestActivity } from "@/lib/activity-store";
import ContributionGraph from "@/components/ContributionGraph";
import StreakIntro from "@/components/StreakIntro";
import ProjectRef from "@/components/ProjectRef";
import { CompanyRef, Prose } from "@/components/InlineRef";
import { projectBySlug } from "@/lib/projects";

async function loadGitHub() {
  const [contributions, activity] = await Promise.all([fetchContributions("amo95"), getLatestActivity()]);
  if (!contributions) return null;
  const now = new Date();
  const name = activity && displayName(activity.repo);
  const live =
    activity && name && isRecent(activity.pushedAt, now) ? { name, ago: timeAgo(activity.pushedAt, now) } : null;
  return {
    ...contributions,
    year: contributions.weeks[0]?.contributionDays[0]?.date.slice(0, 4),
    stats: streakStats(contributions.weeks, now.toISOString().slice(0, 10)),
    live,
  };
}

export default async function Home() {
  const region = await getVisitorRegion();
  const badgeText = getBadgeText(region);
  const github = await loadGitHub();
  return (
    <>
      {github && showsStreakIntro(github.stats) && (
        <StreakIntro days={github.stats.current} isBest={github.stats.current === github.stats.best} />
      )}
      <section className="flex flex-col gap-6 sm:gap-8 animate-fade-in-up">
        {/* Hero */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            James Kwame Amo
          </h1>
          <p className="text-[15px] font-medium text-foreground sm:text-[16px]">
            Backend Software Engineer
          </p>
          <p className="max-w-xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
            Building scalable systems in fintech and investment banking. Most
            recently at Tunic Pay, previously Morgan Stanley.
          </p>
        </div>

        {/* Location-based badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[13px] text-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            {badgeText}
          </span>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <Link
            href="https://github.com/amo95"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-muted transition-colors hover:text-foreground sm:text-[14px]"
          >
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/james-amo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-muted transition-colors hover:text-foreground sm:text-[14px]"
          >
            LinkedIn
          </Link>
          <Link
            href="mailto:kwame.amo.james@gmail.com"
            className="text-[13px] text-muted transition-colors hover:text-foreground sm:text-[14px]"
          >
            Email
          </Link>
        </div>

        {/* What I do, in words: companies link to their site, projects open their details. */}
        <div className="mt-2 border-t border-border pt-6 sm:mt-4 sm:pt-8">
          <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">Recently</h2>
          <Prose>
            At <CompanyRef name="Tunic Pay" href="https://tunicpay.com" logo="/logos/tunicpay.png" /> I built async
            step-up for partner banks, rolled out isolated deployments for 8 of them, and led the team that made fraud
            check results stream in, cutting about 90% of the wait for first results. Mostly Go, with Temporal on GCP.
          </Prose>
        </div>

        <div>
          <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">Previously</h2>
          <Prose>
            Spent nearly four years at{" "}
            <CompanyRef name="Morgan Stanley" href="https://www.morganstanley.com" logo="/logos/morganstanley.png" />{" "}
            working on structured equity products, automating confirms generation, building trade reflow tools, and
            improving developer efficiency across the team.
          </Prose>
        </div>

        <div>
          <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">Building</h2>
          <Prose>
            I co-founded <CompanyRef name="Infusi Technologies" href="https://github.com/infusi-gh" logo="/logos/infusi.png" />,
            a software agency for mobile and web. Our main product is <ProjectRef project={projectBySlug("oncall")} />,
            on-call and incident management that pages engineers by SMS, even on 2G.
          </Prose>
          <Prose>
            On my own I make small products. <ProjectRef project={projectBySlug("showup")} /> checks you in when you
            arrive at the gym, church or library. <ProjectRef project={projectBySlug("supawake")} /> keeps free
            Supabase databases from pausing. <ProjectRef project={projectBySlug("invoica")} /> makes invoices with no
            account needed, and <ProjectRef project={projectBySlug("spiidi")} /> is an AI tutor I built end to end for
            a client.
          </Prose>
          <Prose>
            For my own work there is <ProjectRef project={projectBySlug("swipefile")} />, which turns designers&apos;
            posts into design breakdowns to study, and <ProjectRef project={projectBySlug("devkit")} />, the Claude
            Code setup I use in every project.
          </Prose>
        </div>

        {github && (
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-[14px] font-semibold uppercase tracking-wider text-muted">
                GitHub
              </h2>
              <p className="text-[12px] text-muted sm:text-[13px]">
                {github.totalContributions.toLocaleString("en-US")} contributions in {github.year}
              </p>
            </div>
            <div className="mt-3">
              <ContributionGraph
                totalContributions={github.totalContributions}
                weeks={github.weeks}
                currentWeek={github.currentWeek}
                profileUrl="https://github.com/amo95"
                stats={github.stats}
                live={github.live}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
