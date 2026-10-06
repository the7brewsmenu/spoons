/**
 * Fix truncated product titles with proper short names
 */
import fs from 'fs';
import path from 'path';

const fixes: Record<string, string> = {
  'curry-club/mangalorean-cauliflower-spinach-curry.json': 'Wetherspoons Mangalorean Cauliflower Curry Price and Calories',
  'curry-club/sweet-potato-chickpea-spinach-curry.json': 'Wetherspoons Sweet Potato Chickpea Curry Price and Calories',
  'desserts/apple-blackberry-crumble.json': 'Wetherspoons Apple and Blackberry Crumble Price and Calories',
  'drinks-menu/coldwater-creek-pinot-grigio-175ml.json': 'Wetherspoons Pinot Grigio Glass Price and Calories',
  'steak-club/14oz-aberdeen-angus-rump-steak.json': 'Wetherspoons Aberdeen Angus Rump Steak Price and Calories',
  'chicken-dishes/southern-fried-chicken-strips-basket.json': 'Wetherspoons Southern Fried Chicken Strips Price and Calories',
};

const PRODUCTS_DIR = path.join(process.cwd(), 'content/generated/products');

for (const [relPath, newTitle] of Object.entries(fixes)) {
  const file = path.join(PRODUCTS_DIR, relPath);
  if (!fs.existsSync(file)) { console.log(`NOT FOUND: ${relPath}`); continue; }
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  console.log(`OLD: ${data.meta.title}`);
  data.meta.title = newTitle;
  console.log(`NEW: ${newTitle}`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
console.log('Done!');
