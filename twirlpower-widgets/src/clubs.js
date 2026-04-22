/**
 * TwirlPower — Club Finder Teaser Widget
 *
 * Usage in WordPress / Elementor HTML block:
 *
 *   <div id="tp-clubs"
 *        data-limit="4"
 *        data-state=""
 *        data-directory="https://directory.twirlpower.com">
 *   </div>
 *   <script src="https://your-vercel-url.vercel.app/tp-clubs.js"></script>
 *
 * Attributes:
 *   data-limit       Number of clubs to show (default: 4)
 *   data-state       Pre-filter by state — optional
 *   data-directory   URL of directory site
 */

import { supabaseFetch, FONTS, BASE_STYLES } from './utils.js';

const STYLES = `
  ${FONTS}
  ${BASE_STYLES}

  .widget {
    font-family: 'DM Sans', sans-serif;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: var(--navy);
  }

  .see-all {
    font-size: 13px;
    font-weight: 600;
    color: var(--teal);
    text-decoration: none;
    transition: color .15s;
  }
  .see-all:hover { color: var(--teal-dark); }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: box-shadow .2s, transform .2s;
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--teal), #0f766e);
  }
  .card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,.1);
    transform: translateY(-2px);
  }

  .club-initial {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--teal), #0f766e);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    color: #fff;
  }

  .club-name {
    font-family: 'DM Serif Display', serif;
    font-size: 15px;
    color: var(--navy);
    line-height: 1.25;
  }

  .club-location {
    font-size: 12px;
    color: var(--slate);
  }

  .club-badge {
    display: inline-flex;
    font-size: 10px;
    font-weight: 700;
    color: var(--teal);
    background: #ccfbf1;
    padding: 2px 8px;
    border-radius: 99px;
    width: fit-content;
  }

  .cta-bar {
    background: linear-gradient(135deg, var(--navy) 0%, #1e293b 100%);
    border-radius: var(--radius);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .cta-text {
    color: #fff;
    font-size: 15px;
    font-weight: 500;
  }

  .cta-text span {
    color: var(--teal);
    font-weight: 600;
  }

  .cta-btn {
    background: var(--teal);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    padding: 10px 18px;
    border-radius: 8px;
    text-decoration: none;
    white-space: nowrap;
    transition: background .15s;
    flex-shrink: 0;
  }
  .cta-btn:hover { background: var(--teal-dark); color: #fff; }

  .loading {
    text-align: center;
    padding: 32px;
    color: var(--slate);
    font-size: 14px;
  }
  .spinner {
    width: 28px;
    height: 28px;
    border: 3px solid var(--border);
    border-top-color: var(--teal);
    border-radius: 50%;
    animation: spin .7s linear infinite;
    margin: 0 auto 12px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .empty {
    text-align: center;
    padding: 24px;
    color: var(--slate);
    font-size: 14px;
    background: var(--bg);
    border-radius: var(--radius);
    border: 1px dashed var(--border);
    margin-bottom: 16px;
  }
`;

class TpClubs extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this._limit = parseInt(this.dataset.limit ?? '4', 10);
    this._state = this.dataset.state ?? '';
    this._dir   = this.dataset.directory ?? 'https://directory.twirlpower.com';
    this._app   = this.dataset.app ?? 'https://app.twirlpower.com';

    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <div class="widget">
        <div class="header">
          <h2 class="title">Find Your Club</h2>
          <a class="see-all" href="${this._dir}/clubs" target="_blank" rel="noopener">
            Browse all clubs →
          </a>
        </div>
        <div id="content">
          <div class="loading"><div class="spinner"></div>Loading clubs…</div>
        </div>
        <div class="cta-bar">
          <span class="cta-text">
            Own a studio? <span>Claim it on TwirlPower</span> and appear in the directory.
          </span>
          <a class="cta-btn" href="${this._app}" target="_blank" rel="noopener">
            Claim Your Club →
          </a>
        </div>
      </div>
    `;

    this.fetchClubs();
  }

  async fetchClubs() {
    const content = this.shadowRoot.getElementById('content');

    try {
      const params = {
        select: 'id,name,city,state,status',
        show_on_marketing_site: 'eq.true',
        status: 'eq.claimed',
        order: 'name.asc',
        limit: String(this._limit),
      };
      if (this._state) params.state = `eq.${this._state}`;

      const clubs = await supabaseFetch('clubs', params);

      if (!clubs.length) {
        content.innerHTML = `<div class="empty">No clubs listed yet — check back soon!</div>`;
        return;
      }

      content.innerHTML = `
        <div class="grid">
          ${clubs.map(c => this.renderCard(c)).join('')}
        </div>
      `;
    } catch (err) {
      content.innerHTML = `<div class="empty">Unable to load clubs right now.</div>`;
      console.error('TwirlPower clubs widget error:', err);
    }
  }

  renderCard(c) {
    const initials = c.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const location = [c.city, c.state].filter(Boolean).join(', ');

    return `
      <a class="card" href="${this._dir}/clubs/${c.id}" target="_blank" rel="noopener" style="text-decoration:none;">
        <div class="club-initial">${initials}</div>
        <span class="club-name">${c.name}</span>
        ${location ? `<span class="club-location">📍 ${location}</span>` : ''}
        <span class="club-badge">✓ On TwirlPower</span>
      </a>
    `;
  }
}

customElements.define('tp-clubs', TpClubs);

// Auto-init
document.querySelectorAll('#tp-clubs, [data-tp-widget="clubs"]').forEach(el => {
  const wc = document.createElement('tp-clubs');
  Object.keys(el.dataset).forEach(k => wc.dataset[k] = el.dataset[k]);
  el.replaceWith(wc);
});
