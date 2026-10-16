export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
  currentWeek: number;
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
    // Round "to" down to the hour so the request body, and so the fetch cache key, is stable.
    const now = new Date();
    const to = new Date(Math.floor(now.getTime() / 3600000) * 3600000);
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
          from: `${now.getUTCFullYear()}-01-01T00:00:00Z`,
          to: to.toISOString(),
        },
      }),
      next: { revalidate: 3600 },
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
    const currentWeek = weeks.length - 1;

    // Pad the rest of the year with empty days so the grid always shows Jan to Dec.
    const lastDay = weeks.at(-1)?.contributionDays.at(-1);
    if (lastDay) {
      const day = new Date(`${lastDay.date}T00:00:00Z`);
      const yearEnd = Date.UTC(day.getUTCFullYear(), 11, 31);
      day.setUTCDate(day.getUTCDate() + 1);

      while (day.getTime() <= yearEnd) {
        if (day.getUTCDay() === 0) {
          weeks.push({ contributionDays: [] });
        }
        weeks.at(-1)!.contributionDays.push({
          date: day.toISOString().slice(0, 10),
          contributionCount: 0,
          contributionLevel: "NONE",
        });
        day.setUTCDate(day.getUTCDate() + 1);
      }
    }

    return {
      totalContributions: calendar.totalContributions,
      weeks,
      currentWeek,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return null;
  }
}
