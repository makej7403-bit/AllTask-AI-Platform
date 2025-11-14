import path from 'path';

export default async function ModulePage({ params }) {
  const { id } = params;
  let module = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/modules/load/${id}`, { cache: 'no-store' });
    if (res.ok) module = await res.json();
  } catch (e) { module = null; }

  if (!module) return <div><h3>Module not found</h3></div>;

  return (
    <div>
      <h2>{module.name}</h2>
      <p style={{ color:'#666' }}>{module.description}</p>
      <div style={{ marginTop:12 }}>
        <strong>Creator:</strong> {module.creator || 'Unknown'}
      </div>

      <div style={{ marginTop:20 }}>
        <h4>Run Module</h4>
        <ModuleRunner id={id} />
      </div>
    </div>
  );
}

function ModuleRunner({ id }) {
  // client-side runner component (uses fetch)
  return (
    <div>
      <textarea id="mr-input" placeholder="Enter input..." style={{ width:'100%', minHeight:100, padding:8 }}></textarea>
      <div style={{ marginTop:8 }}>
        <button onClick={async ()=>{
          const input = document.getElementById('mr-input').value;
          const res = await fetch(`/api/modules/run/${id}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ input }) });
          const j = await res.json();
          alert(JSON.stringify(j, null, 2));
        }} className="btn">Run</button>
      </div>
    </div>
  );
}
