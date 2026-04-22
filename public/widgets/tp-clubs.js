(function(){"use strict";const n="https://fascxnrrnsknjnojfxvv.supabase.co",s=typeof __SUPABASE_KEY__<"u"?__SUPABASE_KEY__:window.TWIRLPOWER_ANON_KEY??"";async function o(i,t={}){const a=new URLSearchParams(t).toString(),e=`${n}/rest/v1/${i}?${a}`,r=await fetch(e,{headers:{apikey:s,Authorization:`Bearer ${s}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error(`Supabase error: ${r.status}`);return r.json()}const l=`
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
`;class d extends HTMLElement{connectedCallback(){this.attachShadow({mode:"open"}),this._limit=parseInt(this.dataset.limit??"4",10),this._state=this.dataset.state??"",this._dir=this.dataset.directory??"https://directory.twirlpower.com",this._app=this.dataset.app??"https://app.twirlpower.com",this.shadowRoot.innerHTML=`
      <style>${l}</style>
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
    `,this.fetchClubs()}async fetchClubs(){const t=this.shadowRoot.getElementById("content");try{const a={select:"id,name,city,state,status",show_on_marketing_site:"eq.true",status:"eq.claimed",order:"name.asc",limit:String(this._limit)};this._state&&(a.state=`eq.${this._state}`);const e=await o("clubs",a);if(!e.length){t.innerHTML='<div class="empty">No clubs listed yet — check back soon!</div>';return}t.innerHTML=`
        <div class="grid">
          ${e.map(r=>this.renderCard(r)).join("")}
        </div>
      `}catch(a){t.innerHTML='<div class="empty">Unable to load clubs right now.</div>',console.error("TwirlPower clubs widget error:",a)}}renderCard(t){const a=t.name.split(" ").map(r=>r[0]).slice(0,2).join("").toUpperCase(),e=[t.city,t.state].filter(Boolean).join(", ");return`
      <a class="card" href="${this._dir}/clubs/${t.id}" target="_blank" rel="noopener" style="text-decoration:none;">
        <div class="club-initial">${a}</div>
        <span class="club-name">${t.name}</span>
        ${e?`<span class="club-location">📍 ${e}</span>`:""}
        <span class="club-badge">✓ On TwirlPower</span>
      </a>
    `}}customElements.define("tp-clubs",d),document.querySelectorAll('#tp-clubs, [data-tp-widget="clubs"]').forEach(i=>{const t=document.createElement("tp-clubs");Object.keys(i.dataset).forEach(a=>t.dataset[a]=i.dataset[a]),i.replaceWith(t)})})();
