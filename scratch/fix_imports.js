const fs = require('fs');
const path = require('path');

const ucDir = path.join(__dirname, '..', 'src', 'module', 'commerce', 'catalog', 'applications', 'use-cases');
const files = fs.readdirSync(ucDir);

for (const file of files) {
  if (file.endsWith('.ts')) {
    const fullPath = path.join(ucDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/type type ICatalogRepository/g, 'type ICatalogRepository');
    fs.writeFileSync(fullPath, content);
  }
}
console.log('Fixed double type.');
