// app/api/chat/route.js
import { callOpenAI } from '@/utils/openai';
import { CREATOR } from '@/utils/identity';

const CONV_STORE = global.__FT_CONV__ ||= []; // ephemeral store in server instance

export async function POST(req) {
  try {
    const { message, userId } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 });

    const system = `You are FullTask AI. Creator: ${CREATOR}. Provide clear, step-by-step answers for tutoring queries when appropriate.`;
    const ai = await callOpenAI([
      { role: 'system', content: system },
      { role: 'user', content: message }
    ]);

    const convo = { id: Date.now().toString(), userId: userId || 'anon', message, reply: ai, createdAt: new Date().toISOString() };
    CONV_STORE.push(convo);
    // keep last 200 in memory
    if (CONV_STORE.length > 200) CONV_STORE.shift();

    return new Response(JSON.stringify({ reply: ai, convoId: convo.id }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Chat error', details: String(err) }), { status: 500 });
  }
}

export async function GET() {
  // return recent convos (safe)
  return new Response(JSON.stringify({ count: CONV_STORE.length, recent: CONV_STORE.slice(-20) }), { status: 200, headers: { 'Content-Type': 'application/json' }});
}
