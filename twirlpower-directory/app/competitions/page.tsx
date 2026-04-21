import type { Metadata } from 'next';
import { getCompetitions } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import FilterBar from '@/components/FilterBar';
import CompetitionCard from '@/components/CompetitionCard';
import styles from './page.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Baton Twirling Competitions',
  description: 'Find upcoming baton twirling competitions across USTA, NBTA, TU, and DMA. Filter by state, organization, and date.',
};

const ORGS = ['USTA', 'NBTA', 'TU', 'DMA'];
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

type SearchParams = { org?: string; state?: string; past?: string };

export default async function CompetitionsPage({ searchParams }: { searchParams: SearchParams }) {
  const { org, state } = searchParams;
  const showPast = searchParams.past === '1';

  const [upcoming, past] = await Promise.all([
    showPast ? Promise.resolve([]) : getCompetitions({ org, state, past: false, limit: 200 }),
    showPast ? getCompetitions({ org, state, past: true, limit: 100 }) : Promise.resolve([]),
  ]);

  const competitions = showPast ? past : upcoming;

  const filterConfig = [
    {
      name: 'org',
      label: 'Organization',
      options: ORGS.map(o => ({ value: o, label: o })),
      value: org ?? '',
    },
    {
      name: 'state',
      label: 'State',
      options: US_STATES.map(s => ({ value: s, label: s })),
      value: state ?? '',
    },
  ];

  const pastToggleHref = showPast
    ? `/competitions?org=${org ?? ''}&state=${state ?? ''}`
    : `/competitions?org=${org ?? ''}&state=${state ?? ''}&past=1`;

  return (
    <>
      <PageHero
        eyebrow="Competition Calendar"
        title={<>Baton Twirling <span>Competitions</span></>}
        subtitle="Find upcoming competitions across all major organizations. Track your results in TwirlPower."
      />

      <div className="container">
        <div className={styles.filterRow}>
          <FilterBar
            filters={filterConfig}
            extraParams={showPast ? { past: '1' } : {}}
          />
          <a href={pastToggleHref} className={`${styles.pastToggle} ${showPast ? styles.pastActive : ''}`}>
            {showPast ? '← Upcoming' : 'Past Competitions →'}
          </a>
        </div>

        {competitions.length > 0 ? (
          <>
            <p className={styles.resultCount}>
              <span className={styles.resultLabel}>
                {showPast ? 'Past competitions' : 'Upcoming competitions'}
              </span>
              <span className={styles.resultNum}>{competitions.length}</span>
            </p>
            <div className={styles.grid}>
              {competitions.map(comp => (
                <CompetitionCard key={comp.id} competition={comp} isPast={showPast} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
            <h3>No competitions found</h3>
            <p>
              {(org || state)
                ? <><a href="/competitions">Clear filters</a> to see all competitions.</>
                : 'Check back soon — competitions are added regularly.'
              }
            </p>
          </div>
        )}

        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h2>Track every competition result</h2>
            <p>Log placements, scores, and scorecards. Monitor classification progress across USTA, NBTA, TU, and DMA — free during beta.</p>
          </div>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}`}
            className="btn btn-primary"
            target="_blank"
            rel="noopener"
          >
            Open TwirlPower Free →
          </a>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Baton Twirling Competitions',
            url: 'https://directory.twirlpower.com/competitions',
            itemListElement: upcoming.slice(0, 20).map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Event',
                name: c.name,
                startDate: c.competition_date,
                location: {
                  '@type': 'Place',
                  name: [c.venue, c.city, c.state].filter(Boolean).join(', '),
                },
                organizer: { '@type': 'Organization', name: c.org ?? 'TwirlPower' },
                url: `https://app.twirlpower.com`,
              },
            })),
          }),
        }}
      />
    </>
  );
}
