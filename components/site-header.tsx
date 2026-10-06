import { getNavData, GUIDE_LINKS, COMPANY_LINKS } from '@/lib/nav';
import { HeaderClient } from '@/components/header-client';

/** Server wrapper: builds nav data from content at build time, then renders the interactive header. */
export function SiteHeader() {
  return <HeaderClient data={getNavData()} guides={GUIDE_LINKS} company={COMPANY_LINKS} />;
}
