import type { Metadata } from 'next';
import Script from 'next/script';
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-TQK7JGTT"
          strategy="afterInteractive"
        />
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8331873410180225"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
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
