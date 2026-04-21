'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';

const links = [
  { href: '/coaches',      label: 'Find a Coach' },
  { href: '/clubs',        label: 'Clubs' },
  { href: '/competitions', label: 'Competitions' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoTwirl}>Twirl</span>
          <span className={styles.logoPower}>Power</span>
          <span className={styles.logoSub}>Directory</span>
        </Link>
        <nav className={styles.nav}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.navLink} ${pathname.startsWith(l.href) ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a
          href={process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}
          className={styles.cta}
          target="_blank"
          rel="noopener"
        >
          Open App →
        </a>
      </div>
    </header>
  );
}
