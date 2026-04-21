import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClubById, getCoaches, supabase } from '@/lib/supabase';
import styles from './page.module.css';

export const revalidate = 3600;

// Pre-generate claimed club pages at build time
export async function generateStaticParams() {
  const { data } = await supabase
    .from('clubs')
    .select('id')
    .eq('status', 'claimed')
    .eq('show_on_marketing_site', true);
  return (data ?? []).map(c => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const club = await getClubById(params.id);
  if (!club) return { title: 'Club Not Found' };
  const location = [club.city, club.state].filter(Boolean).join(', ');
  return {
    title: `${club.name}${location ? ` — ${location}` : ''}`,
    description: `${club.name} is a baton twirling club${location ? ` in ${location}` : ''}. Find coaches and join on TwirlPower.`,
    openGraph: {
      title: club.name,
      description: `Baton twirling club${location ? ` in ${location}` : ''}. Join on TwirlPower.`,
    },
  };
}

export default async function ClubProfilePage({ params }: { params: { id: string } }) {
  const club = await getClubById(params.id);
  if (!club || club.status === 'archived') notFound();

  // Fetch coaches linked to this club via club_coaches table
  const { data: clubCoaches } = await supabase
    .from('club_coaches')
    .select('coach_id, role, coach_accounts(id, name, studio, state, organizations, bio)')
    .eq('club_id', params.id)
    .eq('status', 'active');

  const coaches = (clubCoaches ?? [])
    .map((cc: any) => ({ ...cc.coach_accounts, role: cc.role }))
    .filter(Boolean);

  const location = [club.city, club.state].filter(Boolean).join(', ');
  const isClaimed = club.status === 'claimed';

  const ORG_COLORS: Record<string, string> = {
    USTA: '#0d9488', NBTA: '#0f172a', TU: '#7c3aed', DMA: '#b45309',
  };

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className="container">
          <a href="/clubs" className={styles.backLink}>← All Clubs</a>
          <div className={styles.heroInner}>
            <div className={styles.clubAvatar}>
              {club.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              {isClaimed
                ? <span className={styles.claimedBadge}>✓ Verified on TwirlPower</span>
                : <span className={styles.unclaimedBadge}>Unclaimed</span>
              }
              <h1 className={styles.clubName}>{club.name}</h1>
              {location && <p className={styles.location}>📍 {location}</p>}
              {club.website_url && (
                <a href={club.website_url} className={styles.website} target="_blank" rel="noopener">
                  🌐 {club.website_url.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.layout}>

          {/* MAIN COLUMN */}
          <div className={styles.main}>

            {/* COACHES */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {coaches.length > 0 ? `Coaches (${coaches.length})` : 'Coaches'}
              </h2>
              {coaches.length > 0 ? (
                <div className={styles.coachList}>
                  {coaches.map((coach: any) => (
                    <div key={coach.id} className={styles.coachCard}>
                      <div className={styles.coachAvatar}>
                        {coach.name.split(' ').map((n: string) => n[0]).slice(0,2).join('')}
                      </div>
                      <div className={styles.coachInfo}>
                        <div className={styles.coachNameRow}>
                          <span className={styles.coachName}>{coach.name}</span>
                          {coach.role === 'owner' && (
                            <span className={styles.ownerBadge}>Club Owner</span>
                          )}
                        </div>
                        {coach.studio && <p className={styles.coachStudio}>{coach.studio}</p>}
                        {coach.organizations?.length > 0 && (
                          <div className={styles.orgRow}>
                            {coach.organizations.map((org: string) => (
                              <span
                                key={org}
                                className={styles.orgBadge}
                                style={{ background: ORG_COLORS[org] ?? '#475569' }}
                              >
                                {org}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noCoaches}>No coaches listed yet.</p>
              )}
            </section>

          </div>

          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            {isClaimed ? (
              <div className={styles.sideCard}>
                <h3>Join this club</h3>
                <p>Create a TwirlPower account to connect your twirler with {club.name}.</p>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}`}
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: 10 }}
                  target="_blank"
                  rel="noopener"
                >
                  Join on TwirlPower →
                </a>
              </div>
            ) : (
              <div className={styles.sideCard}>
                <h3>Own this club?</h3>
                <p>Claim {club.name} on TwirlPower to manage members and coaches.</p>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}`}
                  className="btn btn-pink"
                  style={{ width: '100%' }}
                  target="_blank"
                  rel="noopener"
                >
                  Claim this club →
                </a>
              </div>
            )}

            <div className={styles.sideCard}>
              <h3>Track competitions</h3>
              <p>Log results, monitor classification, and see the path to advancement — free during beta.</p>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}`}
                className="btn btn-ghost"
                style={{ width: '100%' }}
                target="_blank"
                rel="noopener"
              >
                Open TwirlPower
              </a>
            </div>
          </aside>

        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsOrganization',
            name: club.name,
            sport: 'Baton Twirling',
            url: `https://directory.twirlpower.com/clubs/${club.id}`,
            ...(club.website_url && { sameAs: club.website_url }),
            ...(location && {
              address: {
                '@type': 'PostalAddress',
                ...(club.city  && { addressLocality: club.city }),
                ...(club.state && { addressRegion: club.state }),
              },
            }),
            ...(coaches.length > 0 && {
              member: coaches.map((c: any) => ({
                '@type': 'Person',
                name: c.name,
                jobTitle: c.role === 'owner' ? 'Club Owner' : 'Coach',
              })),
            }),
          }),
        }}
      />
    </>
  );
}
