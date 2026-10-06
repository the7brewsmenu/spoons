import { z } from 'zod';

/**
 * Schemas for AI generated page content.
 * The *Body schemas are what the model must return (also sent to the API as JSON schema).
 * The *File schemas add the envelope we store on disk.
 * Prices, calories and counts never appear in this content: the model writes
 * placeholders such as {price} which are filled from live data at render time.
 */

const Meta = z.object({
  title: z.string().describe('SEO title tag, 50 to 59 characters'),
  description: z.string().describe('Meta description, 140 to 158 characters once placeholders are filled'),
});

const Faq = z.object({
  question: z.string(),
  answer: z.string(),
});

const TitledText = z.object({
  title: z.string(),
  text: z.string(),
});

export const ProductBody = z.object({
  meta: Meta,
  subtitle: z.string(),
  quickAnswer: z.string(),
  components: z.array(z.object({ name: z.string(), note: z.string() })),
  taste: z.string(),
  value: z.string(),
  nutrition: z.string(),
  dietaryGuidance: z.string(),
  bestFor: z.array(TitledText),
  pairings: z.array(z.object({ slug: z.string(), reason: z.string() })),
  tips: z.array(z.string()),
  faqs: z.array(Faq),
});

export const CategoryBody = z.object({
  meta: Meta,
  intro: z.string(),
  quickAnswer: z.string(),
  overview: z.array(z.object({ heading: z.string(), body: z.string() })),
  highlights: z.object({
    bestValue: z.string(),
    lightest: z.string(),
    mostFilling: z.string(),
    vegetarian: z.string(),
  }),
  timing: z.string(),
  deals: z.string().describe('Meal deals, club days, included drinks, how to get the best value'),
  calorieGuide: z.string().describe('Calorie ranges, lightest to heaviest, daily intake context'),
  allergenSummary: z.string().describe('Common allergens across the section, how to check, cross-contamination'),
  dietary: z.string(),
  ordering: z.string().describe('How to order: app vs bar, customisation, table service tips'),
  bestChoices: z.array(TitledText).describe('Best for families, best value, best for low calories, best vegan etc'),
  howToChoose: z.array(TitledText),
  comparison: z.string().describe('How this section compares to other Wetherspoons menu sections on value and variety'),
  faqs: z.array(Faq),
});

export const CityBody = z.object({
  meta: Meta,
  intro: z.string(),
  quickAnswer: z.string(),
  areas: z.array(z.object({ area: z.string(), text: z.string() })),
  pricing: z.string(),
  breakfastAndClubs: z.string(),
  tips: z.array(TitledText),
  faqs: z.array(Faq),
});

const Envelope = {
  slug: z.string(),
  generatedAt: z.string(),
  model: z.string(),
  locked: z.boolean().default(false),
};

export const ProductFile = ProductBody.extend(Envelope);
export const CategoryFile = CategoryBody.extend(Envelope);
export const CityFile = CityBody.extend(Envelope);

export type ProductContent = z.infer<typeof ProductFile>;
export type CategoryContent = z.infer<typeof CategoryFile>;
export type CityContent = z.infer<typeof CityFile>;
export type ContentType = 'product' | 'category' | 'city';
