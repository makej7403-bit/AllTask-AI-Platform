// app/layout.jsx
import './globals.css';
import Link from 'next/link';
import { CREATOR } from '@/utils/identity';

export const metadata = {
  title: 'FullTask Global AI Platform',
  description: 'FullTask — AI tutoring, global explorer, and more — by Akin S. Sokpah',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="ft-shell">
          <header className="ft-header">
            <div className="ft-brand">
              <Link href="/"><img src="/logo.png" alt="FullTask" className="ft-logo" /></Link>
              <div>
                <h1>FullTask Global AI</h1>
                <div className="ft-sub">AI Tutor · Global Tools · Gospel · Explorer</div>
              </div>
            </div>

            <nav className="ft-nav">
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/chat">AI Chat</Link>
              <Link href="/explorer">Explorer</Link>
              <Link href="/bible">Bible</Link>
              <Link href="/courses">Courses</Link>
            </nav>
          </header>

          <main className="ft-main">{children}</main>

          <footer className="ft-footer">
            <div>Creator: <strong>{CREATOR}</strong></div>
            <div>© {new Date().getFullYear()} FullTask Global AI — Built modular for extensibility.</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
