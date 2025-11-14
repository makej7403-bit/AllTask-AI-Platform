'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState([]);

  async function send() {
    if (!msg) return;
    const u = msg;
    setHistory(h=>[...h, { role:'user', text:u }]);
    setMsg('');
    try {
      const res = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: u }) });
      const j = await res.json();
      setHistory(h=>[...h, { role:'bot', text: j.reply || 'No reply' }]);
    } catch (e) {
      setHistory(h=>[...h, { role:'bot', text: 'Error contacting AI' }]);
    }
  }

  return (
    <div>
      <h2>AI Chat</h2>
      <div style={{ border: '1px solid #eee', padding: 12, minHeight: 240 }}>
        {history.length===0 ? <div>Start the conversation below.</div> : history.map((m,i)=>(<div key={i}><b>{m.role==='user'?'You':'AI'}:</b> {m.text}</div>))}
      </div>
      <div style={{ marginTop: 8 }}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} style={{ width: '70%' }} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
