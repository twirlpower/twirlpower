import type { Metadata } from 'next';
import Link from 'next/link';
import { getStats } from '@/lib/supabase';
import styles from './page.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'TwirlPower Directory — Coaches, Clubs & Competitions',
  description: 'Find baton twirling coaches, clubs, and upcoming competitions across USTA, NBTA, TU, and DMA organizations.',
};

export default async function HomePage() {
  const stats = await getStats();

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className="container">
          <span className={styles.eyebrow}>The Baton Twirling Directory</span>
          <h1 className={styles.heroTitle}>
            Find Coaches, Clubs<br />
            <span>&amp; Competitions</span>
          </h1>
          <p className={styles.heroSub}>
            The most complete directory for competitive baton twirling — coaches, studios,
            clubs, and upcoming competitions across USTA, NBTA, TU, and DMA.
          </p>
          <div className={styles.heroActions}>
            <Link href="/coaches" className="btn btn-primary">Find a Coach →</Link>
            <Link href="/competitions" className="btn btn-ghost" style={{color:'#fff', borderColor:'rgba(255,255,255,.2)'}}>
              Upcoming Competitions
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className={styles.statsBar}>
        <div className={`container ${styles.statsInner}`}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{stats.families.toLocaleString()}</span>
            <span className={styles.statLabel}>Families</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>{stats.twirlers.toLocaleString()}</span>
            <span className={styles.statLabel}>Twirlers</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>{stats.competitions.toLocaleString()}</span>
            <span className={styles.statLabel}>Competitions Listed</span>
          </div>
        </div>
      </div>

      {/* DIRECTORY SECTIONS */}
      <div className="container">
        <div className={styles.sections}>

          <Link href="/coaches" className={styles.sectionCard}>
            <span className={styles.sectionIcon}>🎯</span>
            <h2>Coach &amp; Studio Finder</h2>
            <p>Search coaches and studios by state and organization. Every listing has an active TwirlPower account.</p>
            <span className={styles.sectionLink}>Browse coaches →</span>
          </Link>

          <Link href="/clubs" className={styles.sectionCard}>
            <span className={styles.sectionIcon}>🏛️</span>
            <h2>Club Directory</h2>
            <p>Find claimed clubs and studios near you. Unclaimed clubs can be found and claimed by their owners.</p>
            <span className={styles.sectionLink}>Browse clubs →</span>
          </Link>

          <Link href="/competitions" className={styles.sectionCard}>
            <span className={styles.sectionIcon}>🏆</span>
            <h2>Upcoming Competitions</h2>
            <p>Competitions posted by verified directors, filterable by org, state, and date. Past competitions archived.</p>
            <span className={styles.sectionLink}>View competitions →</span>
          </Link>

        </div>

        {/* ORG COVERAGE */}
        <div className={styles.orgSection}>
          <p className="section-eyebrow" style={{textAlign:'center'}}>Organization Coverage</p>
          <h2 className={styles.orgTitle}>Tracks Across All Major Orgs</h2>
          <div className={styles.orgGrid}>
            {[
              { org: 'USTA', name: 'United States Twirling Association', color: '#0d9488' },
              { org: 'NBTA', name: 'National Baton Twirling Association', color: '#0f172a' },
              { org: 'TU',   name: 'Twirl USA',                          color: '#7c3aed' },
              { org: 'DMA',  name: 'Dance Masters of America',           color: '#b45309' },
            ].map(o => (
              <div key={o.org} className={styles.orgCard}>
                <span className={styles.orgBadgeLg} style={{ background: o.color }}>{o.org}</span>
                <span className={styles.orgName}>{o.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* APP CTA */}
        <div className={styles.appCta}>
          <div>
            <h2>Track your twirler in TwirlPower</h2>
            <p>Log competition results, track classification levels, and see the path to advancement — free during beta.</p>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}
            className="btn btn-primary"
            target="_blank"
            rel="noopener"
          >
            Open TwirlPower Free →
          </a>
        </div>

      </div>
    </>
  );
}
