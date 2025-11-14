import { supabaseAdmin } from '@/utils/supabase';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const customer_id = url.searchParams.get('customer_id');
    const user_id = url.searchParams.get('user_id');
    let query = supabaseAdmin.from('subscriptions').select('*');
    if (customer_id) query = query.eq('customer_id', customer_id);
    else if (user_id) {
      const { data: customers } = await supabaseAdmin.from('customers').select('id').eq('user_id', user_id);
      const ids = customers?.map(c => c.id) || [];
      query = query.in('customer_id', ids);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return new Response(JSON.stringify({ subscriptions: data || [] }), { status: 200 });
  } catch (err) {
    console.error('list subscriptions', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
