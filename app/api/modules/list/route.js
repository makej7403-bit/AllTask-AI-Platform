// app/api/modules/list/route.js
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const modulesPath = path.join(process.cwd(), 'modules');
    if (!fs.existsSync(modulesPath)) return new Response(JSON.stringify({ modules: [], count: 0 }), { status: 200 });

    const files = fs.readdirSync(modulesPath).filter(f => f.endsWith('.js'));
    const modules = files.map(f => ({ id: f.replace('.js',''), file: f }));
    return new Response(JSON.stringify({ modules, count: modules.length }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Could not list modules', details: String(err) }), { status: 500 });
  }
}
