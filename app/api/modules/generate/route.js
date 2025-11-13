// app/api/modules/generate/route.js
import fs from 'fs-extra';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { count = 100, start = 1, adminSecret } = await req.json();
    // simple admin check via ENV
    if (adminSecret !== process.env.ADMIN_SECRET) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const modulesPath = path.join(process.cwd(), 'modules');
    await fs.ensureDir(modulesPath);

    function pad(n, w=4){ return String(n).padStart(w, '0'); }

    for (let i = start; i < start + count; i++) {
      const id = `feat${pad(i)}`;
      const filePath = path.join(modulesPath, `${id}.js`);
      if (await fs.pathExists(filePath)) continue;
      const content = `// ${id}.js - auto generated\nmodule.exports = { id: '${id}', name: 'Feature ${i}', description: 'Placeholder for ${id}', handler: (req,res)=>res.json({id:'${id}', creator:'Akin S. Sokpah from Nimba County, Liberia'}) };`;
      await fs.writeFile(filePath, content, 'utf8');
    }

    return new Response(JSON.stringify({ status: 'ok', created: count }), { status: 200 });
  } catch (err) {
    console.error('generate modules error', err);
    return new Response(JSON.stringify({ error: 'Failed to generate modules', details: String(err) }), { status: 500 });
  }
}
