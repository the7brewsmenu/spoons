import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = 'C:\\Users\\Ahmad Jutt\\.gemini\\antigravity\\brain\\eebf423c-b7be-477d-a29c-fa20238a8d78';
const outDir = path.join(process.cwd(), 'public', 'images', 'pages');

const filesToProcess = [
  { src: 'home_1791281766238.jpg', dest: 'home.webp' },
  { src: 'drinks_menu_1791281781863.jpg', dest: 'drinks-menu.webp' },
  { src: 'privacy_policy_1791281797119.jpg', dest: 'privacy-policy.webp' },
];

async function main() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const file of filesToProcess) {
    const srcPath = path.join(sourceDir, file.src);
    if (!fs.existsSync(srcPath)) {
      console.log(`Missing source: ${srcPath}`);
      continue;
    }
    
    const destPath = path.join(outDir, file.dest);
    await sharp(srcPath)
      .resize(1200, 630, { fit: 'cover' })
      .webp({ quality: 65 })
      .toFile(destPath);
      
    const stats = fs.statSync(destPath);
    console.log(`Processed ${file.dest} - ${(stats.size / 1024).toFixed(1)} KB`);
  }

  // Fallbacks for categories
  const categories = [
    'breakfast-menu', 'burgers', 'pizza', 'chicken-dishes', 
    'curry-club', 'steak-club', 'fish-dishes', 'sunday-roasts', 
    'desserts', 'sides', 'kids-menu'
  ];
  
  for (const cat of categories) {
    const destPath = path.join(outDir, `${cat}.webp`);
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(path.join(outDir, 'home.webp'), destPath);
      console.log(`Copied home.webp as fallback to ${cat}.webp`);
    }
  }

  // Fallbacks for info pages
  const infos = [
    'about', 'contact', 'disclaimer', 'terms-and-conditions', 
    'allergen-information', 'nutrition-information', 
    'vegan-and-vegetarian-options', 'breakfast-times', 
    'food-clubs', 'locations'
  ];

  for (const info of infos) {
    const destPath = path.join(outDir, `${info}.webp`);
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(path.join(outDir, 'privacy-policy.webp'), destPath);
      console.log(`Copied privacy-policy.webp as fallback to ${info}.webp`);
    }
  }
}

main().catch(console.error);
