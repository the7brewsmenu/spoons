#!/usr/bin/env tsx
/**
 * Content generator CLI.
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts --type product --limit 3 --dry-run
 *   npx tsx scripts/generate-content.ts --type product --only traditional-breakfast
 *   npx tsx scripts/generate-content.ts --type category
 *   npx tsx scripts/generate-content.ts --type city --force
 *   npx tsx scripts/generate-content.ts --all
 *
 * Environment (read from .env.local automatically):
 *   OPENAI_API_KEY        required (or ANTHROPIC_API_KEY + CONTENT_PROVIDER=anthropic)
 *   CONTENT_MODEL         override model name (default: gpt-6.1-sol)
 *   CONTENT_PROVIDER      openai | anthropic (default: openai if OPENAI_API_KEY is set)
 *   CONTENT_CONCURRENCY   parallel requests (default: 3)
 */

import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

import { menuItems } from '@/content/menu';
import { cities } from '@/content/cities';
import { CATEGORY_SLUGS, type CategorySlug } from '@/lib/types';
import { ProductBody, CategoryBody, CityBody } from '@/lib/content-schemas';
import { GENERATED_ROOT } from '@/lib/generated-content';

import { productFacts, categoryFacts, cityFacts, type FactPack } from './content/facts';
import { SYSTEM_PROMPT, buildPrompt, feedbackPrompt } from './content/prompts';
import { getProvider, costUsd, type Usage, type Provider } from './content/providers';
import { validate, similarPairs } from './content/validate';

/* ── env loader ──────────────────────────────────────────────────── */

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

/* ── CLI parsing ─────────────────────────────────────────────────── */

interface Opts {
  types: ('product' | 'category' | 'city')[];
  only?: string;
  force: boolean;
  dryRun: boolean;
  limit: number;
  concurrency: number;
}

function parseArgs(): Opts {
  const a = process.argv.slice(2);
  const flag = (f: string) => a.includes(f);
  const val = (f: string) => { const i = a.indexOf(f); return i >= 0 ? a[i + 1] : undefined; };

  const all = flag('--all');
  const typeArg = val('--type');
  let types: Opts['types'] = [];
  if (all) types = ['product', 'category', 'city'];
  else if (typeArg === 'product' || typeArg === 'category' || typeArg === 'city') types = [typeArg];
  else { console.error('Pass --type product|category|city or --all'); process.exit(1); }

  return {
    types,
    only: val('--only'),
    force: flag('--force'),
    dryRun: flag('--dry-run'),
    limit: Number(val('--limit')) || Infinity,
    concurrency: Number(process.env.CONTENT_CONCURRENCY) || 3,
  };
}

/* ── File IO ─────────────────────────────────────────────────────── */

function outPath(kind: 'products' | 'categories' | 'cities', ...parts: string[]) {
  return path.join(GENERATED_ROOT, kind, ...parts) + '.json';
}

function isLocked(file: string) {
  if (!fs.existsSync(file)) return false;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')).locked === true; } catch { return false; }
}

function writeJson(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

/* ── Job list ────────────────────────────────────────────────────── */

interface Job {
  kind: 'products' | 'categories' | 'cities';
  slug: string;
  file: string;
  pack: FactPack;
  schemaName: string;
  jsonSchema: Record<string, unknown>;
}

function buildJobs(opts: Opts): Job[] {
  const jobs: Job[] = [];
  const productSchema = z.toJSONSchema(ProductBody);
  const categorySchema = z.toJSONSchema(CategoryBody);
  const citySchema = z.toJSONSchema(CityBody);

  if (opts.types.includes('product')) {
    for (const item of menuItems) {
      if (opts.only && item.slug !== opts.only) continue;
      const file = outPath('products', item.category, item.slug);
      if (!opts.force && fs.existsSync(file)) continue;
      if (isLocked(file)) continue;
      jobs.push({ kind: 'products', slug: item.slug, file, pack: productFacts(item), schemaName: 'ProductBody', jsonSchema: productSchema as Record<string, unknown> });
    }
  }
  if (opts.types.includes('category')) {
    for (const slug of CATEGORY_SLUGS) {
      if (opts.only && slug !== opts.only) continue;
      const file = outPath('categories', slug);
      if (!opts.force && fs.existsSync(file)) continue;
      if (isLocked(file)) continue;
      jobs.push({ kind: 'categories', slug, file, pack: categoryFacts(slug), schemaName: 'CategoryBody', jsonSchema: categorySchema as Record<string, unknown> });
    }
  }
  if (opts.types.includes('city')) {
    for (const city of cities) {
      if (opts.only && city.slug !== opts.only) continue;
      const file = outPath('cities', city.slug);
      if (!opts.force && fs.existsSync(file)) continue;
      if (isLocked(file)) continue;
      jobs.push({ kind: 'cities', slug: city.slug, file, pack: cityFacts(city), schemaName: 'CityBody', jsonSchema: citySchema as Record<string, unknown> });
    }
  }
  return jobs.slice(0, opts.limit);
}

/* ── Generate one page ───────────────────────────────────────────── */

const MAX_RETRIES = 2;

async function generateOne(job: Job, provider: Provider, dryRun: boolean): Promise<{ ok: boolean; usage: Usage; issues: string[] }> {
  const prompt = buildPrompt(job.pack);
  let usage: Usage = { inputTokens: 0, outputTokens: 0 };
  let currentPrompt = prompt;
  let data: unknown;
  let issues: string[] = [];

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const result = await provider.generate({
      system: SYSTEM_PROMPT,
      user: currentPrompt,
      schemaName: job.schemaName,
      jsonSchema: job.jsonSchema,
    });
    usage.inputTokens += result.usage.inputTokens;
    usage.outputTokens += result.usage.outputTokens;
    data = result.data;
    issues = validate(data, job.pack);

    if (issues.length === 0) break;
    if (attempt < MAX_RETRIES) {
      console.log(`  retry ${attempt + 1}/${MAX_RETRIES}: ${issues.length} issues`);
      currentPrompt = feedbackPrompt(prompt, data, issues);
    }
  }

  if (issues.length > 0) {
    console.log(`  FAILED (${issues.length} issues remain)`);
    issues.forEach((i) => console.log(`    - ${i}`));
    return { ok: false, usage, issues };
  }

  if (!dryRun) {
    const envelope = {
      ...(data as Record<string, unknown>),
      slug: job.slug,
      generatedAt: new Date().toISOString().slice(0, 10),
      model: provider.model,
      locked: false,
    };
    writeJson(job.file, envelope);
  }
  return { ok: true, usage, issues: [] };
}

