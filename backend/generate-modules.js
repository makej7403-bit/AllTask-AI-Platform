// generate_modules.js
// Usage: node generate_modules.js <count> <startIndex>
// Example: node generate_modules.js 2910 1
//
// This script will create N files inside ./modules/ named feat0001.js ... featNNNN.js
// Each file exports minimal metadata and a small Express router that responds to GET / with creator credit.

const fs = require('fs-extra');
const path = require('path');

const MODULES_DIR = path.join(__dirname, 'modules');
fs.ensureDirSync(MODULES_DIR);

const args = process.argv.slice(2);
const total = parseInt(args[0], 10) || 2910; // default ~2910 (410+1000+1500)
const start = parseInt(args[1], 10) || 1;

console.log(`Generating ${total} module stubs starting at index ${start} into ${MODULES_DIR}`);

function pad(n, width=4){ return String(n).padStart(width,'0'); }

(async () => {
  for (let i = start; i < start + total; i++){
    const idx = pad(i, 4);
    const id = `feat${idx}`;
    const name = `Feature ${i}`;
    const description = `Placeholder for ${name} — implement logic here`;
    const filePath = path.join(MODULES_DIR, `${id}.js`);
    if (await fs.pathExists(filePath)) {
      // skip existing to make generator idempotent
      continue;
    }
    const content = `
// ${id}.js
// Auto-generated module stub
const express = require('express');
const router = express.Router();
module.exports = {
  id: '${id}',
  name: '${name}',
  description: '${description}',
  router
};

// GET /api/modules/${id}/      (mounted at /api/modules/${id})
router.get('/', (req, res) => {
  res.json({
    id: '${id}',
    name: '${name}',
    description: '${description}',
    creator: '${process.env.CREATOR_NAME || 'Akin S. Sokpah from Nimba County, Liberia'}',
    example: 'This endpoint is a generated placeholder — add feature code here.'
  });
});
`;
    await fs.writeFile(filePath, content.trim());
    if (i % 100 === 0) process.stdout.write('.');
  }
  console.log(`\nDone generating ${total} modules.`);
  // initialize modules.json enabled map with all false (disabled)
  const metaPath = path.join(__dirname, 'modules.json');
  if (!(await fs.pathExists(metaPath))) {
    const meta = { generatedAt: new Date().toISOString(), enabled: {} };
    await fs.writeJson(metaPath, meta, { spaces: 2 });
  }
})();
``
