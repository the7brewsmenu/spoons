import { Fraunces, Inter } from 'next/font/google';

// next/font downloads and self-hosts these at build time, so the browser
// never makes a request to Google. Swap to next/font/local if licensed
// font files are added later.
export const serif = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  axes: ['opsz', 'SOFT'],
});

export const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
