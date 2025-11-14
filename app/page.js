// app/page.js
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { CREATOR } from '@/utils/identity';

export default function Home(){
  let moduleCount=0;
  try{ const modulesPath = path.join(process.cwd(),'modules'); moduleCount = fs.existsSync(modulesPath) ? fs.readdirSync(modulesPath).length : 0 }catch{}
  return (
    <div>
      <div className="header-row">
        <div><h2>Welcome to FullTask Global AI</h2><div className="small">A modular AI platform — created by {CREATOR}</div></div>
        <div><Link href="/dashboard"><button className="btn">Open Dashboard</button></Link></div>
      </div>
      <div className="grid">
        <div className="card"><h3>AI Chat</h3><p className="small">Talk to the AI assistant for tutoring and help.</p><Link href="/chat"><button className="btn">Open Chat</button></Link></div>
        <div className="card"><h3>Modules</h3><p className="small">Feature stubs in repo: <strong>{moduleCount}</strong></p><Link href="/dashboard"><button className="btn">Manage Modules</button></Link></div>
        <div className="card"><h3>Explorer</h3><p className="small">Search, news, and global utilities.</p><Link href="/explorer"><button className="btn">Open Explorer</button></Link></div>
      </div>
    </div>
  )
}
