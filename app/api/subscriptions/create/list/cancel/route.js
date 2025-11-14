import { supabaseAdmin } from '@/utils/supabase';

export async function POST(req) {
  try {
    const { subscription_id, cancel_at_period_end = true } = await req.json();
    if (!subscription_id) return new Response(JSON.stringify({ error: 'subscription_id required' }), { status: 400 });
    const updates = { cancel_at_period_end: !!cancel_at_period_end, status: cancel_at_period_end ? 'cancelled' : 'cancelling', updated_at: new Date().toISOString() };
    const { data, error } = await supabaseAdmin.from('subscriptions').update(updates).eq('id', subscription_id).select().single();
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true, subscription: data }), { status: 200 });
  } catch (err) {
    console.error('cancel subscription', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
