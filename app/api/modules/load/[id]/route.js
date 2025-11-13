// app/api/modules/load/[id]/route.js
import path from 'path';
import fs from 'fs';

export async function GET(req, { params }) {
  try {
    const id = params.id;
    const file = path.join(process.cwd(), 'modules', `${id}.js`);
    if (!fs.existsSync(file)) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    const mod = require(file);
    // return metadata only
    return new Response(JSON.stringify({ id: mod.id || id, name: mod.name, description: mod.description, creator: mod.creator }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
