import Link from 'next/link';
import { infoMetadata } from '@/lib/metadata';
import { LegalLayout, List, Callout } from '@/components/legal-layout';
import { AUTHOR, EDITORIAL_STEPS, SITE_NAME } from '@/lib/site-identity';
import { menuItems } from '@/content/menu';
import { categories } from '@/content/categories';
import { cities } from '@/content/cities';

export const metadata = infoMetadata(
  'About SpoonsMenu | Independent Wetherspoons Menu Guide',
  'Who runs SpoonsMenu, how we research Wetherspoon menu prices, calories and allergens, our editorial standards, independence and corrections policy.',
  '/about',
  'about'
);

export default function AboutPage() {
  return (
    <LegalLayout
      slug="about"
      eyebrow="About us"
      title="About SpoonsMenu"
      intro={`${SITE_NAME} is an independent UK guide that makes the Wetherspoon menu easy to understand. We publish typical prices, calories, allergen notes and serving times so you can plan a visit with confidence.`}
      imageAlt="Exterior of a traditional British pub, representing the SpoonsMenu guide"
      summary={[
        { label: 'Menu items', value: String(menuItems.length) },
        { label: 'Menu sections', value: String(categories.length) },
        { label: 'City guides', value: String(cities.length) },
        { label: 'Reviewed', value: 'Monthly' },
      ]}
      sections={[
        {
          id: 'mission',
          title: 'Why we built this guide',
          body: (
            <>
              <p>Wetherspoon runs hundreds of pubs and its menu changes through the year. Prices differ by location, club deals rotate and allergen details can be hard to find quickly. We wanted one clear, fast place to answer everyday questions.</p>
              <List
                items={[
                  'What does a dish typically cost?',
                  'How many calories does it have?',
                  'Is it vegan, vegetarian or free from a specific allergen?',
                  'When is breakfast, Curry Club or Steak Club served?',
                ]}
              />
            </>
          ),
        },
        {
          id: 'team',
          title: 'Who is behind SpoonsMenu',
          body: (
            <>
              {AUTHOR.bio.slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                <Link href={`/author/${AUTHOR.slug}`} className="font-semibold text-teal underline underline-offset-4">
                  Read the full {AUTHOR.name} profile
                </Link>
              </p>
            </>
          ),
        },
        {
          id: 'method',
          title: 'How we research and check menus',
          body: (
            <ol className="grid gap-3 sm:grid-cols-2">
              {EDITORIAL_STEPS.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                  <p className="font-display text-lg font-semibold text-ink">
                    <span className="mr-2 text-teal">{i + 1}.</span>
                    {s.title}
                  </p>
                  <p className="mt-2 text-[0.95rem] text-ink/75">{s.text}</p>
                </li>
              ))}
            </ol>
          ),
        },
        {
          id: 'independence',
          title: 'Independence',
          body: (
            <Callout>
              We are not affiliated with, paid by or endorsed by J D Wetherspoon plc. No pub, brand or supplier can pay to change what we
              write. If we ever add advertising or affiliate links, they will be clearly labelled and kept separate from editorial content.
            </Callout>
          ),
        },
        {
          id: 'accuracy',
          title: 'Accuracy and corrections',
          body: (
            <>
              <p>Every page shows when it was last reviewed. We re-check content at least monthly and whenever a menu changes. When a reader reports an error, we verify it against official sources and normally correct it within 48 hours.</p>
              <p>
                See our <Link href="/disclaimer" className="text-teal underline underline-offset-4">disclaimer</Link> for the limits of typical prices and allergen information, or{' '}
                <Link href="/contact" className="text-teal underline underline-offset-4">contact us</Link> to report something.
              </p>
            </>
          ),
        },
        {
          id: 'ai',
          title: 'Use of technology',
          body: <p>We use software tools to organise menu data, check consistency and draft first versions of some descriptions. Every published page is reviewed by a human editor, and all prices, calories and allergens come from verified data, never generated guesses. Illustrative images are created for the site and are not photos of actual Wetherspoon dishes.</p>,
        },
      ]}
    />
  );
}
