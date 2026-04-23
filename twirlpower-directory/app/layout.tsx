import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'TwirlPower Directory',
    template: '%s | TwirlPower Directory',
  },
  description: 'Find baton twirling coaches, clubs, and competitions across USTA, NBTA, TU, and DMA.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://directory.twirlpower.com'),
  openGraph: {
    siteName: 'TwirlPower',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
