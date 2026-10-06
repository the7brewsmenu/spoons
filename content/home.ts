import type { CategorySlug } from '@/lib/types';

/**
 * Original editorial copy for the homepage. Primary keyword: "Wetherspoons menu".
 * Rules: British English, sentence case, no em dashes, no emojis,
 * every price described as typical.
 */

export const CATEGORY_GUIDES: Record<CategorySlug, string> = {
  'breakfast-menu':
    'The Wetherspoons breakfast menu is one of the busiest parts of the whole menu. It runs from a small cooked plate up to the large breakfast, with vegetarian and vegan versions built around meat free sausages, beans, hash browns and toast. Lighter picks such as porridge, muffins and toast suit a quicker start, and refillable hot drinks make it a favourite for slow mornings. Check our breakfast times guide for when each service starts and ends.',
  burgers:
    'Burgers range from a classic beef patty in a bun to stacked builds with bacon, cheese and onion rings. Chicken and plant based burgers sit alongside the beef, so most diners can find one that suits them. Most come with chips, and many can be ordered as a meal with a drink. Compare the patty, toppings and side before judging value. See the calorie guide for exact figures on each burger.',
  pizza:
    'Pizzas on the Wetherspoons menu cover the familiar toppings, from a simple margherita to meat feast and vegetable options. They work as a main for one or as something to share at the table. Prices sit in the middle of the menu, and extra toppings change both the price and the calories, so check the full build before you order.',
  'chicken-dishes':
    'The chicken section covers grilled breast, crispy strips, wings and chicken served in wraps, salads and burgers. Grilled dishes tend to be the lighter choice, while fried and sauced dishes carry more calories. The side makes a big difference here, so look at whether a plate comes with chips, rice or salad, and check each sauce using the allergen guide.',
  'curry-club':
    'Curry has been part of the Wetherspoons menu for years and is best known through Thursday Curry Club. A typical curry plate comes with rice, and many include naan bread and poppadoms. Choices usually run from mild and creamy to hotter dishes, with a vegetarian option. Club pricing normally bundles a drink with the meal, which makes Thursday one of the best value days. Read more about all the Wetherspoons food clubs.',
  'steak-club':
    'Steak Club brings steaks, gammon and grills together, traditionally on Tuesdays. Plates are usually served with chips, peas, tomato and mushroom, and the club price often includes a drink. Larger cuts and mixed grills cost more, and sauces can be extra. Club days and dishes can vary between pubs, so check locally before visiting for a specific steak.',
  'fish-dishes':
    'Fish and chips is a staple of the Wetherspoons menu. Expect battered fish with chips and a choice of garden or mushy peas, with scampi and lighter fish dishes at many pubs. Fish Friday has long been linked with deals on these plates. Portion size and whether a drink is included affect value more than the headline price.',
  'sunday-roasts':
    'Roast dinners give the menu a traditional Sunday feel, with meat or vegetarian roasts served with potatoes, vegetables, Yorkshire pudding and gravy. Roast availability can change by season and by pub, so treat this section as a guide to what to expect rather than a promise. Where roasts are not listed, the regular menu is still served all day.',
  desserts:
    'Desserts round off the Wetherspoons menu with warm sponge puddings, chocolate brownies, cheesecake and ice cream. Several come with a choice of custard, cream or ice cream, which changes the calories. Desserts are among the lowest priced items on the menu, so they are an easy add on. Check vegan and vegetarian options for plant based dessert choices.',
  'drinks-menu':
    'The drinks menu is as broad as the food. It covers real ales and rotating guest ales, lagers, ciders, wines, spirits and cocktails, plus soft drinks, alcohol free beers and hot drinks. Each pub sets its own range within the national list, so cask and guest beers change often. Many meal deals let you pick a drink from an eligible list.',
  sides:
    'Sides let you build a meal your way. Chips, onion rings, garlic bread and side salads are typical, and many work as sharing plates for a group. Sides are a low cost way to add to a main, but the calories add up quickly. Check the nutrition information page for each side, and each side for allergens on its own rather than assuming it matches the main dish.',
  'kids-menu':
    'The Wetherspoons kids menu offers smaller portions of familiar dishes such as fish fingers, chicken bites, pasta and mini breakfasts. Kids meals usually include a drink and a piece of fruit. Choices and portions vary by pub, so parents should check the current menu, especially where a child has an allergy. See our allergen information page for details on the 14 UK allergens.',
};

