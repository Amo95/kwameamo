interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

export async function fetchContributions(username: string): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN is not set");
    return null;
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: {
          username,
          from: `${new Date().getFullYear()}-01-01T00:00:00Z`,
          to: new Date().toISOString(),
        },
      }),
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      console.error("GitHub API error:", response.status);
      return null;
    }

    const json = await response.json();
    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      console.error("No contribution data found");
      return null;
    }

    const weeks: ContributionWeek[] = calendar.weeks;
    const lastDay = weeks.at(-1)?.contributionDays.at(-1);
    if (lastDay) {
      const lastDate = new Date(lastDay.date + "T00:00:00");
      const yearEnd = new Date(`${lastDate.getFullYear()}-12-31T00:00:00`);
      const nextDay = new Date(lastDate);
      nextDay.setDate(nextDay.getDate() + 1);

      while (nextDay <= yearEnd) {
        const dayOfWeek = nextDay.getDay();
        if (dayOfWeek === 0) {
          weeks.push({ contributionDays: [] });
        }
        weeks.at(-1)!.contributionDays.push({
          date: nextDay.toISOString().slice(0, 10),
          contributionCount: 0,
          contributionLevel: "NONE",
        });
        nextDay.setDate(nextDay.getDate() + 1);
      }
    }

    return {
      totalContributions: calendar.totalContributions,
      weeks,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return null;
  }
}
