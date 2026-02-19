import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kwameamo.com";
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified },
    { url: `${baseUrl}/about`, lastModified },
    { url: `${baseUrl}/blog`, lastModified },
    { url: `${baseUrl}/contact`, lastModified },
    { url: `${baseUrl}/experience`, lastModified },
    { url: `${baseUrl}/projects`, lastModified },
    { url: `${baseUrl}/guestbook`, lastModified },
  ];
}
