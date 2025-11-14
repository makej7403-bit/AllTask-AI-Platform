async function send() {
  if (!msg) return;

  const u = msg;
  setHistory(h => [...h, { role: 'user', text: u }]);
  setMsg('');

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: u })
    });

    const j = await res.json();
    setHistory(h => [...h, { role: 'bot', text: j.reply || 'No reply' }]);
  } catch (e) {
    setHistory(h => [
      ...h,
      { role: 'bot', text: 'Error contacting AI' }
    ]);
  }
}
