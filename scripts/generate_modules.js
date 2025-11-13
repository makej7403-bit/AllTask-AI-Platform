// scripts/generate_modules.js
// Usage (local/CI): node scripts/generate_modules.js <count> <start>
// Example: node scripts/generate_modules.js 2900 1

const fs = require('fs-extra');
const path = require('path');

const args = process.argv.slice(2);
const total = parseInt(args[0], 10) || 2900;
const start = parseInt(args[1], 10) || 1;

const modulesDir = path.join(process.cwd(), 'modules');
const metaFile = path.join(process.cwd(), 'modules.json');

fs.ensureDirSync(modulesDir);

function pad(n, w = 4) { return String(n).padStart(w, '0'); }

(async () => {
  console.log(`Generating ${total} modules starting at ${start} into ${modulesDir}`);
  let created = 0;

  for (let i = start; i < start + total; i++) {
    const idx = pad(i);
    const id = `feat${idx}`;
    const filePath = path.join(modulesDir, `${id}.js`);

    if (await fs.pathExists(filePath)) {
      // skip existing for idempotency
      continue;
    }

    const content =
`// ${id}.js
// Auto-generated FullTask module stub
module.exports = {
  id: '${id}',
  name: 'Feature ${i}',
  description: 'Auto-generated placeholder for ${id}',
  creator: 'Akin S. Sokpah from Nimba County, Liberia'
};

// Example handler for Express or for direct require usage:
// exports.handler = (req, res) => res.json({ id: '${id}', creator: 'Akin S. Sokpah from Nimba County, Liberia', note: 'Implement feature logic here' });
`;

    await fs.writeFile(filePath, content, 'utf8');
    created++;
    if (created % 100 === 0) process.stdout.write('.');
  }

  // update modules.json metadata
  let meta = { generatedAt: new Date().toISOString(), total: total, enabled: {} };
  if (await fs.pathExists(metaFile)) {
    try { meta = await fs.readJson(metaFile); } catch(e){ meta = { generatedAt: new Date().toISOString(), enabled: {} }; }
  }
  // ensure all created modules are present in meta.enabled (default false)
  for (let i = start; i < start + total; i++) {
    const id = `feat${pad(i)}`;
    if (!meta.enabled) meta.enabled = {};
    if (meta.enabled[id] === undefined) meta.enabled[id] = false;
  }

  await fs.writeJson(metaFile, meta, { spaces: 2 });

  console.log(`\nDone. Created ${created} new modules. Meta written to modules.json`);
})();
