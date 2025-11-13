// app/api/modules/generate/route.js
import fs from 'fs-extra';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const count = Number(body.count || 100);
    const start = Number(body.start || 1);
    const adminSecret = body.adminSecret || '';

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const modulesDir = path.join(process.cwd(), 'modules');
    const metaPath = path.join(process.cwd(), 'modules.json');
    await fs.ensureDir(modulesDir);

    function pad(n, w = 4) { return String(n).padStart(w, '0'); }

    let created = 0;
    for (let i = start; i < start + count; i++) {
      const id = `feat${pad(i)}`;
      const filePath = path.join(modulesDir, `${id}.js`);
      if (await fs.pathExists(filePath)) continue;
      const content =
`// ${id}.js
module.exports = {
  id: '${id}',
  name: 'Feature ${i}',
  description: 'Auto-generated placeholder for ${id}',
  creator: 'Akin S. Sokpah from Nimba County, Liberia'
};
`;
      await fs.writeFile(filePath, content, 'utf8');
      created++;
    }

    // update modules.json
    const meta = (await fs.pathExists(metaPath)) ? await fs.readJson(metaPath) : { enabled: {} };
    for (let i = start; i < start + count; i++) {
      const id = `feat${pad(i)}`;
      if (!meta.enabled) meta.enabled = {};
      if (meta.enabled[id] === undefined) meta.enabled[id] = false;
    }
    meta.generatedAt = new Date().toISOString();
    await fs.writeJson(metaPath, meta, { spaces: 2 });

    return new Response(JSON.stringify({ status: 'ok', created }), { status: 200 });
  } catch (err) {
    console.error('generate modules error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
