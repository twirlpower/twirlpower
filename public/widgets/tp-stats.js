(function(){"use strict";const p="https://fascxnrrnsknjnojfxvv.supabase.co",c=typeof __SUPABASE_KEY__<"u"?__SUPABASE_KEY__:window.TWIRLPOWER_ANON_KEY??"";async function r(a,t={}){const e=new URLSearchParams(t).toString(),i=`${p}/rest/v1/${a}?${e}`,s=await fetch(i,{headers:{apikey:c,Authorization:`Bearer ${c}`,"Content-Type":"application/json",Prefer:"count=exact",Range:"0-0"}});if(!s.ok)throw new Error(`Supabase count error: ${s.status}`);const n=(s.headers.get("content-range")??"").split("/")[1];return n==="*"?0:parseInt(n,10)||0}const f=`
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
`;function o(a,t,e=1200){const i=performance.now(),s=0;function l(n){const h=n-i,d=Math.min(h/e,1),u=1-Math.pow(1-d,3),g=Math.round(s+(t-s)*u);a.textContent=g.toLocaleString(),d<1&&requestAnimationFrame(l)}requestAnimationFrame(l)}class m extends HTMLElement{connectedCallback(){const t=this.dataset.theme??"dark";this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`
      <style>${f}</style>
      <div class="bar ${t} loading">
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
    `,this.fetchStats()}async fetchStats(){try{const[t,e,i]=await Promise.all([r("family_accounts"),r("twirlers"),r("public_competitions",{show_on_marketing_site:"eq.true"})]);this.shadowRoot.querySelector(".bar").classList.remove("loading"),o(this.shadowRoot.getElementById("families"),t,1e3),o(this.shadowRoot.getElementById("twirlers"),e,1200),o(this.shadowRoot.getElementById("competitions"),i,800)}catch(t){console.error("TwirlPower stats widget error:",t)}}}customElements.define("tp-stats",m),document.querySelectorAll('#tp-stats, [data-tp-widget="stats"]').forEach(a=>{const t=document.createElement("tp-stats");Object.keys(a.dataset).forEach(e=>t.dataset[e]=a.dataset[e]),a.replaceWith(t)})})();
