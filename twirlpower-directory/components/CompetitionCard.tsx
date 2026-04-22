import type { Competition } from '@/lib/supabase';
import styles from './CompetitionCard.module.css';

const ORG_COLORS: Record<string, string> = {
  USTA: '#0d9488',
  NBTA: '#0f172a',
  TU:   '#7c3aed',
  DMA:  '#b45309',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00'); // avoid UTC shift
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDeadline(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type Props = { competition: Competition; isPast?: boolean };

export default function CompetitionCard({ competition: c, isPast = false }: Props) {
  const orgColor = ORG_COLORS[c.org_id ?? ''] ?? '#475569';
  const location = [c.city, c.state].filter(Boolean).join(', ');
  const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.twirlpower.com';

  return (
    <article className={`${styles.card} ${isPast ? styles.past : ''}`}>
      <div className={styles.accent} style={{ background: orgColor }} />

      <div className={styles.header}>
        <h3 className={styles.name}>{c.name}</h3>
        {c.org_id && (
          <span className={styles.orgBadge} style={{ background: orgColor }}>
            {c.org_id}
          </span>
        )}
      </div>

      <div className={styles.meta}>
        {c.date && (
          <div className={styles.metaRow}>
            <span className={styles.icon}>📅</span>
            <time dateTime={c.date}>{formatDate(c.date)}</time>
          </div>
        )}
        {location && (
          <div className={styles.metaRow}>
            <span className={styles.icon}>📍</span>
            <span>{location}</span>
          </div>
        )}
        {c.venue && (
          <div className={styles.metaRow}>
            <span className={styles.icon}>🏛️</span>
            <span>{c.venue}</span>
          </div>
        )}
        {c.registration_deadline && !isPast && (
          <div className={styles.metaRow}>
            <span className={styles.icon}>⏰</span>
            <span>Registration closes {formatDeadline(c.registration_deadline)}</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <a
          href={appUrl}
          className={styles.btnApp}
          target="_blank"
          rel="noopener"
        >
          {isPast ? 'Log Results' : 'Add to TwirlPower'}
        </a>
        {c.registration_url && !isPast && (
          <a
            href={c.registration_url}
            className={styles.btnReg}
            target="_blank"
            rel="noopener"
          >
            Register
          </a>
        )}
        {isPast && <span className={styles.pastTag}>Past</span>}
      </div>
    </article>
  );
}
