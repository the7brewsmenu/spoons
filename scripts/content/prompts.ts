import type { FactPack } from './facts';

/** House style shared by every page type. */
export const SYSTEM_PROMPT = `You are a senior UK food and hospitality editor writing for SpoonsMenu, an independent guide to the Wetherspoons menu. SpoonsMenu is not affiliated with J D Wetherspoon plc.

Your copy must be original, specific and genuinely useful to someone deciding what to order or where to go. Write like an experienced editor who knows pub food well: calm, clear, confident and practical. Every sentence should earn its place.

HARD RULES (a validator rejects any breach):
1. British English spelling and phrasing (flavour, colour, favourite, centre, chips, starter).
2. Never use em dashes or en dashes. Use commas, full stops, colons or the word "to".
3. No emojis and no exclamation marks.
4. Headings are sentence case: only the first word and proper nouns are capitalised.
5. NEVER type a price, a pound sign or a calorie number. Use the placeholders listed in PLACEHOLDERS exactly as written, for example "{price}" or "{calories} kcal". Only use placeholders that are listed. Write any other counts in words.
6. Only state facts that are in FACTS or GENERAL CONTEXT. Do not invent ingredients, sides, portion weights, cooking methods, opening hours, landmarks, history, transport links, events or promotions. If a detail is not in the facts, write around it or advise checking with the pub.
7. Prices are always "typical" and vary by pub. Never describe anything as official, guaranteed, always available or allergen free.
8. Banned words and phrases: delicious, mouth-watering, mouthwatering, nestled, delve, elevate, culinary journey, look no further, in conclusion, whether you're, must-try, tantalising, indulge, hidden gem, vibrant, a feast for, treat yourself, satisfy your cravings, perfect for any occasion.
9. Answer engine optimisation: every answer starts with the direct answer in its first sentence. FAQ answers stand alone without needing the page around them.
10. Vary sentence openings. Do not start consecutive sentences with the same word, and do not repeat the dish or city name in every sentence.
11. Separate paragraphs inside a field with a blank line.

Return only data that matches the provided schema.`;

const header = (p: FactPack) => `PRIMARY KEYWORD: ${p.primaryKeyword}

PLACEHOLDERS (the only numbers you may use):
${JSON.stringify(p.placeholders, null, 2)}

FACTS:
${JSON.stringify(p.facts, null, 2)}`;

const META_RULES = (kw: string) => `META
- meta.title: 50 to 59 characters, contains "${kw}" (any capitalisation, natural word order allowed), title case is fine here, no placeholders, no pipe or dash characters.
- meta.description: 140 to 158 characters AFTER placeholders are filled (a filled {price} is about 6 characters, {calories} about 3). Include the primary keyword naturally, one concrete benefit and a reason to click. No quotation marks.`;

export function productPrompt(p: FactPack) {
  const f = p.facts as { dishName: string; priceVerified: boolean; caloriesVerified: boolean };
  return `${header(p)}

Write the full content for the product page about "${f.dishName}".
${f.priceVerified ? '' : 'The price is NOT verified: do not mention a price or price position; tell readers to check the pub.'}
${f.caloriesVerified ? '' : 'Calories are NOT verified: do not use calorie placeholders; tell readers to check the official nutrition information.'}

FIELDS
- subtitle: 12 to 24 words. One line under the H1 that says what the dish is and who it suits.
- quickAnswer: 40 to 65 words. Answers "how much is it, how many calories, what comes with it" in that order, using placeholders. First sentence is the direct answer.
- components: 2 to 7 items. Each element of the plate that is named in sourceDescription. name = 1 to 4 words, note = one sentence (10 to 25 words) on what it adds. Do not add anything not in the source description.
- taste: 90 to 140 words, 2 paragraphs. What the dish is like to eat: texture, flavour and how it is served, based only on the source description.
- value: 70 to 120 words. Is it good value? Use {pricePosition} if available, compare with named items from otherItemsInSameSection (no prices), and mention meal deals or club days from GENERAL CONTEXT only where relevant.
- nutrition: 60 to 110 words. Put {calories} kcal and {calorieShare} in context, and explain how sides, sauces and drinks change the total. Use {caloriePosition} if available.
- dietaryGuidance: 60 to 110 words. Explain the dietary tags and the listed allergens in plain English, who should take care, and that swaps can change allergens. Do not claim anything is free from an allergen.
- bestFor: 3 or 4 items. title = 2 to 5 words in sentence case, text = 20 to 40 words describing an occasion or type of diner it suits.
- pairings: 2 to 4 items. slug MUST be copied exactly from pairingCandidates. reason = 15 to 35 words on why it pairs well.
- tips: 3 to 5 tips, each 15 to 35 words, practical and specific to ordering this dish.
- faqs: 6 to 8 items. Questions written the way people search, for example "How much is the ${f.dishName} at Wetherspoons?", "How many calories are in…", "Is the ${f.dishName} vegetarian?", "What comes with…", "Can I get it as a meal deal?". Answers 40 to 80 words, starting with the direct answer.

${META_RULES(p.primaryKeyword)}
Suggested title pattern: "Wetherspoons ${f.dishName}: Price, Calories and Allergens" (shorten if needed).`;
}

