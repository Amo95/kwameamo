const BASE_URL = "https://api.screenshotone.com/take";

const EXCLUDED_HOSTS = ["github.com"];

export function getScreenshotUrl(siteUrl: string): string | null {
  const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const host = new URL(siteUrl).hostname;
    if (EXCLUDED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return null;
  } catch {
    return null;
  }

  const params = new URLSearchParams({
    url: siteUrl,
    access_key: accessKey,
    viewport_width: "1280",
    viewport_height: "720",
    format: "webp",
    block_cookie_banners: "true",
    block_chats: "true",
    block_ads: "true",
    cache: "true",
    cache_ttl: "2592000",
  });

  return `${BASE_URL}?${params.toString()}`;
}
