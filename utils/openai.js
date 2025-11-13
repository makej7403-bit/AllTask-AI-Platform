// utils/openai.js
export async function callOpenAI(messages = [], opts = {}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');
  const model = opts.model || 'gpt-4o-mini';
  const max_tokens = opts.max_tokens || 800;
  const temperature = opts.temperature ?? 0.7;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model, messages, max_tokens, temperature })
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('OpenAI error', data);
    throw new Error(data.error?.message || 'OpenAI API error');
  }
  return data.choices?.[0]?.message?.content ?? null;
}
