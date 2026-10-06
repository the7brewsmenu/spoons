import Link from 'next/link';
import { infoMetadata } from '@/lib/metadata';
import { LegalLayout, List, Callout, DataTable } from '@/components/legal-layout';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site-identity';

export const metadata = infoMetadata(
  'Disclaimer | SpoonsMenu Independent Wetherspoons Guide',
  'Important information about SpoonsMenu: independence from J D Wetherspoon, how typical prices work, allergen and calorie limitations, and how to report errors.',
  '/disclaimer',
  'disclaimer'
);

export default function DisclaimerPage() {
  return (
    <LegalLayout
      slug="disclaimer"
      eyebrow="Legal"
      title="Disclaimer"
      intro={`${SITE_NAME} is an independent guide. Please read this page to understand how our prices, calories and allergen notes are produced and where their limits are.`}
      imageAlt="Pub menu and pint on a table representing the SpoonsMenu disclaimer"
      sections={[
        {
          id: 'independent',
          title: 'Independent, unofficial guide',
          body: (
            <>
              <Callout>
                {SITE_NAME} is not the official Wetherspoon website and is not affiliated with, endorsed by or connected to J D Wetherspoon plc.
              </Callout>
              <p>For orders, official menus and pub specific details, use the official Wetherspoon app or website. We do not take orders, bookings or payments.</p>
            </>
          ),
        },
        {
          id: 'prices',
          title: 'How our prices work',
          body: (
            <>
              <p>Wetherspoon sets prices pub by pub. The same dish can cost noticeably more in central London or an airport than in a market town. We show a <strong>typical price</strong>, which is a representative figure drawn from a sample of pubs.</p>
              <DataTable
                head={['Pub type', 'What to expect']}
                rows={[
                  ['Typical high street pub', 'Close to the price shown'],
                  ['Central London and city centres', 'Often higher'],
                  ['Airports, stations and motorway sites', 'Usually the highest'],
                ]}
              />
              <p>Club deals and drink inclusions can also differ by pub and change without notice.</p>
            </>
          ),
        },
        {
          id: 'allergens',
          title: 'Allergens and dietary information',
          body: (
            <>
              <p>Our allergen and dietary tags are based on publicly available information. Recipes, suppliers and kitchen practices change, and shared kitchens carry a cross contamination risk.</p>
              <List
                items={[
                  'Always tell staff about any allergy before you order.',
                  'Check the latest allergen information in the official app.',
                  'Never rely on this site alone if you have a severe allergy.',
                ]}
              />
              <p>See our <Link href="/allergen-information" className="text-teal underline underline-offset-4">allergen guide</Link> for more context.</p>
            </>
          ),
        },
        {
          id: 'nutrition',
          title: 'Calories and nutrition',
          body: <p>Calorie figures come from published labelling and are rounded. Portions, sides and sauces change totals. This information is general and is not medical or dietetic advice.</p>,
        },
        {
          id: 'alcohol',
          title: 'Alcohol',
          body: <p>Drink pages are informational and intended for adults of legal drinking age. Please drink responsibly. UK guidance recommends no more than 14 units a week, spread over several days. Visit drinkaware.co.uk for support.</p>,
        },
        {
          id: 'images',
          title: 'Images',
          body: <p>Images on this site are illustrative. They are created for {SITE_NAME} and do not show exact Wetherspoon dishes, portion sizes, pubs or branding.</p>,
        },
        {
          id: 'errors',
          title: 'Reporting errors',
          body: (
            <p>
              Spotted a wrong price or a missing dish? Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal underline underline-offset-4">{CONTACT_EMAIL}</a> with the page link and, if possible, the pub you visited. We investigate every report and normally correct confirmed errors within 48 hours.
            </p>
          ),
        },
      ]}
    />
  );
}
