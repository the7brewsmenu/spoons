/**
 * Fix broken anchor text in city intros from the old script.
 * Patterns like "This [Wetherspoons prices](/) Derby guide" → "This Wetherspoons Derby guide"
 * Then re-add a clean homepage link.
 */
import fs from 'fs';
import path from 'path';

const CITIES_DIR = path.join(process.cwd(), 'content/generated/cities');

const files = fs.readdirSync(CITIES_DIR).filter(f => f.endsWith('.json'));
let fixed = 0;

for (const fileName of files) {
  const file = path.join(CITIES_DIR, fileName);
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  
  if (data.intro) {
    const before = data.intro;
    
    // Remove ALL broken homepage anchors in intro
    // Pattern: [Anchor text](/) where anchor could be any of the homepage keywords
    data.intro = data.intro.replace(
      /\[([^\]]+)\]\(\/\)/g,
      '$1'
    );
    
    // Now cleanly add ONE homepage link if there isn't one
    if (!data.intro.includes('](/')) {
      // Link "Wetherspoons" naturally at first occurrence
      data.intro = data.intro.replace(
        /\bWetherspoons\b/,
        '[Wetherspoons menu](/) '
      );
      // Clean up any double space
      data.intro = data.intro.replace(/  +/g, ' ');
    }
    
    if (data.intro !== before) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
      fixed++;
      console.log(`FIXED: ${fileName}`);
    }
  }
}

console.log(`\nFixed ${fixed}/${files.length} city intros.`);
