import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/Provider';
import { poppins } from '&/fonts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Flowsups',
    default: 'Flowsups',
  },
  description: 'Flowsups home page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="overflow-x-hidden" lang="es">
      <Providers>
        <body className={`${poppins.className} antialiased`}>{children}</body>
      </Providers>
    </html>
  );
}
