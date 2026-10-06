import Link from 'next/link';
import { infoMetadata } from '@/lib/metadata';
import { LegalLayout, List, Callout, DataTable } from '@/components/legal-layout';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site-identity';

export const metadata = infoMetadata(
  'Contact SpoonsMenu | Corrections, Questions and Feedback',
  'Contact the SpoonsMenu editorial team to report a price change, correct menu details, ask a question or send feedback. Replies within two working days.',
  '/contact',
  'contact'
);

export default function ContactPage() {
  return (
    <LegalLayout
      slug="contact"
      eyebrow="Get in touch"
      title="Contact SpoonsMenu"
      intro="Found a price that has changed, a dish that is missing or a detail that looks wrong? Tell us. Reader reports are one of the main ways we keep this guide accurate."
      imageAlt="Bartender serving a pint, representing contacting the SpoonsMenu team"
      summary={[
        { label: 'Email', value: 'info@' },
        { label: 'Reply time', value: '2 working days' },
        { label: 'Corrections', value: 'Within 48 hrs' },
        { label: 'Orders', value: 'Not handled' },
      ]}
      sections={[
        {
          id: 'email',
          title: 'Email the editorial team',
          body: (
            <>
              <p>
                The quickest way to reach us is{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-teal underline underline-offset-4">{CONTACT_EMAIL}</a>. A member of the
                editorial team reads every message.
              </p>
              <Callout>
                We are an independent guide. We cannot take food orders, table bookings, refunds, job applications or complaints about a pub.
              </Callout>
            </>
          ),
        },
        {
          id: 'which',
          title: 'Who to contact for what',
          body: (
            <DataTable
              head={['Your question', 'Best contact']}
              rows={[
                ['A price, dish or calorie figure on this site is wrong', `${SITE_NAME}: ${CONTACT_EMAIL}`],
                ['Feedback or ideas for new guides', `${SITE_NAME}: ${CONTACT_EMAIL}`],
                ['Ordering, refunds or a problem at a pub', 'J D Wetherspoon customer services or the official app'],
                ['Severe allergy questions', 'Staff at the pub before you order'],
                ['Press or partnership enquiries', `${SITE_NAME}: ${CONTACT_EMAIL}`],
              ]}
            />
          ),
        },
        {
          id: 'corrections',
          title: 'How to report a correction',
          body: (
            <>
              <p>To help us fix things quickly, please include:</p>
              <List
                items={[
                  'The link to the page with the error.',
                  'What is wrong and what it should say.',
                  'The pub and town you visited, and roughly when.',
                  'A photo of the menu or app screen, if you have one.',
                ]}
              />
              <p>We check each report against official sources. Confirmed errors are normally corrected within 48 hours and the page review date is updated.</p>
            </>
          ),
        },
        {
          id: 'standards',
          title: 'Our editorial standards',
          body: (
            <p>
              Curious how we research menus? Read about our methods on the{' '}
              <Link href="/about" className="text-teal underline underline-offset-4">about page</Link> and meet the people behind the guide on the{' '}
              <Link href="/author/editorial-team" className="text-teal underline underline-offset-4">editorial team profile</Link>.
            </p>
          ),
        },
        {
          id: 'privacy',
          title: 'Your privacy',
          body: (
            <p>
              We only use your email to reply and keep messages for up to 24 months. Full details are in our{' '}
              <Link href="/privacy-policy" className="text-teal underline underline-offset-4">privacy policy</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
