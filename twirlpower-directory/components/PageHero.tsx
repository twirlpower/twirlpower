import styles from './PageHero.module.css';

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
};

export default function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className="container">
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  );
}
