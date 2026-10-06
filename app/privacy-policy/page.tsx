import Link from 'next/link';
import { infoMetadata } from '@/lib/metadata';
import { LegalLayout, List, Callout, DataTable } from '@/components/legal-layout';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site-identity';

export const metadata = infoMetadata(
  'Privacy Policy | SpoonsMenu',
  'How SpoonsMenu handles data: what we collect, cookies, analytics, hosting, your UK GDPR rights and how to contact us about privacy.',
  '/privacy-policy',
  'privacy-policy'
);

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      slug="privacy-policy"
      eyebrow="Legal"
      title="Privacy policy"
      intro={`${SITE_NAME} is an independent guide to Wetherspoon menus. We collect as little data as possible. This policy explains exactly what is collected when you use the site, why, and the rights you have under UK data protection law.`}
      imageAlt="Quiet corner of a traditional British pub representing SpoonsMenu privacy"
      summary={[
        { label: 'Accounts', value: 'None' },
        { label: 'Data sold', value: 'Never' },
        { label: 'Law', value: 'UK GDPR' },
        { label: 'Reply time', value: '30 days max' },
      ]}
      sections={[
        {
          id: 'who-we-are',
          title: 'Who we are',
          body: (
            <>
              <p>
                {SITE_NAME} (spoonsmenu.co.uk) is an independent information website. For the purposes of the UK General Data Protection
                Regulation (UK GDPR) and the Data Protection Act 2018, {SITE_NAME} is the data controller for the limited personal data
                described in this policy.
              </p>
              <p>
                We are not connected to J D Wetherspoon plc. Anything you do on the official Wetherspoon app or website, including ordering
                food or drink, is covered by their own privacy policy, not this one.
              </p>
            </>
          ),
        },
        {
          id: 'what-we-collect',
          title: 'What data we collect',
          body: (
            <>
              <p>You can read every page on this site without creating an account or giving us your name. The data we handle falls into three groups:</p>
              <DataTable
                head={['Data', 'Example', 'Why', 'Legal basis']}
                rows={[
                  ['Server logs', 'IP address, browser, page requested, time', 'Security, preventing abuse, fixing errors', 'Legitimate interests'],
                  ['Analytics', 'Pages viewed, approximate country, device type', 'Understand which guides help readers most', 'Consent where required, otherwise legitimate interests'],
                  ['Messages you send', 'Email address and the content of your email', 'Reply to questions and corrections', 'Legitimate interests'],
                ]}
              />
              <p>We do not knowingly collect special category data (such as health information) and we ask you not to send it to us. Allergy questions should go directly to the pub.</p>
            </>
          ),
        },
        {
          id: 'location',
          title: 'Location finder',
          body: (
            <p>
              The pub finder on our <Link href="/locations" className="text-teal underline underline-offset-4">locations page</Link> may ask your
              browser for your location. This only happens if you press the button and approve the browser prompt. Your coordinates are used
              inside your browser to sort results and are not stored on our servers.
            </p>
          ),
        },
        {
          id: 'cookies',
          title: 'Cookies',
          body: (
            <>
              <p>We keep cookies to a minimum. Strictly necessary cookies may be set by our hosting provider to deliver pages securely. Analytics cookies, if used, are only set in line with the Privacy and Electronic Communications Regulations (PECR).</p>
              <List
                items={[
                  'No advertising or cross-site tracking cookies are set by us.',
                  'You can block or delete cookies at any time in your browser settings.',
                  'Blocking cookies will not stop the menu guides from working.',
                ]}
              />
            </>
          ),
        },
        {
          id: 'sharing',
          title: 'Who we share data with',
          body: (
            <>
              <p>We never sell or rent personal data. We only use trusted processors that need data to run the site:</p>
              <List
                items={[
                  'Hosting and content delivery provider, to serve pages and keep the site secure.',
                  'Analytics provider, to produce aggregated visitor statistics.',
                  'Email provider, to receive and reply to messages.',
                ]}
              />
              <p>Some providers may process data outside the UK. Where this happens, we rely on UK adequacy regulations or the International Data Transfer Agreement to keep it protected.</p>
            </>
          ),
        },
        {
          id: 'retention',
          title: 'How long we keep data',
          body: (
            <DataTable
              head={['Data', 'Kept for']}
              rows={[
                ['Server logs', 'Up to 30 days'],
                ['Analytics', 'Up to 14 months, aggregated'],
                ['Emails', 'Up to 24 months, then deleted'],
              ]}
            />
          ),
        },
        {
          id: 'rights',
          title: 'Your rights',
          body: (
            <>
              <p>Under UK GDPR you have the right to:</p>
              <List
                items={[
                  'Access the personal data we hold about you.',
                  'Ask us to correct inaccurate data.',
                  'Ask us to delete your data.',
                  'Object to or restrict how we use it.',
                  'Withdraw consent at any time where we rely on consent.',
                ]}
              />
              <p>
                Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal underline underline-offset-4">{CONTACT_EMAIL}</a> to make a request. We respond within one month. If you are unhappy with our reply, you can complain to the Information Commissioner’s Office at ico.org.uk.
              </p>
            </>
          ),
        },
        {
          id: 'children',
          title: 'Children',
          body: <p>This site is a general audience menu guide. It is not directed at children under 13 and we do not knowingly collect their data. Pages mentioning alcohol are informational and intended for adults of legal drinking age.</p>,
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          body: (
            <Callout>
              We review this policy whenever we change how the site works, and at least once a year. The date at the top of the page always
              shows the latest review.
            </Callout>
          ),
        },
      ]}
    />
  );
}
