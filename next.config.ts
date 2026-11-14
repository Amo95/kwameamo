import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is three pages now: these older pages are parts of the home page.
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: true },
      { source: "/experience", destination: "/#work", permanent: true },
      { source: "/blog", destination: "/#writing", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
