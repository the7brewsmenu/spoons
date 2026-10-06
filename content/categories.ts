import { Category } from '@/lib/types';

export const categories: Category[] = [
  {
    slug: 'breakfast-menu',
    name: 'Breakfast Menu',
    primaryKeyword: 'wetherspoons breakfast times and menu',
    description: 'Start your day with a substantial meal. From the hearty large breakfast to lighter morning options, these choices are designed to fuel you up. Meals are prepared fresh to order every morning.',
    serviceNotes: 'Served daily from 8am until 12 noon.',
    faqs: [
      { question: 'What time does breakfast end?', answer: 'Breakfast is typically served until 12 noon every day.' },
      { question: 'Is tea or coffee included?', answer: 'Hot drinks are usually sold separately, though free refills are available on self-serve tea and coffee.' },
      { question: 'Are there vegetarian breakfasts?', answer: 'Yes, vegetarian options are available featuring meat-free sausages and extra vegetables.' }
    ]
  },
  {
    slug: 'burgers',
    name: 'Burgers',
    primaryKeyword: 'wetherspoons burger menu',
    description: 'A comprehensive selection of beef, chicken, and plant-based burgers. Each burger is served in a freshly toasted bun with standard accompaniments and a side of chips.',
    faqs: [
      { question: 'Do burgers come with a drink?', answer: 'Many pubs offer a burger and drink deal where a soft or alcoholic drink is included for a set price.' },
      { question: 'Can I swap chips for a salad?', answer: 'Yes, chips can generally be swapped for a side salad upon request.' },
      { question: 'Are the beef burgers 100% beef?', answer: 'Yes, the standard beef patties are made from 100% British and Irish beef.' }
    ]
  },
  {
    slug: 'pizza',
    name: 'Pizza',
    primaryKeyword: 'wetherspoons pizza choices',
    description: 'Freshly baked 11-inch and 8-inch sourdough pizzas with a variety of toppings. Our dough is prepared to offer a crisp, satisfying crust.',
    faqs: [
      { question: 'What sizes are the pizzas?', answer: 'Pizzas are available in 11-inch and 8-inch sizes.' },
      { question: 'Can I add extra toppings?', answer: 'Additional toppings can be added to any pizza for a small extra charge.' },
      { question: 'Is the dough vegan?', answer: 'The standard sourdough pizza base is vegan-friendly.' }
    ]
  },
  {
    slug: 'chicken-dishes',
    name: 'Chicken Dishes',
    primaryKeyword: 'wetherspoons chicken menu',
    description: 'A range of chicken meals including roasted half chickens, chicken breast bites, and wings. Choose from various spice levels and sides to complete your meal.',
    faqs: [
      { question: 'What sides come with the roasted chicken?', answer: 'Roasted chicken dishes typically include a choice of chips, spicy rice, or salad.' },
      { question: 'Are the chicken wings spicy?', answer: 'Wings can be ordered plain, with a spicy coating, or with Naga chilli sauce for extra heat.' },
      { question: 'Is there a boneless option?', answer: 'Yes, chicken breast bites and fillets offer boneless alternatives.' }
    ]
  },
  {
    slug: 'curry-club',
    name: 'Curry Club',
    primaryKeyword: 'wetherspoons curry club menu',
    description: 'Experience a variety of traditional curries, from mild kormas to fiery vindaloos. Each dish is served with standard accompaniments like rice and naan.',
    serviceNotes: 'Special Curry Club pricing available on Thursdays.',
    faqs: [
      { question: 'When is Curry Club?', answer: 'Curry Club runs all day every Thursday.' },
      { question: 'What is included in the Curry Club meal?', answer: 'A curry meal typically includes the main dish, rice, naan bread, poppadums, and a drink.' },
      { question: 'Are there vegetarian curries?', answer: 'Yes, options like sweet potato curry or spinach curries are usually available.' }
    ]
  },
  {
    slug: 'steak-club',
    name: 'Steak Club',
    primaryKeyword: 'wetherspoons steak club deals',
    description: 'Enjoy premium cuts of beef, cooked to your liking. Accompanied by classic steakhouse sides, providing a satisfying dining experience.',
    serviceNotes: 'Special Steak Club pricing available on Tuesdays.',
    faqs: [
      { question: 'What cuts of steak are available?', answer: 'Choices often include sirloin, rump, and sometimes ribeye or gammon steaks.' },
      { question: 'When is Steak Club?', answer: 'Steak Club offers are available every Tuesday.' },
      { question: 'Can I choose how my steak is cooked?', answer: 'Yes, steaks can be ordered rare, medium-rare, medium, medium-well, or well-done.' }
    ]
  },
  {
    slug: 'fish-dishes',
    name: 'Fish Dishes',
    primaryKeyword: 'wetherspoons fish and chips',
    description: 'Classic British seafood options featuring battered fish, scampi, and chips. A traditional favorite prepared with care.',
    serviceNotes: 'Fish Friday specials run weekly on Fridays.',
    faqs: [
      { question: 'Is the fish sustainably sourced?', answer: 'Wetherspoon commits to sourcing sustainable seafood where possible.' },
      { question: 'Does the fish come with mushy peas?', answer: 'You can typically choose between garden peas or mushy peas.' },
      { question: 'When is Fish Friday?', answer: 'Special deals on fish dishes are available every Friday.' }
    ]
  },
  {
    slug: 'sunday-roasts',
    name: 'Sunday Roasts',
    primaryKeyword: 'wetherspoons sunday roast menu',
    description: 'Traditional roast dinners complete with all the trimmings. A hearty weekend meal that brings classic comfort food to your table.',
    serviceNotes: 'Available only on Sundays, subject to availability.',
    faqs: [
      { question: 'Are Sunday roasts available all week?', answer: 'No, they are exclusively served on Sundays.' },
      { question: 'What meats are offered?', answer: 'Options typically include roast beef, chicken, and sometimes turkey or pork.' },
      { question: 'Is there a vegetarian roast?', answer: 'Yes, a vegetarian or vegan roast option is usually on the menu.' }
    ]
  },
  {
    slug: 'desserts',
    name: 'Desserts',
    primaryKeyword: 'wetherspoons dessert menu',
    description: 'A selection of sweet treats to finish your meal. From rich chocolate brownies to classic crumbles and ice cream.',
    faqs: [
      { question: 'Do desserts come with ice cream or custard?', answer: 'Many hot desserts offer a choice of ice cream, custard, or cream.' },
      { question: 'Are there mini desserts?', answer: 'Yes, smaller portions of select desserts are often available with a hot drink.' },
      { question: 'Are vegan desserts available?', answer: 'Yes, there are usually dairy-free and vegan dessert options.' }
    ]
  },
  {
    slug: 'drinks-menu',
    name: 'Drinks Menu',
    primaryKeyword: 'wetherspoons drinks and prices',
    description: 'An extensive array of beverages, including real ales, craft beers, wines, spirits, and non-alcoholic options. Hot drinks are also available.',
    faqs: [
      { question: 'Are hot drink refills really free?', answer: 'Yes, self-serve tea, coffee, and hot chocolate include unlimited free refills on the day of purchase.' },
      { question: 'Do you sell local ales?', answer: 'Pubs frequently stock guest ales from local breweries alongside national brands.' },
      { question: 'Is tap water free?', answer: 'Yes, free tap water is always available.' }
    ]
  },
  {
    slug: 'sides',
    name: 'Sides',
    primaryKeyword: 'wetherspoons side dishes',
    description: 'Complement your main meal with our selection of sides. Choices include chips, onion rings, side salads, and garlic bread.',
    faqs: [
      { question: 'Can I order a bowl of chips on its own?', answer: 'Yes, sides can be ordered independently as a snack.' },
      { question: 'Are the onion rings whole rings?', answer: 'Yes, they are battered whole onion rings.' },
      { question: 'Are the side salads vegan?', answer: 'Yes, standard side salads are vegan, though dressing options may vary.' }
    ]
  },
  {
    slug: 'kids-menu',
    name: 'Kids Menu',
    primaryKeyword: 'wetherspoons kids menu options',
    description: 'Meals tailored for younger guests. Nutritious and appealing options designed with children in mind, including fruit and drink combinations.',
    faqs: [
      { question: 'What is included in a kids meal?', answer: 'A kids meal generally includes a main, a side, a drink, and a piece of fruit.' },
      { question: 'Are there healthy options for kids?', answer: 'Yes, sides like vegetables or side salads can be chosen instead of chips.' },
      { question: 'Is there a specific age limit for the kids menu?', answer: 'The kids menu is designed for younger children, typically those under 12.' }
    ]
  }
];
