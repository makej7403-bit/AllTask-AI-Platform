import { supabaseAdmin } from '@/utils/supabase';

export async function POST(req) {
  try {
    const { plan = 'free', email, userId, provider = 'manual', provider_subscription_id = null } = await req.json();
    const { data: existing } = await supabaseAdmin
      .from('customers').select('*').or(`email.eq.${email},user_id.eq.${userId}`).limit(1);
    let customer = existing && existing[0];
    if (!customer) {
      const { data } = await supabaseAdmin.from('customers').insert([{ user_id: userId || null, email }]).select().single();
      customer = data;
    }
    const { data: sub } = await supabaseAdmin.from('subscriptions').insert([{
      customer_id: customer.id,
      provider, provider_subscription_id, plan,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30*24*3600*1000).toISOString()
    }]).select().single();
    return new Response(JSON.stringify({ ok: true, subscription: sub, customer }), { status: 200 });
  } catch (err) {
    console.error('create subscription', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
