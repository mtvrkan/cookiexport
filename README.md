# CookieXport

Landing page for [CookieXport](https://chromewebstore.google.com/detail/cookiexport/elehbdibaiglkdbcaolaehdpobghehbm) — a Chrome extension that exports browser cookies in 13 formats (Netscape, JSON, cURL, Python, Node.js, Playwright, Puppeteer & more), 100% local with zero telemetry.

**Live site:** https://mtvrkan.github.io/cookiexport/
**Chrome Web Store:** https://chromewebstore.google.com/detail/cookiexport/elehbdibaiglkdbcaolaehdpobghehbm

This repo contains only the static landing page, not the extension's source code.

## Structure

```
index.html               Landing page
privacy.html             Privacy policy
assets/css/style.css     Styles (dark theme, matches the extension's own UI)
assets/js/main.js        Tab switching, copy-to-clipboard, mobile nav, scroll reveal
assets/img/              Icons, screenshots, OG image
```

## Local preview

No build step required:

```
npx serve .
```

Then open the printed local URL in a browser.

## Deploying

Pushed to `main` → served via GitHub Pages (Settings → Pages → Deploy from a branch → `main` → `/root`).

## License

MIT — see [LICENSE](LICENSE). Covers the landing page code only; the "CookieXport" name and logo stay tied to the official extension listing.
