import './globals.css';
import Header from '@/app/components/Header';

export const metadata = {
  title: 'FullTask Global AI Platform',
  description: 'FullTask: 3000+ AI features — created by Akin S. Sokpah'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ maxWidth: 1100, margin: '18px auto', padding: '0 16px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
