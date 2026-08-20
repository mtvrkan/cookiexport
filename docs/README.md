# CookieXport — landing page

Static landing page for [CookieXport](../README.md), served by GitHub Pages from this folder.

**Live site:** https://cookiexport.mtvrkan.com/

## Structure

```
index.html               Landing page (English)
privacy.html             Privacy policy (English)
tr/index.html            Landing page (Turkish, served at /tr/)
tr/privacy.html          Privacy policy (Turkish)
assets/css/style.css     Styles (dark theme, matches the extension's own UI)
assets/js/main.js        Localised copy, tab switching, copy-to-clipboard, mobile nav, scroll reveal
assets/js/demo.js        The interactive popup replica in the hero
assets/js/shots.js       The four screens in "Screenshots", rendered from demo.js's sample data
assets/img/              Icons, OG cards (one per locale)
```

The Screenshots section holds no images: `shots.js` rebuilds the popup's Export,
Multi-Domain and History tabs plus the options page as inert DOM, reusing the
`.demo-*` styles and the sample data `demo.js` exposes on `window.CX_SAMPLE`. So
they follow the page's language and can't fall out of date against the popup —
but they are replicas of the UI, not captures of it. Keep them honest: when the
extension's own screens change, update the render.

## Translations

Each locale is a full static copy under its own folder — no build step, no runtime
routing. Strings that only exist in JavaScript live in `CX_STRINGS` at the top of
`assets/js/main.js`, keyed by `<html lang>`; `demo.js` reads the same table via
`window.CX_T`.

Adding a locale means: copy `index.html` + `privacy.html` into `<code>/`, translate,
fix the `lang`/`canonical`/`hreflang`/`og:locale` values, add a `CX_STRINGS` entry,
add the `hreflang` pair to every existing page, and add the URLs to `sitemap.xml`.

## Local preview

No build step required — from the repo root:

```
npx serve docs
```

Then open the printed local URL in a browser.

## Deploying

Pushed to `main` → served via GitHub Pages (Settings → Pages → Deploy from a branch → `main` → `/docs`) at the custom domain in [`CNAME`](CNAME).

Licensed MIT along with the rest of the repo — see [LICENSE](../LICENSE).
