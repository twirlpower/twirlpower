# TwirlPower Widgets — Setup & Deployment

## Overview
Three standalone JS widgets that embed live Supabase data into any WordPress / Elementor page.
Each widget uses Shadow DOM so your WordPress theme CSS never interferes.

---

## Local build

```bash
cd twirlpower-widgets
npm install
npm run build
```

Output files in `/dist`:
- `tp-competitions.js`
- `tp-stats.js`
- `tp-clubs.js`

---

## Deploy to Vercel (host the widget files)

These widget JS files need to be hosted somewhere accessible via URL.
The easiest approach: add them to your existing `app.twirlpower.com` Vercel project
under a `/widgets` folder, or create a separate `widgets.twirlpower.com` project.

### Option A — Add to existing app.twirlpower.com repo
1. Copy the `dist/` files into your React app's `public/widgets/` folder
2. They'll be served at `https://app.twirlpower.com/widgets/tp-competitions.js` etc.
3. Push to GitHub → Vercel auto-deploys

### Option B — Separate Vercel static project
1. Create a new GitHub repo with just the `dist/` folder
2. Add a `vercel.json`:
   ```json
   { "headers": [{ "source": "/(.*)", "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }] }] }
   ```
3. Connect to Vercel → deploys to `widgets.twirlpower.com`

**Important:** Add CORS header so WordPress can load the scripts cross-origin.

---

## Before embedding — set your Supabase anon key

In your WordPress site, add this to your theme's `functions.php` or in an Elementor
custom code block **before** any widget script tags:

```html
<script>
  window.TWIRLPOWER_ANON_KEY = 'your-supabase-anon-key-here';
</script>
```

Or use the WPCode plugin to inject it site-wide in the `<head>`.

---

## WordPress / Elementor embed codes

### 1. Stats Bar Widget

**Light theme (white background):**
```html
<div id="tp-stats" data-theme="light"></div>
<script src="https://app.twirlpower.com/widgets/tp-stats.js"></script>
```

**Dark theme (navy background — great for hero sections):**
```html
<div id="tp-stats" data-theme="dark"></div>
<script src="https://app.twirlpower.com/widgets/tp-stats.js"></script>
```

---

### 2. Upcoming Competitions Widget

**Basic (all orgs, all states):**
```html
<div id="tp-competitions"
     data-limit="6"
     data-directory="https://directory.twirlpower.com"
     data-app="https://app.twirlpower.com">
</div>
<script src="https://app.twirlpower.com/widgets/tp-competitions.js"></script>
```

**Pre-filtered to USTA only:**
```html
<div id="tp-competitions"
     data-org="USTA"
     data-limit="5"
     data-directory="https://directory.twirlpower.com">
</div>
<script src="https://app.twirlpower.com/widgets/tp-competitions.js"></script>
```

**Pre-filtered to Colorado:**
```html
<div id="tp-competitions"
     data-state="CO"
     data-limit="6"
     data-directory="https://directory.twirlpower.com">
</div>
<script src="https://app.twirlpower.com/widgets/tp-competitions.js"></script>
```

---

### 3. Club Finder Teaser Widget

**Basic (shows 4 most recent claimed clubs):**
```html
<div id="tp-clubs"
     data-limit="4"
     data-directory="https://directory.twirlpower.com"
     data-app="https://app.twirlpower.com">
</div>
<script src="https://app.twirlpower.com/widgets/tp-clubs.js"></script>
```

**Pre-filtered to a state:**
```html
<div id="tp-clubs"
     data-state="CO"
     data-limit="4"
     data-directory="https://directory.twirlpower.com">
</div>
<script src="https://app.twirlpower.com/widgets/tp-clubs.js"></script>
```

---

## Using in Elementor

1. In Elementor editor, drag an **HTML widget** onto the page
2. Paste the embed code into the HTML widget
3. The widget renders live — you'll see it in preview mode too

---

## Multiple widgets on one page

Each script tag only needs to appear once per page even if you have multiple
instances of the same widget type. Use `data-tp-widget` attribute for multiples:

```html
<!-- USTA competitions -->
<div data-tp-widget="competitions" data-org="USTA" data-limit="3"></div>

<!-- NBTA competitions -->
<div data-tp-widget="competitions" data-org="NBTA" data-limit="3"></div>

<!-- Load script once -->
<script src="https://app.twirlpower.com/widgets/tp-competitions.js"></script>
```

---

## Rebuilding after changes

Any time you update widget source files:
```bash
npm run build
```
Copy `dist/*.js` to your hosting location and push. Vercel auto-deploys.

---

## Widget data attributes reference

### tp-competitions
| Attribute | Default | Description |
|---|---|---|
| `data-org` | (all) | Filter: USTA, NBTA, TU, DMA |
| `data-state` | (all) | Filter: CO, TX, etc |
| `data-limit` | 6 | Number of competitions |
| `data-directory` | https://directory.twirlpower.com | Link for "See all" |
| `data-app` | https://app.twirlpower.com | Link for CTA buttons |

### tp-stats
| Attribute | Default | Description |
|---|---|---|
| `data-theme` | dark | dark or light |

### tp-clubs
| Attribute | Default | Description |
|---|---|---|
| `data-state` | (all) | Pre-filter by state |
| `data-limit` | 4 | Number of clubs |
| `data-directory` | https://directory.twirlpower.com | Link for "Browse all" |
| `data-app` | https://app.twirlpower.com | Link for claim CTA |
