import type { Coach } from '@/lib/supabase';
import styles from './CoachGrid.module.css';

const ORG_COLORS: Record<string, string> = {
  USTA: '#0d9488',
  NBTA: '#0f172a',
  TU: '#7c3aed',
  DMA: '#b45309',
};

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function CoachGrid({ coaches }: { coaches: Coach[] }) {
  return (
    <div className={styles.grid}>
      {coaches.map(coach => (
        <article key={coach.id} className={styles.card}>
          <div className={styles.avatar}>
            {initials(coach.name)}
          </div>
          <div className={styles.body}>
            <h3 className={styles.name}>{coach.name}</h3>
            {coach.studio && (
              <p className={styles.studio}>{coach.studio}</p>
            )}
            <div className={styles.meta}>
              {coach.state && (
                <span className={styles.metaChip}>📍 {coach.state}</span>
              )}
            </div>
            {coach.organizations && coach.organizations.length > 0 && (
              <div className={styles.orgs}>
                {coach.organizations.map(org => (
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
            {coach.bio && (
              <p className={styles.bio}>{coach.bio.slice(0, 120)}{coach.bio.length > 120 ? '…' : ''}</p>
            )}
          </div>
          <div className={styles.footer}>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com'}`}
              className={styles.ctaBtn}
              target="_blank"
              rel="noopener"
            >
              Connect on TwirlPower →
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