export function categoryPrompt(p: FactPack) {
  const f = p.facts as { sectionName: string };
  const avail = p.highlightAvailability ?? {};
  const lower = f.sectionName.toLowerCase();
  return `${header(p)}

Write comprehensive, SERP-competitive content for the Wetherspoons ${f.sectionName} category page. This page must be the single best independent resource for anyone searching "wetherspoons ${lower}" in the UK. Every section must add genuine value that a simple menu listing cannot.

HEADINGS STRATEGY
Use headings that match what real people type into Google UK, for example:
- "Wetherspoons ${lower} prices" (not "Price information")
- "How many calories in the Wetherspoons ${lower}" (not "Nutrition")
- "Wetherspoons ${lower} deals and offers" (not "Promotions")
- "Is there a vegan option on the ${lower}" (not "Dietary")
The AI decides exact wording; these are examples of the style: natural, search-phrased, specific.

FIELDS
- intro: 70 to 100 words. Opens the page. Use {itemCount}, {minPrice} to {maxPrice} and {vegCount}. Explain what makes this section worth exploring and why prices are typical rather than fixed.
- quickAnswer: 55 to 80 words. Directly answers "what is on the Wetherspoons ${lower} and how much does it cost" in the first sentence. Include {itemCount}, price range and a mention of dietary options.
- overview: 4 or 5 sub-sections. heading = sentence case, 4 to 10 words, phrased as a question or search query where natural. body = 100 to 170 words each, 2 paragraphs. Name real items from FACTS.items and explain what makes them different from each other. Total 450 to 750 words. Cover: what the section includes, how portion sizes and formats differ, which items include a drink, and what seasonal or rotating items may appear.
- highlights: one line of 20 to 40 words for each highlight item. bestValue = lowest typical price (explain why it is good value beyond just the price), lightest = fewest calories (put it in daily intake context), mostFilling = most calories (who it suits), vegetarian = a vegetarian or vegan pick (what makes it stand out). If a highlight item is null, return an empty string.${Object.entries(avail).filter(([, v]) => !v).map(([k]) => ` ${k} is null.`).join('')}
- timing: 70 to 120 words. When this section is served, any related club day (from GENERAL CONTEXT and serviceNotes only), and what happens if you arrive outside the window.
- deals: 80 to 140 words. Explain meal deals, club day offers, included drinks and how to get the best value from this section. Be specific about what "a meal deal" typically includes (food plus eligible drink) and which days may offer club pricing. Use hedged language: "traditionally", "at participating pubs", "check locally".
- calorieGuide: 80 to 140 words. Walk the reader through the calorie range in this section, from lightest to heaviest. Explain what {calories} kcal means as a share of 2,000 kcal, how sides and drinks add to the total, and how to find lighter options. Name the lightest and heaviest items.
- allergenSummary: 80 to 130 words. Which of the 14 major allergens appear most often across this section, what to do if you have an allergy (check the official allergen information, tell staff, do not rely on this site alone), and how swaps and shared kitchen equipment affect allergen status.
- dietary: 80 to 140 words. How many items carry vegetarian or vegan tags ({vegCount}), what "vegetarian" and "vegan" mean in practice at Wetherspoons (labelled items only, not a guarantee of separate preparation), and practical advice for plant-based diners choosing from this section.
- ordering: 70 to 120 words. How to order from this section: Wetherspoon app at the table, ordering at the bar, checking the local menu for current prices and availability. Mention that the app shows the pub's own prices and that items can sell out.
- bestChoices: 5 or 6 items. title = a clear "Best for…" label (e.g. "Best for families", "Best for a quick lunch", "Best low calorie option", "Best vegan choice", "Best value meal deal"). text = 25 to 45 words naming a specific item from FACTS.items and explaining in one or two sentences why it suits that need.
- howToChoose: 5 steps (not 4). title = 3 to 6 words, text = 25 to 45 words. A practical step-by-step for someone standing at the bar or looking at the app, deciding what to pick from this section.
- comparison: 80 to 130 words. How the ${lower} section compares to other parts of the Wetherspoons menu on price, portion size and variety. Name 2 or 3 other sections from otherSections. Help the reader decide whether ${lower} is the right section for them or whether they should look elsewhere.
- faqs: 10 to 14 items. Questions MUST be written exactly how UK searchers type them:
  "How much is the Wetherspoons ${lower}?"
  "What is on the Wetherspoons ${lower}?"
  "How many calories in a Wetherspoons ${lower.replace(/ menu$/, '')}?"
  "Is there a vegan option on the Wetherspoons ${lower}?"
  "What time is the ${lower} served at Wetherspoons?"
  "Does the ${lower} include a drink?"
  "What allergens are in the Wetherspoons ${lower}?"
  Plus 3 to 7 more relevant questions. Answers 45 to 90 words, starting with the direct answer.

${META_RULES(p.primaryKeyword)}`;
}

