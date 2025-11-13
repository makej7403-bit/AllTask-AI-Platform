// app/api/modules/list/route.js
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const modulesPath = path.join(process.cwd(), 'modules');
    const metaPath = path.join(process.cwd(), 'modules.json');
    if (!fs.existsSync(modulesPath)) return new Response(JSON.stringify({ modules: [], count: 0 }), { status: 200 });

    const files = fs.readdirSync(modulesPath).filter(f => f.endsWith('.js'));
    const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : { enabled: {} };

    const modules = files.map(f => {
      const id = f.replace('.js','');
      let info = { id, name: id, description: '', enabled: !!meta.enabled[id] };
      try {
        const mod = require(path.join(process.cwd(), 'modules', f));
        info.name = mod.name || info.name;
        info.description = mod.description || info.description;
      } catch (e) {}
      return info;
    });

    return new Response(JSON.stringify({ modules, count: modules.length }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
