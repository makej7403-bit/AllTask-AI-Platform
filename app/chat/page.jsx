'use client';
import { useState } from 'react';
export default function ChatPage(){
  const [msg,setMsg]=useState(''), [history,setHistory]=useState([]);
  async function send(){
    if(!msg) return;
    const u=msg; setHistory(h=>[...h,{role:'user',text:u}]); setMsg('');
    try{ const res = await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({message:u})}); const j=await res.json(); setHistory(h=>[...h,{role:'bot',text:j.reply||'No reply'}]); }catch(e){ setHistory(h=>[...h,{role:'bot',text':'Error contacting AI'}]); }
  }
  return (<div>
    <div className="header-row"><h2>AI Chat</h2><div className="small">Creator: Akin S. Sokpah</div></div>
    <div className="card" style={{minHeight:240,maxHeight:420,overflow:'auto'}}>{history.length===0 ? <div className="small">Start the conversation below.</div> : history.map((m,i)=>(<div key={i} style={{marginBottom:8}}><div style={{fontWeight:700}}>{m.role==='user' ? 'You' : 'FullTask AI'}:</div><div>{m.text}</div></div>))}</div>
    <div style={{display:'flex',gap:8,marginTop:12}}><input className="input" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type your question..." /><button className="btn" onClick={send}>Send</button></div>
  </div>)
}
