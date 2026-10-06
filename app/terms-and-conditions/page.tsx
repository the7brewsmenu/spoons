import Link from 'next/link';
import { infoMetadata } from '@/lib/metadata';
import { LegalLayout, List, Callout } from '@/components/legal-layout';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site-identity';

export const metadata = infoMetadata(
  'Terms and Conditions | SpoonsMenu',
  'The terms for using SpoonsMenu: acceptable use, accuracy of prices and allergens, intellectual property, trademarks, liability and governing law.',
  '/terms-and-conditions',
  'terms-and-conditions'
);

export default function TermsPage() {
  return (
    <LegalLayout
      slug="terms-and-conditions"
      eyebrow="Legal"
      title="Terms and conditions"
      intro={`These terms explain the rules for using ${SITE_NAME}. By using the site you agree to them. They are written in plain English so you know exactly where you stand.`}
      imageAlt="Traditional wooden pub bar representing SpoonsMenu terms and conditions"
      summary={[
        { label: 'Cost to use', value: 'Free' },
        { label: 'Affiliation', value: 'Independent' },
        { label: 'Prices', value: 'Typical only' },
        { label: 'Law', value: 'England & Wales' },
      ]}
      sections={[
        {
          id: 'about',
          title: 'About these terms',
          body: (
            <p>
              {SITE_NAME} provides free, independent information about Wetherspoon pub menus, prices, calories, allergens and locations. These
              terms apply to everyone who visits spoonsmenu.co.uk. Please also read our{' '}
              <Link href="/privacy-policy" className="text-teal underline underline-offset-4">privacy policy</Link> and{' '}
              <Link href="/disclaimer" className="text-teal underline underline-offset-4">disclaimer</Link>.
            </p>
          ),
        },
        {
          id: 'independence',
          title: 'Independence and trademarks',
          body: (
            <>
              <Callout>
                {SITE_NAME} is not owned by, operated by, sponsored by or affiliated with J D Wetherspoon plc.
              </Callout>
              <p>“Wetherspoon”, “Wetherspoons”, “JD Wetherspoon” and related names are trademarks of their respective owner. We use them only to describe the menus we write about, which is permitted descriptive use. No endorsement is implied.</p>
            </>
          ),
        },
        {
          id: 'accuracy',
          title: 'Accuracy of information',
          body: (
            <>
              <p>We work hard to keep every page correct, but menus change and prices vary between pubs. In particular:</p>
              <List
                items={[
                  'Prices are typical ranges, not a quote. Airport, station and London pubs often charge more.',
                  'Calories are taken from published labelling and may change with recipes or portion sizes.',
                  'Allergen information is a guide only. Always confirm with pub staff before ordering.',
                  'Opening and serving times differ by pub.',
                ]}
              />
              <p>You must not rely on this site as the only source for medical, dietary or allergy decisions.</p>
            </>
          ),
        },
        {
          id: 'use',
          title: 'Acceptable use',
          body: (
            <>
              <p>You may browse, share links to and quote short parts of our pages with credit. You must not:</p>
              <List
                items={[
                  'Copy or republish substantial parts of the site without written permission.',
                  'Scrape the site automatically in a way that harms performance.',
                  'Attempt to break, overload or gain unauthorised access to the site.',
                  'Use the site for any unlawful purpose.',
                ]}
              />
            </>
          ),
        },
        {
          id: 'ip',
          title: 'Intellectual property',
          body: <p>The original text, page design, data tables and images created for {SITE_NAME} are our property or used under licence. Menu item names belong to their respective owners and are used for identification only.</p>,
        },
        {
          id: 'links',
          title: 'External links',
          body: <p>We link to official Wetherspoon pages and other useful sites. We are not responsible for their content, availability or privacy practices. A link is not an endorsement.</p>,
        },
        {
          id: 'liability',
          title: 'Limitation of liability',
          body: (
            <>
              <p>The site is provided free of charge “as is”. To the extent permitted by law, we are not liable for any loss arising from use of, or reliance on, the information here, including price differences or unavailable items.</p>
              <p>Nothing in these terms limits liability that cannot be limited under English law, such as liability for death or personal injury caused by negligence, or for fraud.</p>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to these terms',
          body: <p>We may update these terms when the site changes. The latest version is always on this page, with the review date shown above. Continued use means you accept the updated terms.</p>,
        },
        {
          id: 'law',
          title: 'Governing law and contact',
          body: (
            <p>
              These terms are governed by the laws of England and Wales, and the courts of England and Wales have jurisdiction. Questions can be
              sent to <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal underline underline-offset-4">{CONTACT_EMAIL}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
