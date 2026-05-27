export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { "User-Agent": "bot" },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(
      /<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i
    ) ?? html.match(
      /content="([^"]+)"\s+(?:property|name)="og:image"/i
    );

    if (!match?.[1]) return null;

    const ogUrl = match[1];
    if (ogUrl.startsWith("http")) return ogUrl;
    const base = new URL(url);
    return new URL(ogUrl, base.origin).href;
  } catch {
    return null;
  }
}
