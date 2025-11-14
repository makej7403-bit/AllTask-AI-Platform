// scripts/generate_modules.js
const fs = require('fs-extra');
const path = require('path');
const total = parseInt(process.argv[2],10) || 2900;
const start = parseInt(process.argv[3],10) || 1;
const modulesDir = path.join(process.cwd(),'modules');
const metaFile = path.join(process.cwd(),'modules.json');
fs.ensureDirSync(modulesDir);
function pad(n,w=4){ return String(n).padStart(w,'0'); }
(async()=>{
  let created=0;
  for(let i=start;i<start+total;i++){
    const id = `feat${pad(i)}`;
    const fp = path.join(modulesDir, `${id}.js`);
    if (await fs.pathExists(fp)) continue;
    const content = `// ${id}.js\nmodule.exports = { id: '${id}', name: 'Feature ${i}', description: 'Auto-generated placeholder', creator: 'Akin S. Sokpah from Nimba County, Liberia' };\n`;
    await fs.writeFile(fp, content, 'utf8');
    created++;
    if(created%100===0) process.stdout.write('.');
  }
  const meta = (await fs.pathExists(metaFile)) ? await fs.readJson(metaFile) : { generatedAt: new Date().toISOString(), enabled: {} };
  for(let i=start;i<start+total;i++){ meta.enabled[`feat${pad(i)}`] = meta.enabled[`feat${pad(i)}`] || false; }
  await fs.writeJson(metaFile, meta, { spaces: 2 });
  console.log(`\nCreated ${created} modules`);
})();
