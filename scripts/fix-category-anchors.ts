/**
 * Fix awkward anchors in category JSON intros.
 * e.g. "The [Wetherspoons food menu](/) burger menu has..." → clean link
 */
import fs from 'fs';
import path from 'path';

const CATS_DIR = path.join(process.cwd(), 'content/generated/categories');
const files = fs.readdirSync(CATS_DIR).filter(f => f.endsWith('.json'));
let fixed = 0;

for (const fileName of files) {
  const file = path.join(CATS_DIR, fileName);
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  let changed = false;
  
  // Fix intro
  if (data.intro) {
    const before = data.intro;
    // Replace awkward [Wetherspoons prices](/) and similar with clean [Wetherspoons menu](/)
    data.intro = data.intro
      .replace(/\[Wetherspoons prices\]\(\/\)/g, '[Wetherspoons menu](/)')
      .replace(/\[Wetherspoons food menu\]\(\/\)/g, '[Wetherspoons menu](/)')
      .replace(/\[Wetherspoons menu UK\]\(\/\)/g, '[Wetherspoons menu](/)')
      .replace(/\[Wetherspoons pub menu\]\(\/\)/g, '[Wetherspoons menu](/)')
      .replace(/\[Spoons menu prices\]\(\/\)/g, '[Spoons menu](/)')
      .replace(/\[JD Wetherspoon menu\]\(\/\)/g, '[Wetherspoons menu](/)');
    if (data.intro !== before) changed = true;
  }
  
  // Fix comparison too
  if (data.comparison) {
    const before = data.comparison;
    data.comparison = data.comparison
      .replace(/\[Wetherspoons prices\]\(\/\)/g, '[Wetherspoons menu](/)')
      .replace(/\[Wetherspoons food menu\]\(\/\)/g, '[Wetherspoons menu](/)')
      .replace(/\[Wetherspoons menu UK\]\(\/\)/g, '[Wetherspoons menu](/)')
      .replace(/\[Wetherspoons pub menu\]\(\/\)/g, '[Wetherspoons menu](/)')
      .replace(/\[Spoons menu prices\]\(\/\)/g, '[Spoons menu](/)')
      .replace(/\[JD Wetherspoon menu\]\(\/\)/g, '[Wetherspoons menu](/)');
    if (data.comparison !== before) changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    fixed++;
    console.log(`FIXED: ${fileName}`);
  }
}

console.log(`\nFixed ${fixed}/${files.length} category files.`);
