import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h2>Welcome to FullTask Global AI</h2>
      <p>3000+ AI features — multi-model engine (OpenAI, Gemini, Claude, Mistral, DeepSeek, Llama).</p>
      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        <Link href="/chat"><button className="btn">Open Chat</button></Link>
        <Link href="/explorer"><button className="btn">Go to Explorer</button></Link>
        <Link href="/dashboard"><button className="btn">Admin</button></Link>
      </div>
    </div>
  );
}
