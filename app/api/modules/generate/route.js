// app/api/modules/generate/route.js
import fs from 'fs-extra';
import path from 'path';

export async function POST(req) {
  try {
    const { count = 100, start = 1, adminSecret } = await req.json();
    if (adminSecret !== process.env.ADMIN_SECRET) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const modulesPath = path.join(process.cwd(), 'modules');
    await fs.ensureDir(modulesPath);
    function pad(n,w=4){ return String(n).padStart(w,'0'); }
    let created = 0;
    for (let i = start; i < start + Number(count); i++) {
      const id = `feat${pad(i)}`;
      const fp = path.join(modulesPath, `${id}.js`);
      if (await fs.pathExists(fp)) continue;
      const content = `// ${id}.js\nmodule.exports = { id:'${id}', name:'Feature ${i}', description:'Auto-generated placeholder', creator:'Akin S. Sokpah from Nimba County, Liberia' };\n`;
      await fs.writeFile(fp, content, 'utf8');
      created++;
    }
    const metaPath = path.join(process.cwd(), 'modules.json');
    const meta = (await fs.pathExists(metaPath)) ? await fs.readJson(metaPath) : { enabled: {} };
    for (let i = start; i < start + Number(count); i++) {
      const id = `feat${pad(i)}`;
      if (!meta.enabled) meta.enabled = {};
      if (meta.enabled[id] === undefined) meta.enabled[id] = false;
    }
    meta.generatedAt = new Date().toISOString();
    await fs.writeJson(metaPath, meta, { spaces: 2 });
    return new Response(JSON.stringify({ status:'ok', created }), { status: 200 });
  } catch (err) {
    console.error('generator error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
