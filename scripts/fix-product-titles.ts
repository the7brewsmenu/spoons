/**
 * Fix all product meta titles to follow the pattern:
 * "Wetherspoons {Name} Price and Calories"
 */
import fs from 'fs';
import path from 'path';

const PRODUCTS_DIR = path.join(process.cwd(), 'content/generated/products');
let fixed = 0;
let skipped = 0;
let total = 0;

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else if (entry.name.endsWith('.json')) files.push(full);
  }
  return files;
}

const files = walkDir(PRODUCTS_DIR);

for (const file of files) {
  total++;
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  
  if (!data.meta?.title) {
    console.log(`SKIP (no meta.title): ${path.relative(PRODUCTS_DIR, file)}`);
    skipped++;
    continue;
  }
  
  const title = data.meta.title as string;
  const lower = title.toLowerCase();
  const hasPrice = lower.includes('price');
  const hasCalories = lower.includes('calori');
  
  if (hasPrice && hasCalories) {
    skipped++;
    continue;
  }
  
  // Extract product name from the title - remove "Wetherspoons" prefix and suffixes
  let name = title
    .replace(/^Wetherspoons\s+/i, '')
    .replace(/\s*:.*$/, '')  // Remove everything after colon
    .replace(/\s+(Price|Calories|Guide|Details|Menu|Allergen|Info|Information|and\s+Allergens?|Ordering).*$/i, '')
    .trim();
  
  // Capitalize properly
  if (name.length > 0) {
    const newTitle = `Wetherspoons ${name} Price and Calories`;
    
    // Check length - should be under 60 chars
    if (newTitle.length > 65) {
      // Shorten the name
      const shortName = name.length > 30 ? name.substring(0, 30).trim() : name;
      data.meta.title = `Wetherspoons ${shortName} Price and Calories`;
    } else {
      data.meta.title = newTitle;
    }
    
    console.log(`FIXED: ${path.relative(PRODUCTS_DIR, file)}`);
    console.log(`  OLD: ${title}`);
    console.log(`  NEW: ${data.meta.title}`);
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    fixed++;
  }
}

console.log(`\nDone! Fixed ${fixed}/${total} files. Skipped ${skipped} (already correct).`);