export function cityPrompt(p: FactPack) {
  const f = p.facts as { city: string };
  return `${header(p)}

Write the full content for the city guide "Wetherspoons in ${f.city}".

STRICT: you may only name the city, its region, the areas, pubs and addresses in FACTS, and the nearby cities listed. Do not mention any landmark, street, station, venue, history, transport or opening hours that is not in FACTS.

FIELDS
- intro: 55 to 90 words. Uses {pubCount} and {areaCount}. Explains what this guide covers for ${f.city}.
- quickAnswer: 45 to 75 words. Answers "how many Wetherspoons are in ${f.city} and where are they" directly.
- areas: one entry for EVERY area in FACTS.areas, with area copied exactly. text = 35 to 70 words describing which pubs are there (by name) and who they suit, without inventing facts about the area.
- pricing: 90 to 150 words. How menu prices work in ${f.city}: national menu, pub by pub pricing, why central pubs may charge more, and how to check the exact price.
- breakfastAndClubs: 70 to 120 words. Breakfast times and club days from GENERAL CONTEXT, framed for visitors in ${f.city}.
- tips: 4 or 5 items. title = 2 to 5 words, text = 20 to 40 words of practical visiting advice.
- faqs: 6 to 8 items, written the way people search ("How many Wetherspoons are in ${f.city}?", "Which Wetherspoons in ${f.city}…", "What time does breakfast start…", "Are prices higher in ${f.city}?"). Answers 40 to 80 words.

${META_RULES(p.primaryKeyword)}
Suggested title pattern: "Wetherspoons ${f.city}: Pubs, Menu and Prices Guide".`;
}

export function buildPrompt(p: FactPack) {
  if (p.type === 'product') return productPrompt(p);
  if (p.type === 'category') return categoryPrompt(p);
  return cityPrompt(p);
}

export function feedbackPrompt(original: string, previous: unknown, issues: string[]) {
  return `${original}

YOUR PREVIOUS ATTEMPT FAILED THESE CHECKS:
${issues.map((i) => `- ${i}`).join('\n')}

Previous attempt:
${JSON.stringify(previous)}

Fix every issue and return the complete content again. Keep everything that already passed.`;
}
