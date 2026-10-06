import fs from 'fs';
import path from 'path';
import { menuItems } from '../content/menu';
import { categories } from '../content/categories';
import { cities } from '../content/cities';

const ROOT = path.join(__dirname, '..');
const GEN = path.join(ROOT, 'content', 'generated');

// Build lookup maps
const catSlugs = categories.map(c => c.slug);
const catNames: Record<string, string> = {};
categories.forEach(c => { catNames[c.slug] = c.name; });
const productsByCategory: Record<string, { name: string; slug: string }[]> = {};
menuItems.forEach(item => {
  if (!productsByCategory[item.category]) productsByCategory[item.category] = [];
  productsByCategory[item.category].push({ name: item.name, slug: item.slug });
});

// Internal link targets with diverse anchors
const HOMEPAGE_ANCHORS = [
  'Wetherspoons menu', 'Wetherspoons menu UK', 'Wetherspoons menu prices',
  'Wetherspoon menu prices', 'Wetherspoons food menu', 'Wetherspoons prices',
  'Wetherspoons menu 2026', 'JD Wetherspoon menu', 'Wetherspoons pub menu',
  'Spoons menu', 'Spoons menu prices', 'full Wetherspoons menu'
];
let anchorIdx = 0;
function nextHomeAnchor() { return HOMEPAGE_ANCHORS[anchorIdx++ % HOMEPAGE_ANCHORS.length]; }

// Related categories map
const RELATED: Record<string, string[]> = {
  'breakfast-menu': ['drinks-menu', 'sides'],
  'burgers': ['chicken-dishes', 'pizza', 'sides'],
  'pizza': ['burgers', 'sides', 'drinks-menu'],
  'chicken-dishes': ['burgers', 'curry-club', 'sides'],
  'curry-club': ['steak-club', 'sides', 'drinks-menu'],
  'steak-club': ['curry-club', 'burgers', 'sides'],
  'fish-dishes': ['sides', 'sunday-roasts', 'drinks-menu'],
  'sunday-roasts': ['fish-dishes', 'steak-club', 'desserts'],
  'desserts': ['drinks-menu', 'kids-menu'],
  'drinks-menu': ['burgers', 'pizza', 'curry-club'],
  'sides': ['burgers', 'pizza', 'chicken-dishes'],
  'kids-menu': ['sides', 'desserts', 'drinks-menu'],
};

function hasLink(text: string, href: string): boolean {
  return text.includes(`](${href})`);
}

