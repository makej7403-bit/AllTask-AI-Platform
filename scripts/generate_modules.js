// scripts/generate_modules.js
// Usage: node scripts/generate_modules.js <total> <start> <groupSize>
// Example: node scripts/generate_modules.js 3000 1 500

const fs = require('fs-extra');
const path = require('path');

const args = process.argv.slice(2);
const total = parseInt(args[0], 10) || 3000;
const start = parseInt(args[1], 10) || 1;
const groupSize = parseInt(args[2], 10) || 500;

const modulesDir = path.join(process.cwd(), 'modules');
const metaFile = path.join(process.cwd(), 'modules.json');

fs.ensureDirSync(modulesDir);

function pad(n, w = 4) {
  return String(n).padStart(w, '0');
}

(async () => {
  console.log(`Generating ${total} modules starting at ${start} (group size ${groupSize}) into ${modulesDir}`);
  let created = 0;

  for (let i = start; i < start + total; i++) {
    const idx = pad(i);
    const id = `feat${idx}`;

    // Optionally put modules into grouped subfolders to avoid huge single-folder listing
    const groupIndex = Math.floor((i - start) / groupSize) + 1;
    const folder = path.join(modulesDir, `group_${String(groupIndex).padStart(3, '0')}`);
    await fs.ensureDir(folder);

    const filePath = path.join(folder, `${id}.js`);

    if (await fs.pathExists(filePath)) {
      continue; // skip if exists
    }

    const content = `// ${id}.js
// Auto-generated FullTask module stub
module.exports = {
  id: '${id}',
  name: 'Feature ${i}',
  description: 'Auto-generated placeholder for ${id} — category: ${groupIndex}',
  creator: 'Akin S. Sokpah from Nimba County, Liberia',
  exampleInput: null,
  exampleOutput: null,
  run: async function(input) {
    // Implement feature logic here
    return { ok: true, id: '${id}', message: 'This is a stub module. Implement the run method.' };
  }
};
`;

    await fs.writeFile(filePath, content, 'utf8');
    created++;
    if (created % 100 === 0) process.stdout.write('.');
  }

  // Update modules.json metadata: collect all files
  const meta = { generatedAt: new Date().toISOString(), total: 0, enabled: {} };
  const groups = await fs.readdir(modulesDir);
  let count = 0;

  for (const g of groups) {
    const gp = path.join(modulesDir, g);
    if ((await fs.stat(gp)).isDirectory()) {
      const files = (await fs.readdir(gp)).filter(f => f.endsWith('.js'));
      for (const f of files) {
        const id = path.basename(f, '.js');
        if (!meta.enabled[id]) meta.enabled[id] = false;
      }
      count += files.length;
    }
  }

  meta.total = count;
  await fs.writeJson(metaFile, meta, { spaces: 2 });

  console.log(`\nDone. Created ${created} new module files. Total modules: ${meta.total}`);
})();
