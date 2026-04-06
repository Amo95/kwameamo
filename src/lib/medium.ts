import { XMLParser } from "fast-xml-parser";

export interface MediumPost {
  title: string;
  date: string;
  link: string;
}

const MEDIUM_FEED_URL = "https://medium.com/feed/@jameaamo";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function cleanLink(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    return parsed.toString();
  } catch {
    return url;
  }
}

export async function fetchMediumPosts(): Promise<MediumPost[]> {
  try {
    const response = await fetch(MEDIUM_FEED_URL, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      console.error("Medium RSS feed error:", response.status);
      return [];
    }

    const xml = await response.text();
    const parser = new XMLParser();
    const feed = parser.parse(xml);

    const items = feed?.rss?.channel?.item;
    if (!items) {
      return [];
    }

    const posts = Array.isArray(items) ? items : [items];

    return posts.map((item: { title: string; pubDate: string; link: string }) => ({
      title: item.title,
      date: formatDate(item.pubDate),
      link: cleanLink(item.link),
    }));
  } catch (error) {
    console.error("Failed to fetch Medium posts:", error);
    return [];
  }
}
