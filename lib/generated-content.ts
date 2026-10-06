import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { ProductFile, CategoryFile, CityFile } from '@/lib/content-schemas';

/**
 * Reads AI generated content from content/generated at build time.
 * Returns null when a file is missing or invalid, so pages fall back to
 * their data-only layout and the build never breaks.
 */

export const GENERATED_ROOT = path.join(process.cwd(), 'content', 'generated');

export function generatedFile(kind: 'products' | 'categories' | 'cities', ...parts: string[]) {
  return path.join(GENERATED_ROOT, kind, ...parts) + '.json';
}

function load<T extends z.ZodType>(file: string, schema: T): z.output<T> | null {
  if (!fs.existsSync(file)) return null;
  try {
    const parsed = schema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
    if (!parsed.success) {
      console.warn(`[generated-content] invalid file ignored: ${file}`);
      return null;
    }
    return parsed.data;
  } catch {
    console.warn(`[generated-content] unreadable file ignored: ${file}`);
    return null;
  }
}

export const loadProductContent = (category: string, slug: string) =>
  load(generatedFile('products', category, slug), ProductFile);

export const loadCategoryContent = (slug: string) =>
  load(generatedFile('categories', slug), CategoryFile);

export const loadCityContent = (slug: string) =>
  load(generatedFile('cities', slug), CityFile);
