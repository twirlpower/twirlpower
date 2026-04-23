import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoTwirl}>Twirl</span>
          <span className={styles.logoPower}>Power</span>
          <p className={styles.tagline}>The home base for competitive baton twirling.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <span className={styles.colHead}>Directory</span>
            <a href="/coaches">Find a Coach</a>
            <a href="/clubs">Clubs</a>
            <a href="/competitions">Competitions</a>
          </div>
          <div className={styles.col}>
            <span className={styles.colHead}>Organizations</span>
            <a href="https://www.ustwirling.com" target="_blank" rel="noopener">USTA</a>
            <a href="https://www.nbta.us" target="_blank" rel="noopener">NBTA</a>
            <a href="https://www.twirl.org" target="_blank" rel="noopener">TU</a>
            <a href="https://www.dma.org" target="_blank" rel="noopener">DMA</a>
          </div>
          <div className={styles.col}>
            <span className={styles.colHead}>TwirlPower</span>
            <a href="https://twirlpower.com/for-families">For Families</a>
            <a href="https://twirlpower.com/for-coaches">For Coaches</a>
            <a href="https://twirlpower.com/for-directors">For Directors</a>
            <a href="https://app.twirlpower.com">Open the App</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} TwirlPower, a dba of OAKRAA, LLC (Colorado)</span>
      </div>
    </footer>
  );
}
