import type { FactPack } from './facts';
import { fill, fillDeep } from '@/lib/content-facts';

/* Quality gate for generated content. Returns a list of human readable issues;
   an empty list means the page passes. Issues are fed back to the model on retry. */

const BANNED_PHRASES = [
  'delicious', 'mouth-watering', 'mouthwatering', 'nestled', 'delve', 'elevate', 'culinary journey',
  'look no further', 'in conclusion', "whether you're", 'whether you are', 'must-try', 'must try',
  'tantalising', 'tantalizing', 'indulge', 'hidden gem', 'vibrant', 'a feast for', 'treat yourself',
  'satisfy your cravings', 'perfect for any occasion',
];

const BANNED_CLAIMS = ['official', 'guaranteed', 'always available', 'allergen free', 'allergen-free', 'cheapest in the uk'];

const US_SPELLINGS: Record<string, string> = {
  color: 'colour', flavor: 'flavour', flavors: 'flavours', flavorful: 'flavourful', favorite: 'favourite',
  favorites: 'favourites', center: 'centre', centers: 'centres', fries: 'chips', appetizer: 'starter',
  appetizers: 'starters', savory: 'savoury', honor: 'honour', neighborhood: 'neighbourhood', organize: 'organise',
  customize: 'customise', customized: 'customised', recognize: 'recognise', realize: 'realise', specialty: 'speciality',
  gray: 'grey', catalog: 'catalogue', fiber: 'fibre', liter: 'litre', analyze: 'analyse',
};

/** Capitalised words allowed mid-sentence on city pages without being in the fact pack. */
const GENERIC_NOUNS = new Set([
  'Wetherspoon', 'Wetherspoons', 'Spoons', 'SpoonsMenu', 'JD', 'J', 'D', 'UK', 'British', 'English', 'Scottish',
  'Welsh', 'Irish', 'Curry', 'Club', 'Steak', 'Fish', 'Friday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Saturday', 'Yorkshire', 'I', 'App', 'Google', 'Maps', 'Christmas', 'Sunday', 'Plc', 'TV',
]);

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function collectStrings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => collectStrings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => collectStrings(x, out));
  return out;
}

function range(issues: string[], label: string, text: string, min: number, max: number) {
  const n = words(text ?? '');
  if (n < min || n > max) issues.push(`${label} has ${n} words, needs ${min} to ${max}`);
}

function count(issues: string[], label: string, list: unknown[], min: number, max: number) {
  const n = list?.length ?? 0;
  if (n < min || n > max) issues.push(`${label} has ${n} items, needs ${min} to ${max}`);
}

