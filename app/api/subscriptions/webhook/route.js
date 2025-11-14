import { supabaseAdmin } from '@/utils/supabase';

export async function POST(req) {
  const secret = req.headers.get('x-webhook-secret') || req.headers.get('stripe-signature');
  if (!process.env.WEBHOOK_SECRET || secret !== process.env.WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const event = await req.json();
  // Example: handle subscription updated event
  try {
    const type = event.type;
    if (type === 'customer.subscription.updated') {
      const sub = event.data.object;
      const { data: found } = await supabaseAdmin.from('subscriptions').select('*').eq('provider_subscription_id', sub.id).limit(1);
      if (found && found.length > 0) {
        const s = found[0];
        await supabaseAdmin.from('subscriptions').update({
          status: sub.status,
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          metadata: { ...s.metadata, raw: sub }
        }).eq('id', s.id);
      }
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('webhook error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
