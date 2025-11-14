import dynamic from 'next/dynamic';
const GoogleSignIn = dynamic(()=>import('@/app/components/GoogleSignIn'), { ssr: false });

export default function LoginPage() {
  return (
    <div style={{ maxWidth:540, margin:'40px auto' }}>
      <h2>Sign in</h2>
      <GoogleSignIn />
    </div>
  );
}
