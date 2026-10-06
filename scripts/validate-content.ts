import { menuItems } from '../content/menu';
import { categories } from '../content/categories';
import { validateAllContent } from '../lib/content-validation';

console.log('Validating SpoonsMenu content...');

const validation = validateAllContent(menuItems, categories, []);

if (!validation.valid) {
  console.error('Content validation failed:');
  validation.errors.forEach(err => console.error(`- ${err}`));
  process.exit(1);
} else {
  console.log('Content validation passed successfully!');
  process.exit(0);
}
