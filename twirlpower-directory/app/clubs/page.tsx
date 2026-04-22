import type { Metadata } from 'next';
import Link from 'next/link';
import { getClubs } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import FilterBar from '@/components/FilterBar';
import styles from './page.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Baton Twirling Clubs & Studios',
  description: 'Find baton twirling clubs and studios near you. Browse claimed clubs or claim your studio on TwirlPower.',
};

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

type SearchParams = { state?: string };

export default async function ClubsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { state } = await searchParams;
  const clubs = await getClubs({ state, includeUnclaimed: true, limit: 200 });

  const claimed   = clubs.filter(c => c.status === 'claimed');
  const unclaimed = clubs.filter(c => c.status !== 'claimed');

  const filterConfig = [
    {
      name: 'state',
      label: 'State',
      options: US_STATES.map(s => ({ value: s, label: s })),
      value: state ?? '',
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Club & Studio Directory"
        title={<>Baton Twirling <span>Clubs</span></>}
        subtitle="Browse clubs and studios across the country. Claimed clubs are verified by their owners on TwirlPower."
      />

      <div className="container">
        <FilterBar filters={filterConfig} />

        {/* CLAIMED CLUBS */}
        {claimed.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Clubs on TwirlPower
                <span className={styles.count}>{claimed.length}</span>
              </h2>
            </div>
            <div className={styles.grid}>
              {claimed.map(club => (
                <Link key={club.id} href={`/clubs/${club.id}`} className={styles.card}>
                  <div className={styles.cardAccent} />
                  <div className={styles.cardBody}>
                    <div className={styles.claimedBadge}>✓ Claimed</div>
                    <h3 className={styles.clubName}>{club.name}</h3>
                    {(club.city || club.state) && (
                      <p className={styles.location}>
                        📍 {[club.city, club.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.viewLink}>View club profile →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* UNCLAIMED CLUBS */}
        {unclaimed.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Unclaimed Clubs
                <span className={styles.count}>{unclaimed.length}</span>
              </h2>
              <p className={styles.sectionSub}>
                Is your club listed here? Claim it on TwirlPower to add your coaches, manage members, and appear in the directory.
              </p>
            </div>
            <div className={styles.grid}>
              {unclaimed.map(club => (
                <div key={club.id} className={`${styles.card} ${styles.cardUnclaimed}`}>
                  <div className={styles.cardBody}>
                    <div className={styles.unclaimedBadge}>Unclaimed</div>
                    <h3 className={styles.clubName}>{club.name}</h3>
                    {(club.city || club.state) && (
                      <p className={styles.location}>
                        📍 {[club.city, club.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className={styles.cardFooter}>
                    <a
                      href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}`}
                      className={styles.claimBtn}
                      target="_blank"
                      rel="noopener"
                    >
                      Claim this club →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {clubs.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
            <h3>No clubs found</h3>
            <p>Try adjusting your filters or <a href="/clubs">view all clubs</a>.</p>
          </div>
        )}

        {/* CTA */}
        <div className={styles.ctaBanner}>
          <h2>Own a studio or club?</h2>
          <p>Create a TwirlPower coach account to claim your club, manage your roster, and appear in this directory.</p>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}`}
            className="btn btn-primary"
            target="_blank"
            rel="noopener"
          >
            Claim Your Club →
          </a>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Baton Twirling Clubs Directory',
            url: 'https://directory.twirlpower.com/clubs',
            numberOfItems: claimed.length,
            itemListElement: claimed.slice(0, 20).map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'SportsOrganization',
                name: c.name,
                sport: 'Baton Twirling',
                ...(c.state && { address: { '@type': 'PostalAddress', addressRegion: c.state, ...(c.city && { addressLocality: c.city }) } }),
                url: `https://directory.twirlpower.com/clubs/${c.id}`,
              },
            })),
          }),
        }}
      />
    </>
  );
}
