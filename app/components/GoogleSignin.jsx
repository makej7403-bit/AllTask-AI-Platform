'use client';
import { useState } from 'react';
import { signInWithGooglePopup } from '@/utils/firebaseClient';

export default function GoogleSignIn({ onSignedIn }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function handleSignIn() {
    setLoading(true);
    setErr(null);
    try {
      const { idToken } = await signInWithGooglePopup();
      const res = await fetch('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Auth failed');
      if (onSignedIn) onSignedIn(json);
      window.location.href = '/dashboard';
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleSignIn} disabled={loading} className="btn">
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}
    </div>
  );
}
