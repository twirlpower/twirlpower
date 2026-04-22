import type { Metadata } from 'next';
import { getCoaches } from '@/lib/supabase';
import CoachGrid from '@/components/CoachGrid';
import FilterBar from '@/components/FilterBar';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';

export const revalidate = 3600; // ISR — rebuild every hour

export const metadata: Metadata = {
  title: 'Find a Baton Twirling Coach',
  description: 'Search certified baton twirling coaches and studios by state and organization (USTA, NBTA, TU, DMA). All coaches have active TwirlPower accounts.',
};

const ORGS = ['USTA', 'NBTA', 'TU', 'DMA'];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

type SearchParams = { org?: string; state?: string; search?: string };

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { org, state, search } = await searchParams;

  const coaches = await getCoaches({ org, state, search, limit: 200 });

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

  return (
    <>
      <PageHero
        eyebrow="Coach & Studio Finder"
        title={<>Find a <span>Baton Twirling</span> Coach</>}
        subtitle="Every coach listed here has an active TwirlPower account and is coaching competitive twirlers."
      />

      <div className="container">
        <FilterBar
          filters={filterConfig}
          searchName="search"
          searchValue={search ?? ''}
          searchPlaceholder="Search by name or studio..."
        />

        {coaches.length > 0 ? (
          <>
            <p className={styles.resultCount}>
              {coaches.length} coach{coaches.length !== 1 ? 'es' : ''} found
            </p>
            <CoachGrid coaches={coaches} />
          </>
        ) : (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <h3>No coaches found</h3>
            <p>Try adjusting your filters, or <a href="/coaches">view all coaches</a>.</p>
          </div>
        )}

        <div className={styles.ctaBanner}>
          <h2>Are you a coach?</h2>
          <p>Create a free TwirlPower account to appear in this directory and manage your studio roster.</p>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}`}
            className="btn btn-primary"
            target="_blank"
            rel="noopener"
          >
            Create Coach Account →
          </a>
        </div>
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Baton Twirling Coaches Directory',
            description: 'Certified baton twirling coaches and studios searchable by state and organization.',
            url: 'https://directory.twirlpower.com/coaches',
            numberOfItems: coaches.length,
            itemListElement: coaches.slice(0, 20).map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Person',
                name: c.name,
                jobTitle: 'Baton Twirling Coach',
                ...(c.studio && { worksFor: { '@type': 'Organization', name: c.studio } }),
                ...(c.state && { address: { '@type': 'PostalAddress', addressRegion: c.state } }),
              },
            })),
          }),
        }}
      />
    </>
  );
}
