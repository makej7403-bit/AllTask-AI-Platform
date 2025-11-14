import './globals.css';
import Link from 'next/link';
import { CREATOR } from '@/utils/identity';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 1100, margin: '20px auto', padding: 16 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>FullTask Global AI</h1>
              <div style={{ fontSize: 13, color: '#666' }}>{CREATOR}</div>
            </div>
            <nav>
              <Link href="/">Home</Link> | <Link href="/dashboard">Dashboard</Link> | <Link href="/chat">Chat</Link> | <Link href="/login">Login</Link>
            </nav>
          </header>
          <main style={{ marginTop: 18 }}>{children}</main>
          <footer style={{ marginTop: 24, color: '#666' }}>© {new Date().getFullYear()} FullTask</footer>
        </div>
      </body>
    </html>
  );
}