function sentenceCase(issues: string[], label: string, heading: string, allowed: Set<string>) {
  const rest = heading.split(/\s+/).slice(1);
  const bad = rest.filter((w) => /^[A-Z][a-z]/.test(w) && !allowed.has(w.replace(/[^A-Za-z']/g, '')));
  if (bad.length) issues.push(`${label} "${heading}" is not sentence case (${bad.join(', ')})`);
}

/* ── Shared checks ───────────────────────────────────────────────── */

function styleChecks(data: unknown, pack: FactPack, issues: string[]) {
  const all = collectStrings(data);
  const joined = all.join('\n');
  const lower = joined.toLowerCase();

  if (/[\u2014\u2013]/.test(joined)) issues.push('Contains an em dash or en dash. Replace with commas, full stops or "to".');
  if (/\p{Extended_Pictographic}/u.test(joined)) issues.push('Contains an emoji.');
  if (joined.includes('!')) issues.push('Contains an exclamation mark.');

  for (const p of BANNED_PHRASES) if (lower.includes(p)) issues.push(`Uses banned phrase "${p}".`);
  for (const c of BANNED_CLAIMS) {
    // "official" is allowed only in the phrase "official allergen/nutrition information" or "official pub page".
    if (c === 'official') {
      const hits = lower.match(/official(?! (allergen|nutrition|menu|wetherspoon app|app|information|pub page))/g);
      if (hits) issues.push('Uses "official" outside "official allergen/nutrition information". SpoonsMenu is independent.');
      continue;
    }
    if (lower.includes(c)) issues.push(`Makes a banned claim: "${c}".`);
  }
  for (const [us, uk] of Object.entries(US_SPELLINGS)) {
    if (new RegExp(`\\b${us}\\b`, 'i').test(joined)) issues.push(`US spelling "${us}": use "${uk}".`);
  }

  // Typed numbers that must come from placeholders.
  if (/£\s?\d/.test(joined)) issues.push('Contains a typed price. Use {price}, {minPrice}, {maxPrice} or {avgPrice}.');
  if (/\d[\d,]*\s?(kcal|calories)\b/i.test(joined.replace(/2,000 kcal/g, ''))) {
    issues.push('Contains a typed calorie number. Use "{calories} kcal".');
  }

  // Placeholders must exist for this page.
  const used = new Set([...joined.matchAll(/\{(\w+)\}/g)].map((m) => m[1]));
  for (const u of used) if (!(u in pack.vars)) issues.push(`Uses placeholder {${u}} which is not available for this page.`);
}

function metaChecks(meta: { title: string; description: string }, pack: FactPack, issues: string[], longName = false) {
  const title = fill(meta?.title ?? '', pack.vars);
  const desc = fill(meta?.description ?? '', pack.vars);
  const [tMin, tMax] = longName ? [30, 60] : [50, 59];
  if (title.length < tMin || title.length > tMax) issues.push(`meta.title is ${title.length} characters, needs ${tMin} to ${tMax}: "${title}"`);
  if (/[|\u2014\u2013]/.test(title)) issues.push('meta.title must not contain a pipe or dash.');
  if (desc.length < 140 || desc.length > 158) issues.push(`meta.description is ${desc.length} characters once filled, needs 140 to 158.`);
  if (!/wetherspoon|spoons/i.test(title)) issues.push('meta.title must contain "Wetherspoons".');
  if (!/wetherspoon|spoons/i.test(desc)) issues.push('meta.description must contain "Wetherspoons".');
}

function faqChecks(faqs: { question: string; answer: string }[], min: number, max: number, issues: string[]) {
  count(issues, 'faqs', faqs, min, max);
  (faqs ?? []).forEach((f, i) => {
    if (!f.question?.trim().endsWith('?')) issues.push(`faqs[${i}] question must end with a question mark.`);
    range(issues, `faqs[${i}].answer`, f.answer, 35, 90);
  });
  const qs = new Set((faqs ?? []).map((f) => f.question.toLowerCase()));
  if (qs.size !== (faqs ?? []).length) issues.push('faqs contain duplicate questions.');
}

/* ── Per type ────────────────────────────────────────────────────── */

/* eslint-disable @typescript-eslint/no-explicit-any */
export function validate(data: any, pack: FactPack): string[] {
  const issues: string[] = [];
  styleChecks(data, pack, issues);

  if (pack.type === 'product') {
    const longName = String((pack.facts as any).dishName).length > 32;
    metaChecks(data.meta, pack, issues, longName);
    range(issues, 'subtitle', data.subtitle, 10, 28);
    range(issues, 'quickAnswer', data.quickAnswer, 38, 72);
    count(issues, 'components', data.components, 2, 7);
    range(issues, 'taste', data.taste, 85, 150);
    if ('price' in pack.vars) range(issues, 'value', data.value, 65, 130);
    range(issues, 'nutrition', data.nutrition, 55, 120);
    range(issues, 'dietaryGuidance', data.dietaryGuidance, 55, 120);
    count(issues, 'bestFor', data.bestFor, 3, 4);
    count(issues, 'pairings', data.pairings, 2, 4);
    for (const p of data.pairings ?? []) {
      if (!pack.validPairingSlugs?.includes(p.slug)) issues.push(`pairings slug "${p.slug}" is not in pairingCandidates.`);
    }
    count(issues, 'tips', data.tips, 3, 5);
    faqChecks(data.faqs, 6, 8, issues);
    (data.bestFor ?? []).forEach((b: any) => sentenceCase(issues, 'bestFor title', b.title, GENERIC_NOUNS));
  }

  if (pack.type === 'category') {
    metaChecks(data.meta, pack, issues);
    range(issues, 'intro', data.intro, 60, 110);
    range(issues, 'quickAnswer', data.quickAnswer, 45, 90);
    count(issues, 'overview', data.overview, 3, 5);
    const total = (data.overview ?? []).reduce((n: number, s: any) => n + words(s.body ?? ''), 0);
    if (total < 380 || total > 850) issues.push(`overview totals ${total} words, needs 380 to 850.`);
    (data.overview ?? []).forEach((s: any) => sentenceCase(issues, 'overview heading', s.heading, GENERIC_NOUNS));
    for (const [k, available] of Object.entries(pack.highlightAvailability ?? {})) {
      const text = data.highlights?.[k] ?? '';
      if (available) range(issues, `highlights.${k}`, text, 15, 50);
    }
    range(issues, 'timing', data.timing, 60, 130);
    range(issues, 'deals', data.deals, 70, 150);
    range(issues, 'calorieGuide', data.calorieGuide, 70, 150);
    range(issues, 'allergenSummary', data.allergenSummary, 70, 140);
    range(issues, 'dietary', data.dietary, 70, 150);
    range(issues, 'ordering', data.ordering, 60, 130);
    count(issues, 'bestChoices', data.bestChoices, 4, 6);
    (data.bestChoices ?? []).forEach((b: any) => sentenceCase(issues, 'bestChoices title', b.title, GENERIC_NOUNS));
    count(issues, 'howToChoose', data.howToChoose, 4, 5);
    range(issues, 'comparison', data.comparison, 70, 140);
    faqChecks(data.faqs, 8, 14, issues);
  }

  if (pack.type === 'city') {
    metaChecks(data.meta, pack, issues);
    range(issues, 'intro', data.intro, 50, 95);
    range(issues, 'quickAnswer', data.quickAnswer, 42, 80);
    const got = (data.areas ?? []).map((a: any) => a.area);
    for (const a of pack.requiredAreas ?? []) if (!got.includes(a)) issues.push(`areas is missing "${a}".`);
    for (const a of got) if (!pack.requiredAreas?.includes(a)) issues.push(`areas contains unknown area "${a}".`);
    (data.areas ?? []).forEach((a: any) => range(issues, `areas "${a.area}"`, a.text, 30, 80));
    range(issues, 'pricing', data.pricing, 85, 160);
    range(issues, 'breakfastAndClubs', data.breakfastAndClubs, 65, 130);
    count(issues, 'tips', data.tips, 4, 5);
    faqChecks(data.faqs, 6, 8, issues);

    // Proper nouns: every capitalised word mid-sentence must come from the fact pack.
    const allowed = new Set(GENERIC_NOUNS);
    for (const n of pack.allowedNouns ?? []) n.split(/[\s,]+/).forEach((w) => { const clean = w.replace(/[^A-Za-z'&-]/g, '').replace(/'s$/, ''); if (clean) allowed.add(clean); });
    const text = collectStrings(fillDeep(data, pack.vars)).join(' \n ');
    const unknown = new Set<string>();
    for (const sentence of text.split(/(?<=[.?:])\s+|\n/)) {
      const tokens = sentence.trim().split(/\s+/).slice(1);
      for (const t of tokens) {
        const w = t.replace(/[^A-Za-z'&-]/g, '').replace(/'s$/, '');
        if (/^[A-Z][a-z]/.test(w) && !allowed.has(w)) unknown.add(w);
      }
    }
    if (unknown.size) {
      issues.push(`Mentions names not in the facts (remove them unless they are ordinary words): ${[...unknown].slice(0, 12).join(', ')}.`);
    }
  }

  return issues;
}

/* ── Similarity across pages ─────────────────────────────────────── */

function shingles(text: string) {
  const w = text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i < w.length - 2; i++) set.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return set;
}

export function similarPairs(docs: { slug: string; text: string }[], threshold = 0.45) {
  const sets = docs.map((d) => ({ slug: d.slug, s: shingles(d.text) }));
  const pairs: { a: string; b: string; score: number }[] = [];
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const a = sets[i].s;
      const b = sets[j].s;
      let inter = 0;
      for (const x of a) if (b.has(x)) inter++;
      const score = inter / (a.size + b.size - inter || 1);
      if (score > threshold) pairs.push({ a: sets[i].slug, b: sets[j].slug, score: Number(score.toFixed(2)) });
    }
  }
  return pairs;
}
