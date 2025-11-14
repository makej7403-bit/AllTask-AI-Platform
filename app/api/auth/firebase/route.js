// server route - verify firebase ID token with admin SDK, return platform JWT
import admin from 'firebase-admin';
import { signToken } from '@/utils/auth';
import { supabaseAdmin } from '@/utils/supabase';

function initFirebaseAdmin() {
  if (admin.apps && admin.apps.length) return admin.app();
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT missing');
  const svc = typeof sa === 'string' ? JSON.parse(sa) : sa;
  if (svc.private_key) svc.private_key = svc.private_key.replace(/\\n/g, '\n');
  return admin.initializeApp({ credential: admin.credential.cert(svc) });
}

export async function POST(req) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return new Response(JSON.stringify({ error: 'idToken required' }), { status: 400 });

    initFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Upsert customer in Supabase (optional)
    try {
      await supabaseAdmin
        .from('customers')
        .upsert({ user_id: decoded.uid, email: decoded.email, metadata: { name: decoded.name } }, { onConflict: 'user_id' });
    } catch (e) {
      console.error('supabase upsert error', e);
    }

    const payload = { sub: decoded.uid, email: decoded.email || null, name: decoded.name || null, provider: 'firebase' };
    const platformToken = signToken(payload);

    // Optionally set httpOnly cookie (uncomment if you want cookies)
    // const response = new Response(JSON.stringify({ token: platformToken, user: payload }), { status: 200 });
    // response.headers.set('Set-Cookie', `token=${platformToken}; HttpOnly; Path=/; Max-Age=${7*24*3600}; SameSite=Lax`);
    // return response;

    return new Response(JSON.stringify({ token: platformToken, user: payload }), { status: 200 });
  } catch (err) {
    console.error('firebase auth route error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
