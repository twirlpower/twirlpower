/**
 * TwirlPower — Upcoming Competitions Widget
 *
 * Usage in WordPress / Elementor HTML block:
 *
 *   <div id="tp-competitions"
 *        data-org=""
 *        data-state=""
 *        data-limit="6"
 *        data-directory="https://directory.twirlpower.com">
 *   </div>
 *   <script src="https://your-vercel-url.vercel.app/tp-competitions.js"></script>
 *
 * Attributes:
 *   data-org       Filter by org (USTA | NBTA | TU | DMA) — optional
 *   data-state     Filter by state (CO | TX | etc) — optional
 *   data-limit     Number of competitions to show (default: 6)
 *   data-directory URL of your directory site for "See all" link
 */

import { supabaseFetch, ORG_COLORS, formatDate, FONTS, BASE_STYLES } from './utils.js';

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
    line-height: 1.2;
  }

  .see-all {
    font-size: 13px;
    font-weight: 600;
    color: var(--teal);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: color .15s;
  }
  .see-all:hover { color: var(--teal-dark); }

  .filters {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .filter-select {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--navy);
    background: #fff;
    cursor: pointer;
    outline: none;
  }
  .filter-select:focus { border-color: var(--teal); }

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    display: flex;
    align-items: stretch;
    transition: box-shadow .2s, transform .2s;
  }
  .card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,.1);
    transform: translateY(-1px);
  }

  .card-stripe {
    width: 4px;
    flex-shrink: 0;
  }

  .card-body {
    padding: 14px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .card-name {
    font-family: 'DM Serif Display', serif;
    font-size: 16px;
    color: var(--navy);
    line-height: 1.25;
  }

  .org-badge {
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    padding: 2px 8px;
    border-radius: 99px;
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: .04em;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .meta-item {
    font-size: 12px;
    color: var(--slate);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .card-action {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .btn-add {
    background: var(--teal);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 7px 12px;
    border-radius: 7px;
    text-decoration: none;
    white-space: nowrap;
    transition: background .15s;
  }
  .btn-add:hover { background: var(--teal-dark); color: #fff; }

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
    padding: 32px;
    color: var(--slate);
    font-size: 14px;
    background: var(--bg);
    border-radius: var(--radius);
    border: 1px dashed var(--border);
  }

  .footer-cta {
    margin-top: 16px;
    text-align: center;
  }

  .footer-cta a {
    display: inline-block;
    background: var(--navy);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    transition: background .15s;
  }
  .footer-cta a:hover { background: #1e293b; color: #fff; }

  @media (max-width: 480px) {
    .card-action { display: none; }
    .card-name { font-size: 15px; }
  }
`;

const ORGS  = ['USTA', 'NBTA', 'TU', 'DMA'];
const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
                'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
                'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
                'VA','WA','WV','WI','WY'];

class TpCompetitions extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._org   = '';
    this._state = '';
  }

  connectedCallback() {
    this._org      = this.dataset.org   ?? '';
    this._state    = this.dataset.state ?? '';
    this._limit    = parseInt(this.dataset.limit ?? '6', 10);
    this._dir      = this.dataset.directory ?? 'https://directory.twirlpower.com';
    this._appUrl   = this.dataset.app ?? 'https://app.twirlpower.com';
    this.render();
    this.fetchAndDisplay();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${STYLES}</style>
      <div class="widget">
        <div class="header">
          <h2 class="title">Upcoming Competitions</h2>
          <a class="see-all" href="${this._dir}/competitions" target="_blank" rel="noopener">
            See all →
          </a>
        </div>
        <div class="filters">
          <select class="filter-select" id="org-filter">
            <option value="">All Orgs</option>
            ${ORGS.map(o => `<option value="${o}" ${this._org === o ? 'selected' : ''}>${o}</option>`).join('')}
          </select>
          <select class="filter-select" id="state-filter">
            <option value="">All States</option>
            ${STATES.map(s => `<option value="${s}" ${this._state === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div id="list-container">
          <div class="loading">
            <div class="spinner"></div>
            Loading competitions…
          </div>
        </div>
        <div class="footer-cta">
          <a href="${this._appUrl}" target="_blank" rel="noopener">
            Track your results in TwirlPower →
          </a>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('org-filter').addEventListener('change', e => {
      this._org = e.target.value;
      this.fetchAndDisplay();
    });
    this.shadowRoot.getElementById('state-filter').addEventListener('change', e => {
      this._state = e.target.value;
      this.fetchAndDisplay();
    });
  }

  async fetchAndDisplay() {
    const container = this.shadowRoot.getElementById('list-container');
    container.innerHTML = `<div class="loading"><div class="spinner"></div>Loading…</div>`;

    try {
      const today  = new Date().toISOString().split('T')[0];
      const params = {
        select: 'id,name,competition_date,city,state,org,registration_url',
        show_on_marketing_site: 'eq.true',
        'date': `gte.${today}`,
        order: 'competition_date.asc',
        limit: String(this._limit),
      };
      if (this._org)   params.org   = `eq.${this._org}`;
      if (this._state) params.state = `eq.${this._state}`;

      const data = await supabaseFetch('public_competitions', params);

      if (!data.length) {
        container.innerHTML = `<div class="empty">No upcoming competitions found. Check back soon!</div>`;
        return;
      }

      container.innerHTML = `
        <div class="list">
          ${data.map(c => this.renderCard(c)).join('')}
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="empty">Unable to load competitions right now.</div>`;
      console.error('TwirlPower widget error:', err);
    }
  }

  renderCard(c) {
    const color    = ORG_COLORS[c.org] ?? '#475569';
    const location = [c.city, c.state].filter(Boolean).join(', ');
    const date     = c.competition_date ? formatDate(c.competition_date) : 'Date TBD';

    return `
      <div class="card">
        <div class="card-stripe" style="background:${color}"></div>
        <div class="card-body">
          <div class="card-top">
            <span class="card-name">${c.name}</span>
            ${c.org ? `<span class="org-badge" style="background:${color}">${c.org}</span>` : ''}
          </div>
          <div class="card-meta">
            <span class="meta-item">📅 ${date}</span>
            ${location ? `<span class="meta-item">📍 ${location}</span>` : ''}
          </div>
        </div>
        <div class="card-action">
          <a class="btn-add" href="${this._appUrl}" target="_blank" rel="noopener">
            Add to TwirlPower
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('tp-competitions', TpCompetitions);

// Auto-init any <div id="tp-competitions"> on the page
document.querySelectorAll('#tp-competitions, [data-tp-widget="competitions"]').forEach(el => {
  const wc = document.createElement('tp-competitions');
  // Copy data attributes
  Object.keys(el.dataset).forEach(k => wc.dataset[k] = el.dataset[k]);
  el.replaceWith(wc);
});
