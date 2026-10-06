import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AuthorByline } from '@/components/legal-layout';
import { AUTHOR, EDITORIAL_STEPS, SITE_NAME, CONTACT_EMAIL } from '@/lib/site-identity';
import { SITE_URL, getCategoryUrl } from '@/lib/routes';
import { categories } from '@/content/categories';

export function generateStaticParams() {
  return [{ slug: AUTHOR.slug }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== AUTHOR.slug) return {};
  const title = `${AUTHOR.name} | Author Profile`;
  const description = AUTHOR.shortBio;
  const url = `${SITE_URL}/author/${AUTHOR.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'profile', siteName: SITE_NAME, images: [{ url: '/images/pages/about.webp', width: 1200, height: 630 }] },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== AUTHOR.slug) notFound();

  const url = `${SITE_URL}/author/${AUTHOR.slug}`;
  const isPerson = !AUTHOR.name.toLowerCase().includes('team');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url,
    mainEntity: {
      '@type': isPerson ? 'Person' : 'Organization',
      name: AUTHOR.name,
      description: AUTHOR.shortBio,
      url,
      ...(isPerson ? { jobTitle: AUTHOR.role, knowsAbout: AUTHOR.expertise, worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL } } : { knowsAbout: AUTHOR.expertise }),
      ...(AUTHOR.photo ? { image: `${SITE_URL}${AUTHOR.photo}` } : {}),
      ...(AUTHOR.sameAs.length ? { sameAs: AUTHOR.sameAs } : {}),
    },
  };

  return (
    <main className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="bg-navy-deep pb-16 pt-6 text-white">
        <div className="shell">
          <div className="[&_a]:text-white/70 [&_li]:text-white/60">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: AUTHOR.name, href: `/author/${AUTHOR.slug}` }]} />
          </div>
          <p className="eyebrow mt-4 text-mint">Author profile</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] sm:text-[3.2rem]">{AUTHOR.name}</h1>
          <p className="mt-2 text-lg text-mint">{AUTHOR.role}</p>
          <p className="mt-5 max-w-[var(--measure)] text-lg leading-relaxed text-white/75">{AUTHOR.shortBio}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {AUTHOR.expertise.map((e) => (
              <span key={e} className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/80">
                {e}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="shell grid gap-12 py-16 lg:grid-cols-[1fr_320px]">
        <article className="max-w-[var(--measure)] space-y-10">
          <section>
            <h2 className="font-display text-2xl font-semibold text-ink">About the team</h2>
            <div className="mt-4 space-y-4 text-[1.04rem] leading-relaxed text-ink/80">
              {AUTHOR.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ink">Hands-on experience</h2>
            <ul className="mt-4 space-y-2 text-ink/80">
              {AUTHOR.experience.map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  {x}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ink">Editorial process</h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
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
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-ink">Guides by this author</h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={getCategoryUrl(c.slug)} className="lift block rounded-xl border border-line bg-white px-4 py-3 font-medium text-ink hover:border-teal">
                    Wetherspoons {c.name} menu
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="space-y-5">
          <div className="sticky top-28 space-y-5">
            <div className="rounded-[24px] border border-line bg-white p-6 shadow-sm">
              <AuthorByline />
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-ink/50">Publisher</dt>
                  <dd className="font-medium text-ink">{SITE_NAME}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Contact</dt>
                  <dd>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-teal underline underline-offset-4">{CONTACT_EMAIL}</a>
                  </dd>
                </div>
                <div>
                  <dt className="text-ink/50">Affiliation</dt>
                  <dd className="font-medium text-ink">Independent, not affiliated with J D Wetherspoon plc</dd>
                </div>
              </dl>
              {AUTHOR.sameAs.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {AUTHOR.sameAs.map((s) => (
                    <li key={s}>
                      <a href={s} rel="me noopener" target="_blank" className="rounded-full border border-line px-3 py-1 text-xs text-ink/70 hover:border-teal">
                        {new URL(s).hostname.replace('www.', '')}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-[24px] bg-foam p-6 text-sm text-ink/80">
              Read our <Link href="/about" className="font-semibold text-teal underline underline-offset-4">editorial standards</Link> and{' '}
              <Link href="/disclaimer" className="font-semibold text-teal underline underline-offset-4">disclaimer</Link>.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
