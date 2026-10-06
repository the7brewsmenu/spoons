import fs from 'fs';
import path from 'path';
import { menuItems } from '../content/menu';

const dir = 'content/generated/products';
let n = 0;
for (const item of menuItems) {
  const p = path.join(dir, item.category, `${item.slug}.json`);
  if (!fs.existsSync(p)) { console.log('MISSING', p); continue; }
  const d = JSON.parse(fs.readFileSync(p, 'utf-8').replace(/^\uFEFF/, ''));
  d.meta.title = `Wetherspoons ${item.name} Price and Calories 2026`;
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n', 'utf-8');
  n++;
}
console.log('fixed', n);
