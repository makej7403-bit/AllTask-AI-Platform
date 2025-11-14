'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState([]);

  async function send() {
    if (!msg) return;
    const u = msg;
    setHistory(h => [...h, { role: 'user', text: u }]);
    setMsg('');
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: u, task: 'general' }) });
      const j = await res.json();
      setHistory(h => [...h, { role: 'bot', text: j.result || j.reply || 'No reply' }]);
    } catch (e) {
      setHistory(h => [...h, { role: 'bot', text: 'Error contacting AI' }]);
    }
  }

  return (
    <div>
      <h2>AI Chat</h2>
      <div style={{ border: '1px solid #eee', padding: 12, minHeight: 280 }}>
        {history.length === 0 ? <div style={{ color:'#666' }}>Ask something — AI will answer.</div> : history.map((m, i) => (
          <div key={i} style={{ marginBottom:10 }}>
            <div style={{ fontWeight:700 }}>{m.role === 'user' ? 'You' : 'FullTask AI'}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:10, display:'flex', gap:8 }}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type your question..." style={{ flex:1, padding:8 }} />
        <button onClick={send} className="btn">Send</button>
      </div>
    </div>
  );
}
