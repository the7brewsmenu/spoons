/**
 * Clean the opening of each category intro ("The [Wetherspoons menu](/) burger menu has...")
 * into natural English, then add one homepage link with a rotated main-keyword anchor.
 */
import fs from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'content/generated/categories');
const ANCHORS = ['Wetherspoons menu', 'Spoons menu', 'Wetherspoons food menu', 'Wetherspoons pub menu'];
let i = 0;

for (const f of fs.readdirSync(DIR).filter(x => x.endsWith('.json'))) {
  const file = path.join(DIR, f);
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  let intro: string = data.intro
    .replace(/^(The\s+)?(full\s+)?\[[^\]]+\]\(\/\)\s+/, 'The Wetherspoons ')
    .replace(/\[([^\]]+)\]\(\/\)/g, '$1')
    .replace(/^The Wetherspoons sunday/, 'The Wetherspoons Sunday');

  const dot = intro.indexOf('. ');
  const anchor = ANCHORS[i++ % ANCHORS.length];
  const link = ` It is one section of the full [${anchor}](/), and each pub sets its own prices.`;
  intro = dot === -1 ? intro + link : intro.slice(0, dot + 1) + link + intro.slice(dot + 1);

  data.intro = intro;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`${f}: ${intro.slice(0, 160)}`);
}
