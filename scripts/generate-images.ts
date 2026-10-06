import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const outDir = path.join(process.cwd(), 'public', 'images', 'pages');
fs.mkdirSync(outDir, { recursive: true });

const PAGES = [
  // Homepage
  { slug: 'home', prompt: 'A lively traditional British pub interior with a spread of classic pub food on a wooden table, navy blue and gold branding color scheme, warm inviting lighting' },
  
  // Categories
  { slug: 'breakfast-menu', prompt: 'A traditional full English breakfast with fried eggs, bacon, sausage, beans, and toast on a blue patterned plate, warm British pub setting, wooden table' },
  { slug: 'burgers', prompt: 'A juicy double beef burger with chips and a pint of beer on a wooden pub table, navy blue accents, traditional pub atmosphere' },
  { slug: 'pizza', prompt: 'A freshly baked pepperoni pizza sliced on a wooden board with a pint of beer, traditional British pub setting' },
  { slug: 'chicken-dishes', prompt: 'Crispy fried chicken wings and chicken strips with dipping sauces and chips on a pub table' },
  { slug: 'curry-club', prompt: 'A chicken tikka masala curry with yellow rice, naan bread, and a pint of beer on a wooden table, traditional British pub style' },
  { slug: 'steak-club', prompt: 'A perfectly grilled steak with thick-cut chips, peas, and a pint of ale, warm pub lighting' },
  { slug: 'fish-dishes', prompt: 'Traditional British battered fish and chips with mushy peas on a classic pub plate' },
  { slug: 'sunday-roasts', prompt: 'A traditional Sunday roast dinner with sliced beef, Yorkshire pudding, roast potatoes, vegetables and rich gravy' },
  { slug: 'desserts', prompt: 'A warm chocolate brownie dessert with vanilla ice cream dripping on top, in a cozy pub setting' },
  { slug: 'drinks-menu', prompt: 'A row of pints of beer and cider with traditional pub taps in the background, navy blue and gold branding' },
  { slug: 'sides', prompt: 'A sharing bowl of hot chips, onion rings, and sauces on a rustic wooden pub table' },
  { slug: 'kids-menu', prompt: 'A kid-friendly pub meal of chicken nuggets and chips with a fruit drink on a wooden table' },

  // Info Pages
  { slug: 'about', prompt: 'A beautiful exterior of a grand traditional British pub with floral hanging baskets and gold lettering on a navy blue sign' },
  { slug: 'contact', prompt: 'A friendly bartender serving a pint at a traditional wooden pub bar, warm lighting, navy and gold colors' },
  { slug: 'disclaimer', prompt: 'A close-up of a traditional British pub menu on a wooden table with a pint of ale beside it, blurred cozy background' },
  { slug: 'privacy-policy', prompt: 'A cozy quiet corner in a traditional British pub with leather seating, wood paneling, and warm lighting' },
  { slug: 'terms-and-conditions', prompt: 'A traditional brass pub bell and wooden bar counter, elegant navy blue and gold pub setting' },
  { slug: 'allergen-information', prompt: 'A vibrant display of fresh ingredients like vegetables, gluten-free grains, and fresh produce on a rustic wooden table' },
  { slug: 'nutrition-information', prompt: 'A healthy grilled chicken salad on a classic pub plate with a glass of water, highlighting balanced nutrition' },
  { slug: 'vegan-and-vegetarian-options', prompt: 'A delicious plant-based vegan burger with sweet potato fries on a wooden pub table' },
  { slug: 'breakfast-times', prompt: 'A steaming cup of coffee and a pastry on a wooden table in a British pub, with warm morning sunlight streaming in' },
  { slug: 'food-clubs', prompt: 'A lively group of friends enjoying a meal of curries and steaks together at a table in a traditional British pub' },
  { slug: 'locations', prompt: 'A classic British pub exterior on a high street, with navy blue awnings and gold lettering, bustling city atmosphere' }
];

async function main() {
  console.log(`Starting image generation for ${PAGES.length} pages...`);
  let count = 0;
  for (const page of PAGES) {
    const filePath = path.join(outDir, `${page.slug}.webp`);
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${page.slug}, already exists.`);
      continue;
    }
    
    console.log(`Generating image for ${page.slug}...`);
    try {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: page.prompt + ". Professional photography, realistic, high quality, highly detailed.",
        n: 1,
        size: "1024x1024",
      });
      
      const url = response.data?.[0]?.url;
      if (!url) throw new Error("No URL returned");
      
      const imgRes = await fetch(url);
      const imgBuffer = await imgRes.arrayBuffer();
      
      // Resize to 1200x630 for OG image / hero header, use WebP 70 for <100kb
      await sharp(Buffer.from(imgBuffer))
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .webp({ quality: 70 })
        .toFile(filePath);
        
      const stats = fs.statSync(filePath);
      console.log(`Saved ${page.slug}.webp (${(stats.size / 1024).toFixed(1)} KB)`);
      count++;
    } catch (e: any) {
      console.error(`Error on ${page.slug}:`, e.message);
    }
  }
  console.log(`Finished generating ${count} new images.`);
}

main();
