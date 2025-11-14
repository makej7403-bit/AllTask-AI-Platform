// app/api/modules/list/route.js
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const modulesRoot = path.join(process.cwd(), 'modules');
    const metaPath = path.join(process.cwd(), 'modules.json');

    if (!fs.existsSync(modulesRoot)) return new Response(JSON.stringify({ modules: [], count: 0 }), { status: 200 });

    const groups = fs.readdirSync(modulesRoot);
    const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : { enabled: {} };

    const modules = [];

    for (const g of groups) {
      const gp = path.join(modulesRoot, g);
      if (!fs.existsSync(gp) || !fs.statSync(gp).isDirectory()) continue;
      const files = fs.readdirSync(gp).filter(f => f.endsWith('.js'));
      for (const f of files) {
        const id = f.replace('.js', '');
        const content = fs.readFileSync(path.join(gp, f), 'utf8');
        const nameMatch = content.match(/name:\s*['"`](.*?)['"`]/);
        const descMatch = content.match(/description:\s*['"`](.*?)['"`]/);
        const name = nameMatch ? nameMatch[1] : id;
        const description = descMatch ? descMatch[1] : '';
        modules.push({ id, name, description, enabled: !!meta.enabled[id], path: `/api/modules/load/${id}` });
      }
    }

    return new Response(JSON.stringify({ modules, count: modules.length }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
