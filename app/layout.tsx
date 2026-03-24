import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Family Calendar',
  description: 'Calendario condiviso semplice per 4 persone'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
