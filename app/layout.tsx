// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rezerve Et - Online Rezervasyon Sistemi',
  description: 'Restoran, kafe, etkinlik ve hizmetler için hızlı ve kolay online rezervasyon yapın.',
  generator: 'Aydocs',
  keywords: ['rezervasyon', 'online rezervasyon', 'masa ayırt', 'rezerve et', 'restoran rezervasyon'],
  authors: [{ name: 'Aydocs', url: 'https://github.com/aydocs' }],
  creator: 'Aydocs',
};

export function generateViewport() {
  return 'width=device-width, initial-scale=1.0';
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content={generateViewport()} />
      </head>
      <body>{children}</body>
    </html>
  );
}