export const CLUB_GUIDES = [
  {
    name: 'Steak Club',
    day: 'Tuesday',
    href: '/steak-club',
    desc: 'Steaks, gammon and grills served with chips and the usual trimmings. The club price traditionally includes a soft drink or an alcoholic drink, with premium cuts costing a little more.',
  },
  {
    name: 'Curry Club',
    day: 'Thursday',
    href: '/curry-club',
    desc: 'A choice of curries served with rice, often with naan and poppadoms. One of the longest running deals on the Wetherspoons menu, with meat and vegetarian options and a drink included.',
  },
  {
    name: 'Fish Friday',
    day: 'Friday',
    href: '/fish-dishes',
    desc: 'Battered fish and chips with peas, plus scampi and lighter fish plates at many pubs. Fish dishes are on the menu all week, with Friday deals running at participating pubs.',
  },
  {
    name: 'Sunday roasts',
    day: 'Sunday',
    href: '/sunday-roasts',
    desc: 'Meat and vegetarian roast dinners with potatoes, vegetables, Yorkshire pudding and gravy. Availability changes by season and location, so check your pub before planning around one.',
  },
];

export const SERVICE_TIMES = [
  {
    label: 'Breakfast',
    time: 'From 8am until 12pm',
    text: 'Breakfast is typically served from opening, usually 8am, until midday every day. Hot drinks with refills are available all day at most pubs.',
  },
  {
    label: 'Main menu and clubs',
    time: 'From late morning until 11pm',
    text: 'The main Wetherspoons menu usually starts as breakfast ends and runs until the kitchen closes, typically around 11pm. Food clubs run during these hours on their day.',
  },
  {
    label: 'Bar and drinks',
    time: 'Until closing',
    text: 'The bar normally stays open after the kitchen closes. Closing times are set by each pub and often run later on Fridays and Saturdays.',
  },
];

export const ORDER_STEPS = [
  {
    title: 'Pick your day',
    text: 'If you are flexible, visit on a club day. A bundled meal and drink price usually beats ordering the two separately.',
  },
  {
    title: 'Compare the whole meal',
    text: 'Look at what comes with each dish. A slightly dearer plate with chips and a drink can be better value than a cheaper main on its own.',
  },
  {
    title: 'Add up the calories',
    text: 'Calories apply to each dish as listed. Sides, sauces and drinks all add to the total, so count the whole order.',
  },
  {
    title: 'Confirm at your pub',
    text: 'Prices, availability and allergens are set locally. Check the app or ask staff before you order.',
  },
];

export const PRICE_FACTORS = [
  {
    title: 'Pub location',
    text: 'City centre, station and airport pubs often charge more than suburban and market town pubs for the same dish.',
  },
  {
    title: 'Meal deals',
    text: 'Many mains can be ordered with a drink included. Compare the meal price rather than the food price alone.',
  },
  {
    title: 'Extras and swaps',
    text: 'Extra toppings, sauces, larger portions and premium drinks all add to the final bill.',
  },
];

export const METHOD_POINTS = [
  {
    title: 'Collected from public menus',
    text: 'We gather prices and dish details from publicly available Wetherspoon menus and visits to pubs across the UK.',
  },
  {
    title: 'Reviewed regularly',
    text: 'Our data is reviewed around every 30 days and after major menu changes. Each page shows when it was last checked.',
  },
  {
    title: 'Clearly labelled',
    text: 'Every price is shown as typical. Anything we cannot verify is marked as not verified rather than guessed.',
  },
];

export const UK_ALLERGENS = [
  'Celery',
  'Cereals containing gluten',
  'Crustaceans',
  'Eggs',
  'Fish',
  'Lupin',
  'Milk',
  'Molluscs',
  'Mustard',
  'Tree nuts',
  'Peanuts',
  'Sesame',
  'Soya',
  'Sulphites',
];

