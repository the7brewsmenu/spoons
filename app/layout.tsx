import type { Metadata } from 'next';
import { serif, sans } from './fonts';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://spoonsmenu.co.uk'),
  title: 'SpoonsMenu | Independent Wetherspoons Menu Guide',
  description:
    'An independent guide to the Wetherspoons menu with typical UK prices, calories, dietary notes and food club details.',
  verification: {
    google: '9nHkkhMyColv9C2zlyE85GDreqFwDn6_-wCofttKO4s',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
