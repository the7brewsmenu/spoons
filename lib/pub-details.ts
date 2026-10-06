import fs from 'fs';
import path from 'path';
import type { PubListing } from '@/lib/types';

export interface PubDetail {
  name: string;
  status?: PubListing['status'];
  address?: string;
  history?: string;
  nearestStation?: string;
  features?: string[];
  pubUrl?: string;
}

export interface CityDetails {
  city: string;
  localNote?: string;
  pubs: PubDetail[];
}

/** Load researched pub details for a city, if present. */
export function loadCityDetails(slug: string): CityDetails | null {
  const file = path.join(process.cwd(), 'content/pub-details', `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as CityDetails;
}

/** Merge researched details into pub listings, matched by pub name. */
export function mergePubDetails(pubs: PubListing[], details: CityDetails | null): PubListing[] {
  if (!details) return pubs;
  const norm = (s: string) => s.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]/g, '');
  return pubs.map((p) => {
    const d = details.pubs.find((x) => norm(x.name) === norm(p.name));
    if (!d) return p;
    return {
      ...p,
      status: d.status ?? p.status,
      address: d.address ?? p.address,
      history: d.history,
      nearestStation: d.nearestStation,
      features: d.features,
      pubUrl: d.pubUrl,
      sourceUrl: d.pubUrl ?? p.sourceUrl,
    };
  });
}
