'use client';
import { useEffect,useState } from 'react';

export default function DashboardPage(){
  const [modules,setModules] = useState([]);
  const [adminSecret,setAdminSecret] = useState('');
  const [loading,setLoading] = useState(false);

  async function load(){
    setLoading(true);
    const res = await fetch('/api/modules/list');
    const j = await res.json();
    setModules(j.modules || []);
    setLoading(false);
  }
  useEffect(()=>{ load(); }, []);

  async function toggle(id, enable){
    if(!adminSecret) return alert('Enter admin secret');
    const res = await fetch('/api/admin/toggle', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, enable, adminSecret })});
    const j = await res.json();
    alert(JSON.stringify(j));
    load();
  }

  return (
    <div>
      <div className="header-row">
        <h2>Admin Dashboard</h2>
        <div><input className="input" placeholder="Admin secret" value={adminSecret} onChange={e=>setAdminSecret(e.target.value)} style={{width:260}}/></div>
      </div>

      <div className="small">Toggle modules (enable = true mounts route). Use admin secret set in ENV.</div>
      <div style={{height:12}} />
      {loading ? <div>Loading...</div> :
        <div className="grid">
          {modules.map(m=>(
            <div className="card" key={m.id}>
              <h3>{m.name}</h3>
              <div className="small">{m.description}</div>
              <div style={{marginTop:12,display:'flex',gap:8}}>
                <button className="btn" onClick={()=>toggle(m.id, !m.enabled)}>{m.enabled?'Disable':'Enable'}</button>
                <a href={`/api/modules/load/${m.id}`} target="_blank" rel="noreferrer">Open</a>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