export function buildHomeFaqs(stats: {
  minPrice: string;
  maxPrice: string;
  vegCount: number;
  itemCount: number;
}) {
  return [
    {
      question: 'What is on the Wetherspoons menu?',
      answer: `The Wetherspoons menu UK pubs serve covers [breakfast](/breakfast-menu), [burgers](/burgers), [pizza](/pizza), [chicken](/chicken-dishes), [curries](/curry-club), [steaks and grills](/steak-club), [fish dishes](/fish-dishes), [roasts](/sunday-roasts), [sides](/sides), [desserts](/desserts), a [kids menu](/kids-menu) and a full [drinks list](/drinks-menu). Our guide currently tracks ${stats.itemCount} dishes and drinks, each with a typical price, calories and dietary tags.`,
    },
    {
      question: 'How much are Spoons menu prices?',
      answer: `Spoons menu prices in our guide run from about ${stats.minPrice} for the lowest priced items up to about ${stats.maxPrice} for the largest plates. Wetherspoons prices are set by each pub, so the same dish can cost more in a city centre or at an airport. Browse our [locations guide](/locations) to find pubs near you.`,
    },
    {
      question: 'What time does Wetherspoons stop serving breakfast?',
      answer:
        'Breakfast is typically served from 8am until 12pm every day. After midday the main menu takes over. Opening times can differ at some pubs, particularly at airports and stations. See our [breakfast times](/breakfast-times) page for the full schedule.',
    },
    {
      question: 'What time does the Wetherspoons food menu finish?',
      answer:
        'At most pubs the kitchen closes around 11pm, although this varies by location and day. The bar often stays open later than the kitchen.',
    },
    {
      question: 'Do Wetherspoons menu prices vary by pub?',
      answer:
        'Yes. Wetherspoon sets prices pub by pub, so a dish or a pint can cost more in some locations than others. That is why every price on SpoonsMenu is labelled as typical. The Wetherspoon app shows the exact price for the pub you select. Read our [disclaimer](/disclaimer) for more on how typical prices work.',
    },
    {
      question: 'Which day is Curry Club at Wetherspoons?',
      answer:
        'Curry Club runs on Thursdays at participating pubs. It usually includes a curry with rice, often with naan and poppadoms, and a drink for one set price. See the [Curry Club page](/curry-club) for the full selection.',
    },
    {
      question: 'Which day is Steak Club at Wetherspoons?',
      answer:
        'Steak Club is traditionally held on Tuesdays. Some pubs now run different Tuesday deals, so check the menu at your chosen pub before you go. Browse the [Steak Club page](/steak-club) for all current options.',
    },
    {
      question: 'Do Wetherspoons meals come with a drink?',
      answer:
        'Many mains and all the [food club deals](/food-clubs) can be ordered with a drink included. You usually choose from an eligible list of soft drinks and alcoholic drinks, and premium choices can cost extra.',
    },
    {
      question: 'Are there vegan options on the Wetherspoons menu?',
      answer: `Yes. Our guide lists ${stats.vegCount} [vegetarian and vegan dishes](/vegan-and-vegetarian-options) across breakfast, burgers, curries, pizza and sides. Always check the current tags and ingredients, as vegetarian dishes are not automatically vegan.`,
    },
    {
      question: 'Does Wetherspoons have a kids menu?',
      answer:
        'Yes. The [kids menu](/kids-menu) offers smaller portions of familiar dishes, and meals usually include a drink and a piece of fruit. Choices vary by pub.',
    },
    {
      question: 'Can I see calories on the Wetherspoons menu?',
      answer:
        'Yes. Calories are shown for most dishes on the official menu and on every dish page in this guide. Remember that sides, sauces and drinks add to the total. See our full [nutrition information](/nutrition-information) page for category averages and lighter options.',
    },
    {
      question: 'Is SpoonsMenu the official Wetherspoons website?',
      answer:
        'No. SpoonsMenu is an independent guide and is not affiliated with, endorsed by or connected to J D Wetherspoon plc. For live prices, availability and allergen decisions, use the official Wetherspoon app or ask staff at your pub. Read more on our [about page](/about).',
    },
  ];
}
