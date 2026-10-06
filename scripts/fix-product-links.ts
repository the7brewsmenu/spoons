/**
 * Add internal links to product page content.
 * Targets actual product JSON fields: quickAnswer, taste, value, nutrition, dietaryGuidance, FAQ answers.
 */
import fs from 'fs';
import path from 'path';
import { menuItems } from '../content/menu';

const PRODUCTS_DIR = path.join(process.cwd(), 'content/generated/products');
const LINK_STYLE = (text: string, href: string) => `[${text}](${href})`;

// Category slugs to names
const CATEGORIES: Record<string, string> = {
  'breakfast-menu': 'breakfast menu',
  'burgers': 'burgers',
  'chicken-dishes': 'chicken dishes',
  'curry-club': 'curry club',
  'desserts': 'desserts',
  'drinks-menu': 'drinks menu',
  'fish-dishes': 'fish dishes',
  'kids-menu': 'kids menu',
  'pizza': 'pizza',
  'sides': 'sides',
  'steak-club': 'steak club',
  'sunday-roasts': 'sunday roasts',
};

const INFO_PAGES: Record<string, string> = {
  'nutrition': '/nutrition-information',
  'calorie': '/nutrition-information',
  'calories': '/nutrition-information',
  'allergen': '/allergen-information',
  'allergens': '/allergen-information',
  'vegan': '/vegan-and-vegetarian-options',
  'vegetarian': '/vegan-and-vegetarian-options',
};

function hasLink(text: string): boolean {
  return /\[[^\]]+\]\(\//.test(text);
}

function addCategoryLink(text: string, category: string): string {
  if (hasLink(text)) return text; // Already has a link
  const catName = CATEGORIES[category];
  if (!catName) return text;
  
  // Try to link the category name naturally
  const patterns = [
    new RegExp(`\\b(${catName})\\b`, 'i'),
    new RegExp(`\\b(${catName.replace(/\s+/g, '\\s+')})\\s+(menu|section)`, 'i'),
  ];
  
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) {
      return text.replace(pat, `[${m[1]}](/${category})`);
    }
  }
  return text;
}

function addInfoLink(text: string, selfCategory: string): string {
  // Only add one info link per text block
  if (hasLink(text)) return text;
  
  for (const [keyword, href] of Object.entries(INFO_PAGES)) {
    // Don't add if already linked or if linking to self
    const re = new RegExp(`\\b(${keyword}\\s*information|${keyword}\\s*guide|${keyword}\\s*data|${keyword}\\s*details|check\\s+(?:the\\s+)?(?:current\\s+)?${keyword})`, 'i');
    const m = text.match(re);
    if (m) {
      return text.replace(re, `[${m[1]}](${href})`);
    }
  }
  return text;
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else if (entry.name.endsWith('.json')) files.push(full);
  }
  return files;
}

let totalLinks = 0;
let filesEdited = 0;

const files = walkDir(PRODUCTS_DIR);

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  let linksAdded = 0;
  const category = path.basename(path.dirname(file));
  const slug = data.slug || path.basename(file, '.json');
  const selfUrl = `/${category}/${slug}`;
  
  // 1. quickAnswer - add category link
  if (data.quickAnswer && !hasLink(data.quickAnswer)) {
    const before = data.quickAnswer;
    data.quickAnswer = addCategoryLink(data.quickAnswer, category);
    if (data.quickAnswer !== before) linksAdded++;
  }
  
  // 2. taste - add info page link (nutrition/allergen)
  if (data.taste && !hasLink(data.taste)) {
    const before = data.taste;
    data.taste = addInfoLink(data.taste, category);
    if (data.taste !== before) linksAdded++;
  }
  
  // 3. value - add category link if not already
  if (data.value && !hasLink(data.value)) {
    const before = data.value;
    data.value = addCategoryLink(data.value, category);
    if (data.value !== before) linksAdded++;
  }
  
  // 4. nutrition field - add nutrition info link
  if (data.nutrition && typeof data.nutrition === 'string' && !hasLink(data.nutrition)) {
    const before = data.nutrition;
    data.nutrition = addInfoLink(data.nutrition, category);
    if (data.nutrition !== before) linksAdded++;
  }
  
  // 5. dietaryGuidance - add allergen/vegan link
  if (data.dietaryGuidance && !hasLink(data.dietaryGuidance)) {
    const before = data.dietaryGuidance;
    data.dietaryGuidance = addInfoLink(data.dietaryGuidance, category);
    if (data.dietaryGuidance !== before) linksAdded++;
  }
  
  // 6. FAQ answers - add 1-2 links to FAQ answers
  if (data.faqs && Array.isArray(data.faqs)) {
    let faqLinksAdded = 0;
    for (const faq of data.faqs) {
      if (faqLinksAdded >= 2) break;
      if (!faq.answer || hasLink(faq.answer)) continue;
      
      const before = faq.answer;
      // Try category link first
      faq.answer = addCategoryLink(faq.answer, category);
      if (faq.answer !== before) { faqLinksAdded++; linksAdded++; continue; }
      
      // Try info link
      faq.answer = addInfoLink(faq.answer, category);
      if (faq.answer !== before) { faqLinksAdded++; linksAdded++; }
    }
  }
  
  if (linksAdded > 0) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    totalLinks += linksAdded;
    filesEdited++;
    console.log(`${path.relative(PRODUCTS_DIR, file)}: +${linksAdded} links`);
  }
}

console.log(`\nDone! Added ${totalLinks} links across ${filesEdited} files.`);
