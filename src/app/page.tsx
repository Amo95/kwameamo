import Link from "next/link";
import { fetchMediumPosts } from "@/lib/medium";
import WorkList from "@/components/WorkList";
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

const H2 = "text-[13px] font-semibold uppercase tracking-wider text-muted";
const QUIET_LINK = "text-muted transition-colors hover:text-foreground";

export default async function Home() {
  const [region, github, posts] = await Promise.all([getVisitorRegion(), loadGitHub(), fetchMediumPosts()]);
  const badgeText = getBadgeText(region);
  return (
    <>
      {github && showsStreakIntro(github.stats) && (
        <StreakIntro days={github.stats.current} isBest={github.stats.current === github.stats.best} />
      )}
      <section className="flex flex-col gap-10 animate-fade-in-up sm:gap-12">
        {/* Who I am */}
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">James Kwame Amo</h1>
          <p className="mt-2 text-[15px] font-medium text-foreground sm:text-[16px]">Backend Software Engineer</p>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
            Building scalable systems in fintech and investment banking.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Accra, Ghana · {badgeText}
            </span>
            <Link href="mailto:kwame.amo.james@gmail.com" className={QUIET_LINK}>Email</Link>
            <Link href="https://github.com/amo95" target="_blank" rel="noopener noreferrer" className={QUIET_LINK}>GitHub</Link>
            <Link href="https://linkedin.com/in/james-amo" target="_blank" rel="noopener noreferrer" className={QUIET_LINK}>LinkedIn</Link>
          </div>
        </header>

        {/* What I do now, in words: companies open their site, projects open their details. */}
        <div id="now" className="border-t border-border pt-8">
          <h2 className={H2}>Now</h2>
          <Prose>
            I&apos;ve been a full-time engineer at{" "}
            <CompanyRef name="Turntabl" href="https://turntabl.io" logo="/logos/turntabl.png" /> since 2020, working
            on contract with its clients. Most recently at{" "}
            <CompanyRef name="Tunic Pay" href="https://tunicpay.com" logo="/logos/tunicpay.png" /> I built async step-up
            for partner banks and led the team that made fraud check results stream in, cutting about 90% of the wait
            for first results. Before that I spent nearly four years at{" "}
            <CompanyRef name="Morgan Stanley" href="https://www.morganstanley.com" logo="/logos/morganstanley.png" />{" "}
            on structured equity products.
          </Prose>
          <Prose>
            I co-founded <CompanyRef name="Infusi" href="https://github.com/infusi-gh" logo="/logos/infusi.png" />, where
            we build <ProjectRef project={projectBySlug("oncall")} />, on-call and incident management that pages
            engineers by SMS, even on 2G. On my own I make small products like{" "}
            <ProjectRef project={projectBySlug("showup")} /> and <ProjectRef project={projectBySlug("supawake")} />,
            and tools I use every day, like <ProjectRef project={projectBySlug("swipefile")} /> and{" "}
            <ProjectRef project={projectBySlug("devkit")} />.{" "}
            <Link href="/projects" className="whitespace-nowrap text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
              All projects &rarr;
            </Link>
          </Prose>
        </div>

        <div id="work">
          <h2 className={H2}>Work</h2>
          <WorkList />
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            BSc Computer Science, Koforidua Technical University. Java, Scala, Kotlin, Go, Python and SQL, with Spring
            Boot, Temporal, PostgreSQL and Kafka.
          </p>
        </div>

        {github && (
          <div id="github">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className={H2}>GitHub</h2>
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

        {posts.length > 0 && (
          <div id="writing">
            <h2 className={H2}>Writing</h2>
            <ul className="mt-3 border-t border-border">
              {posts.map((post) => (
                <li key={post.link} className="border-b border-border">
                  <Link
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-baseline justify-between gap-4 py-3 text-[14.5px] text-foreground transition-colors hover:text-muted"
                  >
                    <span className="min-w-0">{post.title}</span>
                    <span className="shrink-0 text-[12.5px] text-muted">{post.date} &#8599;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* How to reach me */}
        <div id="contact" className="border-t border-border pt-8">
          <p className="text-[22px] font-semibold tracking-tight text-foreground">Say hi.</p>
          <p className="mt-1 text-[15px] text-muted">
            Open to conversations about backend engineering, fintech and new roles.
          </p>
          <Link href="mailto:kwame.amo.james@gmail.com" className="mt-3 inline-block text-[16px] text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
            kwame.amo.james@gmail.com
          </Link>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
            <a href="/cv" target="_blank" rel="noopener" className={QUIET_LINK}>Download CV</a>
            <Link href="/guestbook" className={QUIET_LINK}>Leave a note on the Wall &rarr;</Link>
          </div>
        </div>
      </section>
    </>
  );
}
