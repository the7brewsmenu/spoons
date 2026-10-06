import { z } from 'zod';
import { MenuItem, Category, CityRecord, CATEGORY_SLUGS } from '@/lib/types';

export const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const menuItemSchema = z.object({
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(CATEGORY_SLUGS as [string, ...string[]]),
  description: z.string(),
  typicalPriceGbp: z.number().nonnegative().nullable(),
  priceCheckedOn: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  caloriesKcal: z.number().nonnegative().nullable(),
  allergens: z.array(z.string()),
  dietaryTags: z.array(z.enum(['vegan', 'vegetarian'])),
  availabilityNote: z.string().optional(),
  sourceLabel: z.string(),
  sourceUrl: z.string().url().optional(),
  lastReviewedOn: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export const categorySchema = z.object({
  slug: z.enum(CATEGORY_SLUGS as [string, ...string[]]),
  name: z.string(),
  primaryKeyword: z.string(),
  description: z.string(),
  serviceNotes: z.string().optional(),
  faqs: z.array(faqSchema),
});

export const pubListingSchema = z.object({
  name: z.string(),
  area: z.string(),
  address: z.string(),
  status: z.enum(['open', 'temporarily-closed', 'closed']),
  sourceUrl: z.string().url(),
  checkedOn: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export const cityRecordSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  pubs: z.array(pubListingSchema),
  checkedOn: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  summary: z.string(),
  faqs: z.array(faqSchema),
});

export function validateMenuData(items: MenuItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const slugs = new Set<string>();

  items.forEach((item, index) => {
    const result = menuItemSchema.safeParse(item);
    if (!result.success) {
      errors.push(`Item at index ${index} (${item.name}) failed validation: ${result.error.message}`);
    }
    const fullSlug = `${item.category}/${item.slug}`;
    if (slugs.has(fullSlug)) {
      errors.push(`Duplicate slug found within category: ${fullSlug}`);
    }
    slugs.add(fullSlug);
  });

  return { valid: errors.length === 0, errors };
}

export function validateAllContent(
  items: MenuItem[],
  categories: Category[],
  cities: CityRecord[]
): { valid: boolean; errors: string[] } {
  let allErrors: string[] = [];

  const itemsValidation = validateMenuData(items);
  if (!itemsValidation.valid) {
    allErrors = allErrors.concat(itemsValidation.errors);
  }

  categories.forEach((cat, index) => {
    const result = categorySchema.safeParse(cat);
    if (!result.success) {
      allErrors.push(`Category at index ${index} (${cat.name}) failed validation: ${result.error.message}`);
    }
  });

  cities.forEach((city, index) => {
    const result = cityRecordSchema.safeParse(city);
    if (!result.success) {
      allErrors.push(`City at index ${index} (${city.name}) failed validation: ${result.error.message}`);
    }
  });

  return { valid: allErrors.length === 0, errors: allErrors };
}