/* ── Parallel runner ─────────────────────────────────────────────── */

async function runBatch(jobs: Job[], concurrency: number, provider: Provider, dryRun: boolean) {
  const results: { slug: string; ok: boolean; usage: Usage; issues: string[] }[] = [];
  let idx = 0;

  async function next(): Promise<void> {
    while (idx < jobs.length) {
      const job = jobs[idx++];
      const n = `[${idx}/${jobs.length}] ${job.kind}/${job.slug}`;
      console.log(n);
      try {
        const r = await generateOne(job, provider, dryRun);
        const cost = costUsd(r.usage, provider.pricing).toFixed(4);
        console.log(`  ${r.ok ? 'OK' : 'FAIL'}  in=${r.usage.inputTokens} out=${r.usage.outputTokens} cost=$${cost}`);
        results.push({ slug: job.slug, ...r });
      } catch (e) {
        console.error(`  ERROR: ${(e as Error).message}`);
        results.push({ slug: job.slug, ok: false, usage: { inputTokens: 0, outputTokens: 0 }, issues: [(e as Error).message] });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, () => next()));
  return results;
}

/* ── Report ──────────────────────────────────────────────────────── */

function writeReport(results: { slug: string; ok: boolean; usage: Usage; issues: string[] }[], provider: Provider) {
  const totalUsage = results.reduce((acc, r) => ({ inputTokens: acc.inputTokens + r.usage.inputTokens, outputTokens: acc.outputTokens + r.usage.outputTokens }), { inputTokens: 0, outputTokens: 0 });
  const totalCost = costUsd(totalUsage, provider.pricing);
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);

  const lines = [
    `# Content generation report`,
    ``,
    `Date: ${new Date().toISOString()}`,
    `Model: ${provider.model}`,
    `Provider: ${provider.name}`,
    `Pages: ${results.length} (${passed} passed, ${failed.length} failed)`,
    `Tokens: ${totalUsage.inputTokens.toLocaleString()} input, ${totalUsage.outputTokens.toLocaleString()} output`,
    `Cost: $${totalCost.toFixed(2)} USD`,
    ``,
  ];

  if (failed.length) {
    lines.push(`## Failed pages`, ``);
    for (const f of failed) {
      lines.push(`### ${f.slug}`, ...f.issues.map((i) => `- ${i}`), ``);
    }
  }

  const report = lines.join('\n');
  const reportPath = path.join(GENERATED_ROOT, '_report.md');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`\nReport saved to ${reportPath}`);
  console.log(`Total: ${results.length} pages, ${passed} passed, ${failed.length} failed`);
  console.log(`Tokens: ${totalUsage.inputTokens.toLocaleString()} in + ${totalUsage.outputTokens.toLocaleString()} out`);
  console.log(`Cost: $${totalCost.toFixed(2)} USD`);
}

/* ── Similarity check ────────────────────────────────────────────── */

function checkSimilarity() {
  const kinds = ['products', 'categories', 'cities'] as const;
  for (const kind of kinds) {
    const dir = path.join(GENERATED_ROOT, kind);
    if (!fs.existsSync(dir)) continue;
    const docs: { slug: string; text: string }[] = [];
    const walk = (d: string) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(path.join(d, entry.name));
        else if (entry.name.endsWith('.json')) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(d, entry.name), 'utf8'));
            const strs: string[] = [];
            JSON.stringify(data, (_, v) => { if (typeof v === 'string') strs.push(v); return v; });
            docs.push({ slug: data.slug ?? entry.name, text: strs.join(' ') });
          } catch { /* skip */ }
        }
      }
    };
    walk(dir);
    const pairs = similarPairs(docs);
    if (pairs.length) {
      console.log(`\nSimilarity warnings (${kind}):`);
      pairs.forEach((p) => console.log(`  ${p.a} <-> ${p.b} (${p.score})`));
    }
  }
}

/* ── Main ────────────────────────────────────────────────────────── */

async function main() {
  loadEnv();
  const opts = parseArgs();

  if (opts.dryRun) {
    console.log('DRY RUN: no files will be written.\n');
  }

  const provider = getProvider();
  console.log(`Provider: ${provider.name}, model: ${provider.model}`);
  console.log(`Pricing: $${provider.pricing.input}/M in, $${provider.pricing.output}/M out\n`);

  const jobs = buildJobs(opts);
  if (jobs.length === 0) {
    console.log('Nothing to generate. All pages already exist (use --force to regenerate).');
    return;
  }

  console.log(`Generating ${jobs.length} pages (concurrency: ${opts.concurrency})...\n`);
  const results = await runBatch(jobs, opts.concurrency, provider, opts.dryRun);
  writeReport(results, provider);

  if (!opts.dryRun) {
    checkSimilarity();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
