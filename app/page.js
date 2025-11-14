import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { CREATOR } from '@/utils/identity';

export default function Home() {
  let moduleCount = 0;
  try {
    const modulesPath = path.join(process.cwd(), 'modules');
    moduleCount = fs.existsSync(modulesPath) ? fs.readdirSync(modulesPath).reduce((acc, g) => {
      const gp = path.join(modulesPath, g);
      if (fs.statSync(gp).isDirectory()) {
        return acc + fs.readdirSync(gp).filter(f => f.endsWith('.js')).length;
      }
      return acc;
    }, 0) : 0;
  } catch (e) {}
  return (
    <div>
      <h2>Welcome to FullTask Global AI</h2>
      <p>Creator: {CREATOR}</p>
      <div>Modules available: {moduleCount}</div>
      <div style={{ marginTop: 12 }}>
        <Link href="/chat"><button>Open Chat</button></Link>
        <Link href="/dashboard" style={{ marginLeft: 8 }}><button>Dashboard</button></Link>
      </div>
    </div>
  );
}
