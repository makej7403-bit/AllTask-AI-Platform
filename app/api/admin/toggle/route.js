import fs from 'fs-extra';
import path from 'path';

export async function POST(req) {
  try {
    const { id, enable, adminSecret } = await req.json();
    if (adminSecret !== process.env.ADMIN_SECRET) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const metaPath = path.join(process.cwd(), 'modules.json');
    const meta = (await fs.pathExists(metaPath)) ? await fs.readJson(metaPath) : { enabled: {} };
    meta.enabled = meta.enabled || {};
    meta.enabled[id] = !!enable;
    await fs.writeJson(metaPath, meta, { spaces: 2 });
    return new Response(JSON.stringify({ status: 'ok', id, enabled: !!enable }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
