import { headers } from 'next/headers';

export type Region = 'EU' | 'US' | 'CA' | 'OTHER';

const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
]);

export async function getVisitorRegion(): Promise<Region> {
  const headersList = await headers();
  const country = headersList.get('x-vercel-ip-country');

  if (!country) {
    return 'OTHER'; // Fallback for local dev
  }

  if (EU_COUNTRIES.has(country)) {
    return 'EU';
  }

  if (country === 'US') {
    return 'US';
  }

  if (country === 'CA') {
    return 'CA';
  }

  return 'OTHER';
}

export function getBadgeText(region: Region): string {
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

export function getAboutText(region: Region): string {
  switch (region) {
    case 'EU':
      return 'open to relocation opportunities in the European Union';
    case 'US':
      return 'open to relocation opportunities in the United States';
    case 'CA':
      return 'open to relocation opportunities in Canada';
    case 'OTHER':
      return 'open to new opportunities';
  }
}

export function getContactText(region: Region): string | null {
  switch (region) {
    case 'EU':
      return 'especially in the EU';
    case 'US':
      return 'especially in the US';
    case 'CA':
      return 'especially in Canada';
    case 'OTHER':
      return null; // Remove region-specific phrase
  }
}
