'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [modules, setModules] = useState([]);

  useEffect(()=>{ fetchModules(); }, []);

  async function fetchModules() {
    const res = await fetch('/api/modules/list');
    const j = await res.json();
    setModules(j.modules || []);
  }

  async function toggle(id, enable) {
    const res = await fetch('/api/admin/toggle', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, enable, adminSecret: prompt('Admin secret (enter to toggle):') })});
    const j = await res.json();
    alert(JSON.stringify(j));
    fetchModules();
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
        {modules.map(m=>(
          <div key={m.id} style={{ border:'1px solid #eee', padding:10, borderRadius:8 }}>
            <h4>{m.name}</h4>
            <div style={{ fontSize:13, color:'#555' }}>{m.description}</div>
            <div style={{ marginTop:8 }}>
              <button className="btn" onClick={()=>toggle(m.id, !m.enabled)}>{m.enabled ? 'Disable' : 'Enable'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
