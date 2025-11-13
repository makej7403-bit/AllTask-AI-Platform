// app/dashboard/page.jsx
'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');

  async function loadModules() {
    setLoading(true);
    const res = await fetch('/api/modules/list');
    const json = await res.json();
    setModules(json.modules || []);
    setLoading(false);
  }

  useEffect(() => { loadModules(); }, []);

  async function toggle(id, enable) {
    if (!adminSecret) return alert('Enter admin secret (server .env ADMIN_SECRET) to toggle modules');
    const res = await fetch('/api/admin/toggle', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id, enable, secret: adminSecret })
    });
    const j = await res.json();
    alert(JSON.stringify(j));
    loadModules();
  }

  return (
    <div>
      <div className="header-row">
        <h2>Admin Dashboard</h2>
        <div>
          <input className="input" placeholder="Admin secret" value={adminSecret} onChange={e=>setAdminSecret(e.target.value)} style={{width:260}} />
        </div>
      </div>

      <div className="small">Toggle modules (enable = mount route). Enabling may require server restart to fully unmount on disable.</div>
      <div style={{height:12}} />

      {loading ? <div>Loading modules...</div> :
        <div className="grid">
          {modules.map(m => (
            <div className="card" key={m.id}>
              <h3>{m.name}</h3>
              <div className="small">{m.description}</div>
              <div style={{marginTop:12, display:'flex', gap:8}}>
                <button className="btn" onClick={()=>toggle(m.id, !m.enabled)}>{m.enabled ? 'Disable' : 'Enable'}</button>
                <a href={`/api/modules/${m.id}`} target="_blank" rel="noreferrer">Open Endpoint</a>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
