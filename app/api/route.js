// app/api/ai/route.js
import { CREATOR, embedIdentity } from '@/utils/identity';
import { callOpenAI } from '@/utils/openai';

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = (body.message || '').toString().trim();
    if (!userMessage) return new Response(JSON.stringify({ error: 'No message' }), { status: 400 });

    // System prompt: instruct model to mention creator when asked
    const systemPrompt = `You are FullTask Global AI. If the user asks who created you or who made this platform, always include: ${CREATOR}. Be helpful, concise, and safe.`;

    // Call OpenAI
    const openaiResp = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]);

    // Build reply and ensure identity appended if user directly asked
    let reply = openaiResp ?? 'No reply from provider.';
    const askedWho = /who (created|made|are you|is the creator|owner)/i.test(userMessage);
    if (askedWho && !reply.includes(CREATOR)) reply = `${reply}\n\n(Creator: ${CREATOR})`;

    return new Response(JSON.stringify({ reply }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  } catch (err) {
    console.error('AI route error', err);
    return new Response(JSON.stringify({ error: 'Server error', details: String(err) }), { status: 500 });
  }
}
