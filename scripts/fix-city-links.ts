/**
 * Add internal links to city page content.
 * Targets city JSON fields: intro, pricing, breakfastAndClubs, tips FAQ answers.
 */
import fs from 'fs';
import path from 'path';

const CITIES_DIR = path.join(process.cwd(), 'content/generated/cities');

function hasLink(text: string): boolean {
  return /\[[^\]]+\]\(\//.test(text);
}

const HOMEPAGE_ANCHORS = [
  'Wetherspoons menu',
  'Spoons menu',
  'Wetherspoons menu UK',
  'Wetherspoons pub menu',
  'Wetherspoons food menu',
];
let anchorIdx = 0;

function getAnchor(): string {
  return HOMEPAGE_ANCHORS[anchorIdx++ % HOMEPAGE_ANCHORS.length];
}

const files = fs.readdirSync(CITIES_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => path.join(CITIES_DIR, f));

let totalLinks = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  let linksAdded = 0;
  const cityName = data.city || path.basename(file, '.json');
  
  // 1. pricing - add category links
  if (data.pricing && !hasLink(data.pricing)) {
    // Add link to burgers
    data.pricing = data.pricing.replace(
      /\b(burgers?)\b/i,
      '[burgers](/burgers)'
    );
    // Add link to breakfast-menu
    data.pricing = data.pricing.replace(
      /\b(breakfast)\b/i,
      '[breakfast](/breakfast-menu)'
    );
    if (data.pricing !== raw) linksAdded += 2;
  }
  
  // 2. breakfastAndClubs - add links to breakfast-times, curry-club, steak-club
  if (data.breakfastAndClubs) {
    if (!data.breakfastAndClubs.includes('[breakfast times]')) {
      data.breakfastAndClubs = data.breakfastAndClubs.replace(
        /\b(breakfast)\s+(is\s+served|runs|hours|times?|service)/i,
        '[breakfast](/breakfast-menu) $2'
      );
      linksAdded++;
    }
    if (!data.breakfastAndClubs.includes('[Curry')) {
      data.breakfastAndClubs = data.breakfastAndClubs.replace(
        /\b(Curry\s+[Cc]lub)/,
        '[$1](/curry-club)'
      );
      linksAdded++;
    }
    if (!data.breakfastAndClubs.includes('[Steak')) {
      data.breakfastAndClubs = data.breakfastAndClubs.replace(
        /\b(Steak\s+[Cc]lub)/,
        '[$1](/steak-club)'
      );
      linksAdded++;
    }
  }
  
  // 3. FAQ answers - add links
  if (data.faqs && Array.isArray(data.faqs)) {
    let faqFixed = 0;
    for (const faq of data.faqs) {
      if (faqFixed >= 2 || !faq.answer || hasLink(faq.answer)) continue;
      
      // Add nutrition link
      if (faq.answer.match(/\b(calorie|nutrition|nutritional)\b/i) && !faq.answer.includes('](/nutrition')) {
        faq.answer = faq.answer.replace(
          /\b(calorie\s+information|nutrition\s+information|nutritional\s+data|calorie\s+data)/i,
          '[$1](/nutrition-information)'
        );
        if (faq.answer.includes('](/nutrition')) { faqFixed++; linksAdded++; continue; }
      }
      
      // Add allergen link
      if (faq.answer.match(/\b(allergen)/i) && !faq.answer.includes('](/allergen')) {
        faq.answer = faq.answer.replace(
          /\b(allergen\s+information|allergen\s+details|allergen\s+data)/i,
          '[$1](/allergen-information)'
        );
        if (faq.answer.includes('](/allergen')) { faqFixed++; linksAdded++; continue; }
      }
      
      // Add locations link
      if (faq.answer.match(/\b(find|locate|search|list)/i) && !faq.answer.includes('](/locations')) {
        faq.answer = faq.answer.replace(
          /\b(find\s+(?:a\s+)?(?:pub|Wetherspoon))/i,
          '[$1](/locations)'
        );
        if (faq.answer.includes('](/locations')) { faqFixed++; linksAdded++; }
      }
    }
  }
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  totalLinks += linksAdded;
  console.log(`${path.basename(file)}: +${linksAdded} links`);
}

console.log(`\nDone! Added ${totalLinks} links across ${files.length} city files.`);