function addLinkOnce(text: string, phrase: string, href: string): string {
  if (hasLink(text, href)) return text;
  // Find exact phrase (case insensitive) that's not already inside a link
  const re = new RegExp(`(?<!\\[)\\b(${escapeRegex(phrase)})\\b(?![^\\[]*\\])`, 'i');
  return text.replace(re, `[$1](${href})`);
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── CATEGORY PAGES ──────────────────────────────────────────────
let totalLinksAdded = 0;

for (const catSlug of catSlugs) {
  const filePath = path.join(GEN, 'categories', `${catSlug}.json`);
  if (!fs.existsSync(filePath)) continue;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let linksAdded = 0;
  const catProducts = productsByCategory[catSlug] || [];
  const related = RELATED[catSlug] || [];

  // Add links in intro
  if (data.intro) {
    // Homepage link with main keyword
    if (!hasLink(data.intro, '/')) {
      const anchor = nextHomeAnchor();
      data.intro = data.intro.replace(
        /Wetherspoons/i,
        `[${anchor}](/)`
      );
      // Only if it actually inserted
      if (hasLink(data.intro, '/')) linksAdded++;
    }
  }

  // Add links in overview bodies
  if (data.overview && Array.isArray(data.overview)) {
    let productLinked = 0;
    let catLinked = 0;
    for (const section of data.overview) {
      if (!section.body) continue;
      
      // Link to nutrition page where calories/nutrition mentioned
      if (/calori|nutrition/i.test(section.body) && !hasLink(section.body, '/nutrition-information')) {
        section.body = addLinkOnce(section.body, 'nutrition', '/nutrition-information');
        if (hasLink(section.body, '/nutrition-information')) linksAdded++;
      }
      
      // Link to allergen page where allergen mentioned
      if (/allergen/i.test(section.body) && !hasLink(section.body, '/allergen-information')) {
        section.body = addLinkOnce(section.body, 'allergen', '/allergen-information');
        if (hasLink(section.body, '/allergen-information')) linksAdded++;
      }

      // Link to products mentioned by name (max 3 per category)
      if (productLinked < 3) {
        for (const p of catProducts) {
          if (productLinked >= 3) break;
          const href = `/${catSlug}/${p.slug}`;
          if (hasLink(section.body, href)) continue;
          if (section.body.includes(p.name)) {
            section.body = addLinkOnce(section.body, p.name, href);
            if (hasLink(section.body, href)) { linksAdded++; productLinked++; }
          }
        }
      }
      
      // Link to related categories (max 2)
      if (catLinked < 2) {
        for (const rc of related) {
          if (catLinked >= 2) break;
          const href = `/${rc}`;
          if (hasLink(section.body, href)) continue;
          const name = catNames[rc];
          if (name && section.body.toLowerCase().includes(name.toLowerCase())) {
            section.body = addLinkOnce(section.body, name, href);
            if (hasLink(section.body, href)) { linksAdded++; catLinked++; }
          }
        }
      }
    }
  }

  // Add links in comparison section
  if (data.comparison) {
    for (const rc of related.slice(0, 2)) {
      const href = `/${rc}`;
      const name = catNames[rc];
      if (name && !hasLink(data.comparison, href) && data.comparison.includes(name)) {
        data.comparison = addLinkOnce(data.comparison, name, href);
        if (hasLink(data.comparison, href)) linksAdded++;
      }
    }
  }

  // Add links in FAQ answers
  if (data.faqs && Array.isArray(data.faqs)) {
    let faqLinked = 0;
    for (const faq of data.faqs) {
      if (faqLinked >= 3) break;
      // Link to allergen page in allergen FAQ
      if (/allergen/i.test(faq.question) && !hasLink(faq.answer, '/allergen-information')) {
        faq.answer = addLinkOnce(faq.answer, 'allergen information', '/allergen-information');
        if (!hasLink(faq.answer, '/allergen-information')) {
          faq.answer = addLinkOnce(faq.answer, 'allergen', '/allergen-information');
        }
        if (hasLink(faq.answer, '/allergen-information')) { linksAdded++; faqLinked++; }
      }
      // Link to calorie/nutrition in calorie FAQ
      if (/calori/i.test(faq.question) && !hasLink(faq.answer, '/nutrition-information')) {
        faq.answer = addLinkOnce(faq.answer, 'nutrition', '/nutrition-information');
        if (hasLink(faq.answer, '/nutrition-information')) { linksAdded++; faqLinked++; }
      }
      // Link to vegan page in vegan FAQ
      if (/vegan/i.test(faq.question) && !hasLink(faq.answer, '/vegan-and-vegetarian-options')) {
        faq.answer = addLinkOnce(faq.answer, 'vegan', '/vegan-and-vegetarian-options');
        if (hasLink(faq.answer, '/vegan-and-vegetarian-options')) { linksAdded++; faqLinked++; }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Category ${catSlug}: +${linksAdded} links`);
  totalLinksAdded += linksAdded;
}

// ─── PRODUCT PAGES ──────────────────────────────────────────────
for (const catSlug of catSlugs) {
  const dir = path.join(GEN, 'products', catSlug);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const catProducts = productsByCategory[catSlug] || [];
  const related = RELATED[catSlug] || [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const mySlug = file.replace('.json', '');
    let linksAdded = 0;

    // Link intro to parent category
    if (data.intro) {
      const catHref = `/${catSlug}`;
      const catName = catNames[catSlug];
      if (catName && !hasLink(data.intro, catHref)) {
        // Try linking the category name
        if (data.intro.toLowerCase().includes(catName.toLowerCase())) {
          data.intro = addLinkOnce(data.intro, catName, catHref);
        } else {
          data.intro = addLinkOnce(data.intro, catName.toLowerCase(), catHref);
        }
        if (hasLink(data.intro, catHref)) linksAdded++;
      }
    }

    // Link in overview to nutrition/allergen
    if (data.overview && Array.isArray(data.overview)) {
      for (const section of data.overview) {
        if (!section.body) continue;
        if (/calori|nutrition/i.test(section.body) && !hasLink(section.body, '/nutrition-information')) {
          section.body = addLinkOnce(section.body, 'nutrition', '/nutrition-information');
          if (hasLink(section.body, '/nutrition-information')) linksAdded++;
        }
        if (/allergen/i.test(section.body) && !hasLink(section.body, '/allergen-information')) {
          section.body = addLinkOnce(section.body, 'allergen', '/allergen-information');
          if (hasLink(section.body, '/allergen-information')) linksAdded++;
        }
      }
    }

    // Link comparison to related products
    if (data.comparison) {
      let compLinked = 0;
      for (const p of catProducts) {
        if (compLinked >= 2) break;
        if (p.slug === mySlug) continue;
        const href = `/${catSlug}/${p.slug}`;
        if (hasLink(data.comparison, href)) continue;
        if (data.comparison.includes(p.name)) {
          data.comparison = addLinkOnce(data.comparison, p.name, href);
          if (hasLink(data.comparison, href)) { linksAdded++; compLinked++; }
        }
      }
      // Link to a related category
      for (const rc of related.slice(0, 1)) {
        const href = `/${rc}`;
        const name = catNames[rc];
        if (name && !hasLink(data.comparison, href) && data.comparison.includes(name)) {
          data.comparison = addLinkOnce(data.comparison, name, href);
          if (hasLink(data.comparison, href)) linksAdded++;
        }
      }
    }

    // FAQ answers: allergen and nutrition links
    if (data.faqs && Array.isArray(data.faqs)) {
      let faqLinked = 0;
      for (const faq of data.faqs) {
        if (faqLinked >= 2) break;
        if (/allergen/i.test(faq.question) && !hasLink(faq.answer, '/allergen-information')) {
          faq.answer = addLinkOnce(faq.answer, 'allergen information', '/allergen-information');
          if (!hasLink(faq.answer, '/allergen-information')) {
            faq.answer = addLinkOnce(faq.answer, 'allergen', '/allergen-information');
          }
          if (hasLink(faq.answer, '/allergen-information')) { linksAdded++; faqLinked++; }
        }
        if (/calori/i.test(faq.question) && !hasLink(faq.answer, '/nutrition-information')) {
          faq.answer = addLinkOnce(faq.answer, 'nutrition', '/nutrition-information');
          if (hasLink(faq.answer, '/nutrition-information')) { linksAdded++; faqLinked++; }
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    if (linksAdded > 0) {
      console.log(`  Product ${catSlug}/${mySlug}: +${linksAdded} links`);
      totalLinksAdded += linksAdded;
    }
  }
}

// ─── CITY PAGES ──────────────────────────────────────────────────
const cityDir = path.join(GEN, 'cities');
if (fs.existsSync(cityDir)) {
  const files = fs.readdirSync(cityDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(cityDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const citySlug = file.replace('.json', '');
    let linksAdded = 0;

    // Intro: homepage link
    if (data.intro && !hasLink(data.intro, '/')) {
      const anchor = nextHomeAnchor();
      const replaced = data.intro.replace(/Wetherspoons/i, `[${anchor}](/)`);
      if (replaced !== data.intro) { data.intro = replaced; linksAdded++; }
    }

    // Overview: link to categories mentioned
    if (data.overview && Array.isArray(data.overview)) {
      let cityLinked = 0;
      for (const section of data.overview) {
        if (!section.body || cityLinked >= 4) continue;
        for (const catSlug of catSlugs) {
          if (cityLinked >= 4) break;
          const name = catNames[catSlug];
          const href = `/${catSlug}`;
          if (name && !hasLink(section.body, href) && section.body.includes(name)) {
            section.body = addLinkOnce(section.body, name, href);
            if (hasLink(section.body, href)) { linksAdded++; cityLinked++; }
          }
        }
        // Nutrition/allergen
        if (/calori|nutrition/i.test(section.body) && !hasLink(section.body, '/nutrition-information')) {
          section.body = addLinkOnce(section.body, 'nutrition', '/nutrition-information');
          if (hasLink(section.body, '/nutrition-information')) linksAdded++;
        }
      }
    }

    // FAQ answers: link to locations hub
    if (data.faqs && Array.isArray(data.faqs)) {
      for (const faq of data.faqs) {
        if (/location|find|near/i.test(faq.question) && !hasLink(faq.answer, '/locations')) {
          faq.answer = addLinkOnce(faq.answer, 'locations', '/locations');
          if (hasLink(faq.answer, '/locations')) linksAdded++;
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    if (linksAdded > 0) {
      console.log(`City ${citySlug}: +${linksAdded} links`);
      totalLinksAdded += linksAdded;
    }
  }
}

console.log(`\nDone! Total internal links added: ${totalLinksAdded}`);
