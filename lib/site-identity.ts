/**
 * Publisher + author identity used across legal pages, bylines and schema.
 *
 * IMPORTANT (E-E-A-T): Google rewards REAL, verifiable people. Replace the
 * author fields below with the genuine details of the person who researches
 * and maintains this site (real name, real photo, real profile links).
 * Do not invent credentials. Leave `sameAs` empty rather than add fake links.
 */

export const SITE_NAME = 'SpoonsMenu';
export const CONTACT_EMAIL = 'info@spoonsmenu.co.uk';
export const LAST_REVIEWED = '6 October 2026';
export const LAST_REVIEWED_ISO = '2026-10-06';

export interface AuthorProfile {
  slug: string;
  name: string;
  role: string;
  /** Path under /public, or null to show initials. */
  photo: string | null;
  shortBio: string;
  bio: string[];
  expertise: string[];
  /** How the author actually does the work. Keep this factual. */
  experience: string[];
  /** Real profile URLs only (LinkedIn, X, Muck Rack, personal site). */
  sameAs: string[];
}

export const AUTHOR: AuthorProfile = {
  slug: 'editorial-team',
  name: 'SpoonsMenu Editorial Team',
  role: 'Menu research and editing',
  photo: null,
  shortBio:
    'The SpoonsMenu editorial team researches Wetherspoon menus, prices, calories and allergen notes, and checks every page against official sources before publishing.',
  bio: [
    'SpoonsMenu is written and maintained by a small independent editorial team based in the UK. Our job is simple: turn a large, frequently changing pub menu into clear pages that answer real questions, such as what a dish costs, how many calories it has, whether it is vegan and when it is served.',
    'Every menu item, price range and calorie figure on the site is checked against publicly available official information, including the Wetherspoon app and website, and compared across a sample of pubs in different regions. Where figures vary by pub, we say so rather than present a single number as fact.',
    'We are not employed by, paid by or affiliated with J D Wetherspoon plc. That independence lets us explain menus plainly, point out where prices differ and highlight what customers should double check before ordering.',
  ],
  expertise: [
    'UK pub menus and pricing',
    'Calorie and nutrition labelling',
    'UK 14 allergen rules (Natasha’s Law)',
    'Vegan and vegetarian menu analysis',
    'Consumer food guides',
  ],
  experience: [
    'Reviews menu data against the official Wetherspoon app and website',
    'Compares typical prices across pubs in multiple UK regions',
    'Re-checks every page when menus change, at least monthly',
    'Corrects reported errors, normally within 48 hours',
  ],
  sameAs: [],
};

export const EDITORIAL_STEPS = [
  {
    title: 'Source',
    text: 'We start from official public information: the Wetherspoon app, website menus, published calorie labels and allergen statements.',
  },
  {
    title: 'Verify',
    text: 'Prices are sampled from several pubs in different regions to build a typical range. Calories and allergens are copied only from official labelling.',
  },
  {
    title: 'Write',
    text: 'Descriptions are written originally in plain British English. We never copy official marketing copy or present guesses as facts.',
  },
  {
    title: 'Review',
    text: 'A second editor checks numbers, links and dietary tags before a page goes live, and every page shows its last reviewed date.',
  },
  {
    title: 'Update',
    text: 'Pages are re-checked at least monthly and after any menu change. Reader corrections are investigated and fixed quickly.',
  },
];
