import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getVisitorRegion, type Region } from "@/lib/geo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

function getRegionText(region: Region): string {
  switch (region) {
    case 'EU':
      return 'Open to EU relocation';
    case 'US':
      return 'Open to US relocation';
    case 'CA':
      return 'Open to Canada relocation';
    case 'OTHER':
      return 'Open for jobs';
  }
}

function getRegionShortText(region: Region): string {
  switch (region) {
    case 'EU':
      return 'Open to EU';
    case 'US':
      return 'Open to US';
    case 'CA':
      return 'Open to Canada';
    case 'OTHER':
      return 'Open for jobs';
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const region = await getVisitorRegion();
  const regionText = getRegionText(region);
  const regionShortText = getRegionShortText(region);

  return {
    metadataBase: new URL('https://kwameamo.com'),
    title: 'James Kwame Amo - Backend Software Engineer',
    description: `Backend software engineer with 4+ years of experience in fintech and investment banking. ${regionText}.`,
    openGraph: {
      title: 'James Kwame Amo',
      description: `Backend Software Engineer | Fintech | Investment Banking | ${regionShortText}`,
      url: 'https://kwameamo.com',
      siteName: 'James Kwame Amo',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'James Kwame Amo - Backend Software Engineer',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'James Kwame Amo',
      description: `Backend Software Engineer | Fintech | ${regionShortText}`,
      images: ['/og-image.png'],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <Navigation />
            <main className="py-8 sm:py-12 lg:py-16">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
