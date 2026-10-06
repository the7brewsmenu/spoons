import fs from 'fs';
import path from 'path';

const root = '.next/server/app';
const files: string[] = [];
const walk = (d: string) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) files.push(p);
  }
};
walk(root);

const issues: string[] = [];
const titles = new Map<string, string>();
let long = 0;
for (const f of files) {
  const h = fs.readFileSync(f, 'utf-8');
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] ?? '';
  const h1 = (h.match(/<h1/g) || []).length;
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? '';
  const name = f.replace(root, '');
  if (!t) issues.push(`NO TITLE ${name}`);
  if (t.includes('undefined')) issues.push(`UNDEFINED TITLE ${name}`);
  if (t.replace(/&amp;/g, '&').length > 65) long++;
  if (titles.has(t)) issues.push(`DUP TITLE ${name} = ${titles.get(t)}`);
  titles.set(t, name);
  if (h1 !== 1 && !name.includes('_not-found')) issues.push(`H1 x${h1} ${name}`);
  if (!desc) issues.push(`NO DESC ${name}`);
  if (/\]\(\//.test(h.replace(/<script[\s\S]*?<\/script>/g, ''))) issues.push(`RAW LINK ${name}`);
  if (/noindex/.test(h)) issues.push(`NOINDEX ${name}`);
  if (!/rel="canonical"/.test(h) && !name.includes('_not-found')) issues.push(`NO CANONICAL ${name}`);
}
console.log('pages', files.length, 'titles>65', long);
console.log(issues.slice(0, 40).join('\n') || 'NO ISSUES');
console.log('total issues', issues.length);
