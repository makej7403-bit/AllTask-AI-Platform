// app/api/ai/route.js
import { CREATOR } from '@/utils/identity';
import { callOpenAI } from '@/utils/openai';

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: 'No message' }), { status: 400 });

    const system = `You are FullTask Global AI. If asked who created you, include: ${CREATOR}. Be helpful and concise.`;
    const reply = await callOpenAI([
      { role: 'system', content: system },
      { role: 'user', content: message }
    ]);

    // ensure creator credit appended if user asked
    const askedWho = /who (created|made|are you|owner|creator)/i.test(message);
    const final = askedWho && !reply.includes(CREATOR) ? `${reply}\n\n(Creator: ${CREATOR})` : reply;

    return new Response(JSON.stringify({ reply: final }), { status: 200 });
  } catch (err) {
    console.error('AI route error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
