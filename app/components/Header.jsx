'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // attempt to fetch current user (if cookie-based session exists)
    async function me() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const j = await res.json();
          setUser(j.user || null);
        }
      } catch (e) {}
    }
    me();
  }, []);

  return (
    <header style={{ background:'#fff', borderBottom:'1px solid #eee', padding: 12 }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <Link href="/"><strong style={{ fontSize: 20 }}>FullTask Global AI</strong></Link>
          <div style={{ fontSize:12, color:'#666' }}>Created by Akin S. Sokpah — Nimba County</div>
        </div>
        <nav style={{ display:'flex', gap:12, alignItems:'center' }}>
          <Link href="/explorer">Explorer</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/dashboard">Dashboard</Link>
          {user ? (
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ fontSize:13 }}>{user.email || user.name || 'Me'}</span>
              <button onClick={async ()=>{ await fetch('/api/auth/logout',{method:'POST'}); location.href='/'; }} className="btn">Sign out</button>
            </div>
          ) : (
            <Link href="/login"><button className="btn">Sign in</button></Link>
          )}
        </nav>
      </div>
    </header>
  );
}
