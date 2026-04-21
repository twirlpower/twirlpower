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
