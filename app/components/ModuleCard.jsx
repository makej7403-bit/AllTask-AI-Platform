import Link from 'next/link';

export default function ModuleCard({ module }) {
  const { id, name, description, enabled } = module;
  return (
    <div style={{ background:'#fff', border:'1px solid #eee', padding:12, borderRadius:8 }}>
      <h4 style={{ margin:'6px 0' }}>{name}</h4>
      <div style={{ fontSize:13, color:'#555', minHeight:44 }}>{description || 'No description'}</div>
      <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Link href={`/modules/${id}`}><button className="btn">Open</button></Link>
        <div style={{ fontSize:12 }}>{enabled ? 'Enabled ✅' : 'Disabled ❌'}</div>
      </div>
    </div>
  );
}
