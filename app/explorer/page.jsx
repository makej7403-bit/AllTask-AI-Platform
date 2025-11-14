import ModuleCard from '@/app/components/ModuleCard';

export default async function ExplorerPage() {
  // server-side fetch modules list
  let modules = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/modules/list`, { cache: 'no-store' });
    if (res.ok) modules = await res.json().then(j => j.modules || []);
  } catch (e) { modules = []; }

  return (
    <div>
      <h2>Explorer — AI Features</h2>
      <p>Browse the available AI features and tools.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
        {modules.length === 0 && <div>No modules found yet.</div>}
        {modules.map(m => <ModuleCard key={m.id} module={m} />)}
      </div>
    </div>
  );
}
