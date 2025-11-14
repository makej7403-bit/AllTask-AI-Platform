// app/api/modules/run/[id]/route.js
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { verifyToken } from '@/utils/auth';
import { supabaseAdmin } from '@/utils/supabase';

const RUN_TIMEOUT_MS = 5000; // 5s timeout for module run

function loadModuleFile(id) {
  const modulesRoot = path.join(process.cwd(), 'modules');
  const groups = fs.readdirSync(modulesRoot);
  for (const g of groups) {
    const gp = path.join(modulesRoot, g);
    if (!fs.existsSync(gp) || !fs.statSync(gp).isDirectory()) continue;
    const file = path.join(gp, `${id}.js`);
    if (fs.existsSync(file)) {
      return { file, content: fs.readFileSync(file, 'utf8') };
    }
  }
  return null;
}

export async function POST(req, { params }) {
  try {
    const id = params.id;
    const token = req.headers.get('authorization')?.replace(/^Bearer\\s+/i,'') || req.cookies.get('token')?.value;
    const user = token ? verifyToken(token) : null;
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    // check subscription & quota (simple example)
    const { data: subs } = await supabaseAdmin.from('subscriptions').select('*').eq('customer_id', user.sub).limit(1);
    const sub = subs?.[0];
    if (!sub || sub.status !== 'active') {
      return new Response(JSON.stringify({ error: 'No active subscription or quota' }), { status: 403 });
    }

    // rate-limit check (you can implement more robust RLS)
    // TODO: check usage table for daily calls; here we allow by default

    const body = await req.json();
    const input = body.input || {};

    // load module file
    const moduleEntry = loadModuleFile(id);
    if (!moduleEntry) return new Response(JSON.stringify({ error: 'Module not found' }), { status: 404 });

    // sandbox-run module.run
    const sandbox = {
      module: {},
      exports: {},
      require: (p) => {
        // restrict requires: allow internal aiEngine via alias
        if (p === '@/lib/ai/aiEngine') {
          return require(path.join(process.cwd(), 'lib', 'ai', 'aiEngine.js'));
        }
        // you can add allowed modules here
        throw new Error('require not allowed in sandbox: ' + p);
      },
      console,
      process: { env: process.env },
    };

    const scriptCode = `(function(){ ${moduleEntry.content}; return module.exports; })()`;
    const script = new vm.Script(scriptCode, { timeout: RUN_TIMEOUT_MS });
    const context = vm.createContext(sandbox);
    let exported;
    try {
      exported = script.runInContext(context, { timeout: RUN_TIMEOUT_MS });
    } catch (vmErr) {
      console.error('VM exec error', vmErr);
      return new Response(JSON.stringify({ error: 'Module execution error' }), { status: 500 });
    }

    if (!exported || typeof exported.run !== 'function') {
      return new Response(JSON.stringify({ error: 'Module has no run function' }), { status: 500 });
    }

    // run exported.run with timeout promise
    const runPromise = Promise.resolve().then(() => exported.run(input, { user }));
    const result = await Promise.race([
      runPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error('Module run timeout')), RUN_TIMEOUT_MS))
    ]);

    // Log usage to supabase (best-effort)
    try {
      await supabaseAdmin.from('payments').insert([{ customer_id: sub.customer_id, amount: 0, currency: 'USD', provider_payment_id: null, status: 'ok', metadata: { module: id, user: user.sub } }]);
    } catch (e) { console.error('usage log failed', e); }

    return new Response(JSON.stringify({ ok: true, result }), { status: 200 });
  } catch (err) {
    console.error('module run error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
