/**
 * Rewrite the keyword-stuffed first sentence of every city intro into clean English,
 * preserving the area details, then add one natural homepage link.
 */
import fs from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'content/generated/cities');
const NAMES: Record<string, string> = { 'stoke-on-trent': 'Stoke-on-Trent' };
const titleCase = (s: string) => NAMES[s] ?? s.replace(/(^|-)([a-z])/g, (_, d, c) => (d ? ' ' : '') + c.toUpperCase());

for (const f of fs.readdirSync(DIR).filter(x => x.endsWith('.json'))) {
  const file = path.join(DIR, f);
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const city = titleCase(f.replace('.json', ''));
  const intro: string = data.intro.replace(/\[([^\]]+)\]\(\/\)/g, '$1');

  const dot = intro.indexOf('. ');
  const first = dot === -1 ? intro : intro.slice(0, dot);
  const rest = dot === -1 ? '' : intro.slice(dot + 1);

  const m = first.match(/\{areaCount\}\s+(?:listed\s+)?areas(.*)$/);
  let tail = m ? m[1] : '';
  tail = tail.replace(new RegExp(`^\\s+in\\s+${city}`, 'i'), '');

  const newFirst = `This guide covers {pubCount} open Wetherspoons pubs in ${city} across {areaCount} areas${tail}`;
  const linkLine = ` Every pub works from the national [Wetherspoons menu](/), but prices are set locally.`;
  data.intro = `${newFirst}.${linkLine}${rest}`.replace(/ {2,}/g, ' ').replace(/ \n/g, '\n');

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`${f}: ${newFirst}`);
}
