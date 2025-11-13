// scripts/generate_modules.js
// Usage: node scripts/generate_modules.js <count> <start>
const fs = require('fs-extra');
const path = require('path');

const args = process.argv.slice(2);
const total = parseInt(args[0], 10) || 2900;
const start = parseInt(args[1], 10) || 1;

const modulesDir = path.join(process.cwd(), 'modules');
const metaFile = path.join(process.cwd(), 'modules.json');

fs.ensureDirSync(modulesDir);

function pad(n,w=4){ return String(n).padStart(w,'0'); }

(async ()=>{
  console.log(`Generating ${total} modules starting at ${start} into ${modulesDir}`);
  let created = 0;
  for(let i=start;i<start+total;i++){
    const id = `feat${pad(i)}`;
    const filePath = path.join(modulesDir, `${id}.js`);
    if (await fs.pathExists(filePath)) continue;
    const content = `// ${id}.js\nmodule.exports = {\n  id: '${id}',\n  name: 'Feature ${i}',\n  description: 'Auto-generated placeholder for ${id}',\n  creator: 'Akin S. Sokpah from Nimba County, Liberia'\n};\n`;
    await fs.writeFile(filePath, content, 'utf8');
    created++;
    if (created % 100 === 0) process.stdout.write('.');
  }
  let meta = { generatedAt: new Date().toISOString(), enabled: {} };
  if (await fs.pathExists(metaFile)) {
    try { meta = await fs.readJson(metaFile); } catch {}
  }
  for(let i=start;i<start+total;i++){
    const id = `feat${pad(i)}`;
    if(!meta.enabled) meta.enabled = {};
    if(meta.enabled[id] === undefined) meta.enabled[id] = false;
  }
  await fs.writeJson(metaFile, meta, { spaces: 2 });
  console.log(`\nDone. Created ${created} new modules.`);
})();
