(function(){"use strict";const s="https://fascxnrrnsknjnojfxvv.supabase.co",o=typeof __SUPABASE_KEY__<"u"?__SUPABASE_KEY__:window.TWIRLPOWER_ANON_KEY??"";async function n(a,t={}){const e=new URLSearchParams(t).toString(),i=`${s}/rest/v1/${a}?${e}`,r=await fetch(i,{headers:{apikey:o,Authorization:`Bearer ${o}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error(`Supabase error: ${r.status}`);return r.json()}const d={USTA:"#0d9488",NBTA:"#0f172a",TU:"#7c3aed",DMA:"#b45309"};function l(a){return new Date(a+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}const c=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :host {
    --teal:  #0d9488;
    --teal-dark: #0f766e;
    --pink:  #e11d6a;
    --navy:  #0f172a;
    --slate: #475569;
    --slate-light: #94a3b8;
    --border: #e2e8f0;
    --bg: #f8fafc;
    --card: #ffffff;
    --radius: 12px;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    display: block;
  }


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

  .btn-claim {
    display: block;
    margin-top: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--slate);
    text-decoration: none;
    text-align: center;
    transition: color .15s;
  }
  .btn-claim:hover { color: var(--teal); }

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
`,p=["USTA","NBTA","TU","DMA"],f=["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];class g extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._org="",this._state=""}connectedCallback(){this._org=this.dataset.org??"",this._state=this.dataset.state??"",this._limit=parseInt(this.dataset.limit??"6",10),this._dir=this.dataset.directory??"https://directory.twirlpower.com",this._appUrl=this.dataset.app??"https://app.twirlpower.com",this.render(),this.fetchAndDisplay()}render(){this.shadowRoot.innerHTML=`
      <style>${c}</style>
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
            ${p.map(t=>`<option value="${t}" ${this._org===t?"selected":""}>${t}</option>`).join("")}
          </select>
          <select class="filter-select" id="state-filter">
            <option value="">All States</option>
            ${f.map(t=>`<option value="${t}" ${this._state===t?"selected":""}>${t}</option>`).join("")}
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
    `,this.shadowRoot.getElementById("org-filter").addEventListener("change",t=>{this._org=t.target.value,this.fetchAndDisplay()}),this.shadowRoot.getElementById("state-filter").addEventListener("change",t=>{this._state=t.target.value,this.fetchAndDisplay()})}async fetchAndDisplay(){const t=this.shadowRoot.getElementById("list-container");t.innerHTML='<div class="loading"><div class="spinner"></div>Loading…</div>';try{const i={select:"id,name,date,city,state,org_id,host_id,registration_url",show_on_marketing_site:"eq.true",date:`gte.${new Date().toISOString().split("T")[0]}`,order:"date.asc",limit:String(this._limit)};this._org&&(i.org_id=`eq.${this._org}`),this._state&&(i.state=`eq.${this._state}`);const r=await n("public_competitions",i);if(!r.length){t.innerHTML='<div class="empty">No upcoming competitions found. Check back soon!</div>';return}t.innerHTML=`
        <div class="list">
          ${r.map(h=>this.renderCard(h)).join("")}
        </div>
      `}catch(e){t.innerHTML='<div class="empty">Unable to load competitions right now.</div>',console.error("TwirlPower widget error:",e)}}renderCard(t){const e=d[t.org_id]??"#475569",i=[t.city,t.state].filter(Boolean).join(", "),r=t.date?l(t.date):"Date TBD";return`
      <div class="card">
        <div class="card-stripe" style="background:${e}"></div>
        <div class="card-body">
          <div class="card-top">
            <span class="card-name">${t.name}</span>
            ${t.org_id?`<span class="org-badge" style="background:${e}">${t.org_id}</span>`:""}
          </div>
          <div class="card-meta">
            <span class="meta-item">📅 ${r}</span>
            ${i?`<span class="meta-item">📍 ${i}</span>`:""}
          </div>
        </div>
        <div class="card-action">
          <a class="btn-add" href="${this._appUrl}?comp=${t.id}" target="_blank" rel="noopener">
            Add to TwirlPower
          </a>
          ${t.host_id?"":`<a class="btn-claim" href="${this._appUrl}?claim=${t.id}" target="_blank" rel="noopener">Claim →</a>`}
        </div>
      </div>
    `}}customElements.define("tp-competitions",g),document.querySelectorAll('#tp-competitions, [data-tp-widget="competitions"]').forEach(a=>{const t=document.createElement("tp-competitions");Object.keys(a.dataset).forEach(e=>t.dataset[e]=a.dataset[e]),a.replaceWith(t)})})();
