/**
 * TwirlPower — Stats Bar Widget
 *
 * Usage in WordPress / Elementor HTML block:
 *
 *   <div id="tp-stats"></div>
 *   <script src="https://your-vercel-url.vercel.app/tp-stats.js"></script>
 *
 * Optional data attributes:
 *   data-theme="dark"   Use navy background (default: light)
 *   data-theme="light"  White background
 */

import { supabaseCount, FONTS, BASE_STYLES } from './utils.js';

const STYLES = `
  ${FONTS}
  ${BASE_STYLES}

  .bar {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0;
    padding: 28px 24px;
    border-radius: var(--radius);
  }

  .bar.dark {
    background: var(--navy);
  }

  .bar.light {
    background: var(--card);
    border: 1px solid var(--border);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 40px;
    text-align: center;
  }

  .num {
    font-family: 'DM Serif Display', serif;
    font-size: 38px;
    line-height: 1;
    color: var(--teal);
    transition: opacity .3s;
  }

  .label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-top: 6px;
  }

  .bar.dark .label { color: var(--slate-light); }
  .bar.light .label { color: var(--slate); }

  .divider {
    width: 1px;
    height: 44px;
    flex-shrink: 0;
  }

  .bar.dark .divider { background: rgba(255,255,255,.1); }
  .bar.light .divider { background: var(--border); }

  .loading .num {
    opacity: .3;
  }

  @keyframes pulse {
    0%, 100% { opacity: .3; }
    50% { opacity: .6; }
  }

  .loading .num {
    animation: pulse 1.2s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    .stat { padding: 0 20px; }
    .num { font-size: 28px; }
    .divider { height: 32px; }
  }
`;

function animateCount(el, target, duration = 1200) {
  const start = performance.now();
  const from  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(from + (target - from) * eased);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

class TpStats extends HTMLElement {
  connectedCallback() {
    const theme = this.dataset.theme ?? 'dark';
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <div class="bar ${theme} loading">
        <div class="stat">
          <span class="num" id="families">—</span>
          <span class="label">Families</span>
        </div>
        <div class="divider"></div>
        <div class="stat">
          <span class="num" id="twirlers">—</span>
          <span class="label">Twirlers</span>
        </div>
        <div class="divider"></div>
        <div class="stat">
          <span class="num" id="competitions">—</span>
          <span class="label">Competitions Listed</span>
        </div>
      </div>
    `;

    this.fetchStats();
  }

  async fetchStats() {
    try {
      const [families, twirlers, competitions] = await Promise.all([
        supabaseCount('family_accounts'),
        supabaseCount('twirlers'),
        supabaseCount('public_competitions', { show_on_marketing_site: 'eq.true' }),
      ]);

      const bar = this.shadowRoot.querySelector('.bar');
      bar.classList.remove('loading');

      animateCount(this.shadowRoot.getElementById('families'),     families,     1000);
      animateCount(this.shadowRoot.getElementById('twirlers'),     twirlers,     1200);
      animateCount(this.shadowRoot.getElementById('competitions'), competitions, 800);

    } catch (err) {
      // Fail silently — show dashes
      console.error('TwirlPower stats widget error:', err);
    }
  }
}

customElements.define('tp-stats', TpStats);

// Auto-init
document.querySelectorAll('#tp-stats, [data-tp-widget="stats"]').forEach(el => {
  const wc = document.createElement('tp-stats');
  Object.keys(el.dataset).forEach(k => wc.dataset[k] = el.dataset[k]);
  el.replaceWith(wc);
});
