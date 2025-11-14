import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const modulesRoot = path.join(process.cwd(), 'modules');
    // search groups for id
    const groups = fs.readdirSync(modulesRoot);
    for (const g of groups) {
      const gp = path.join(modulesRoot, g);
      if (!fs.statSync(gp).isDirectory()) continue;
      const file = path.join(gp, `${id}.js`);
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const nameMatch = content.match(/name:\s*['"`](.*?)['"`]/);
        const descMatch = content.match(/description:\s*['"`](.*?)['"`]/);
        const creatorMatch = content.match(/creator:\s*['"`](.*?)['"`]/);
        return new Response(JSON.stringify({
          id,
          name: nameMatch ? nameMatch[1] : id,
          description: descMatch ? descMatch[1] : '',
          creator: creatorMatch ? creatorMatch[1] : ''
        }), { status: 200 });
      }
    }
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
