import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CodeMint AI — AI-Powered Code Review & Security Audits',
  description:
    'Instant AI code review, bug detection, security audits, and optimization suggestions. Pay securely with Locus Checkout.',
  keywords: 'AI code review, bug detection, security audit, code optimization, Locus Checkout',
  openGraph: {
    title: 'CodeMint AI',
    description: 'AI-powered code review in seconds. Powered by Locus Checkout.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main className="page-container">{children}</main>
      </body>
    </html>
  );
}
