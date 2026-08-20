# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Removed
- HTML comments from the five site pages. The landing pages carried section-banner comments and a few notes-to-self that anyone reading the page source could see; the markup itself already says what each section is. [2026-08-20]

## [1.1.1] — 2026-08-15

### Added
- Turkish README at `README.tr.md`, mirroring the English one; the "Türkçe" link in the header row now opens it instead of the Turkish landing page. [2026-08-14]

### Removed
- "Development" section from the README — the folder tree and the setup notes duplicated what `INSTALL.md` already explains, so the README now just points there. [2026-08-14]
- The five screenshot PNGs under `docs/assets/img/screenshots/`, no longer loaded by the site. [2026-08-14]

### Changed
- Version bumped to 1.1.1 and the package rebuilt as `cookiexport-1.1.1.zip`, so the corrected description finally reaches the store. The 1.1.0 fix never got there: the rebuilt zip stayed on disk, the dashboard kept serving the old package, and the review flagged the same description a second time. Bumped in `src/manifest.json` and, to keep them in step, the version string in the site's options-screen demo and the `softwareVersion` in both landing pages' JSON-LD. [2026-08-15]
- The long store descriptions in `STORE_LISTING.txt` no longer read as keyword lists, in all ten languages. The thirteen export formats were spelled out one product name per line, and the presets bullet named five well-known websites — the kind of borrowed-brand list the store treats as spam even when the extension genuinely supports them. Formats are now grouped by what they are for, and the presets bullet gives the count without the names. The superlative openings ("the most powerful cookie exporter") went too. [2026-08-15]
- Store metadata rewritten after the Chrome Web Store rejected 1.1.0 for keyword spam ("Yellow Argon"). The extension description was a bare list of export format names, and the 1400x560 marquee promo tile carried the same list as its subtitle — the policy covers promo images too. Both now say plainly what the extension does. Applied to `src/_locales/*/messages.json` (all ten languages), the Summary texts in `STORE_LISTING.txt`, and the marquee copy in `tools/generate-logo.ps1`; the store package and the promo tiles were rebuilt. [2026-08-14]
- Privacy policy URLs dropped the `.html` extension — `/privacy` and `/tr/privacy`. Applied everywhere the address is written: both READMEs, the site's nav, footers and language switcher, the 404 page, canonical / `hreflang` / Open Graph / structured data, `sitemap.xml`, and the extension's settings link. GitHub Pages serves both forms, so old links keep working and the canonical is now the clean one. [2026-08-14]
- The Screenshots section is now rendered live in the browser from the hero demo's sample data instead of four PNG captures. The screens follow the page's language — the Turkish page showed English screenshots before — reuse the popup's own styles so they cannot fall out of date against it, and stay crisp on any display. The stage is taller in return: the popup keeps its real type size rather than being scaled down to fit. The five PNGs under `assets/img/screenshots/` are no longer referenced by the site. [2026-08-14]
- Screens with a short list (Multi-Domain, History) and the tall options page behave as they do in the extension: the list fades where the stage cuts it off, and the options page scrolls in place. [2026-08-14]

## [1.1.0] — 2026-08-14

### Added
- Turkish landing page and privacy policy at `/tr/`, with `hreflang` alternates on every page, Turkish canonical, Open Graph and Twitter metadata, a Turkish Open Graph card, Turkish structured data, and both locales listed in `sitemap.xml`. [2026-08-13]
- Language switcher in the site header — a two-segment EN/TR control that links straight to the alternate URL. [2026-08-13]
- Landing-page strings that only exist in JavaScript are now translated too, keyed off the page language and shared between `main.js` and the hero demo. [2026-08-13]
- Accessible names on the popup's icon-only controls: theme toggle, settings link, search clear button and the preset/tool scroll arrows. [2026-08-13]
- "Developed with ♥ by mtvrkan" credit at the bottom of the extension settings page, matching the site footer. [2026-08-13]
- Extension source code published as open source under MIT, in `src/`. [2026-08-11]
- README rewritten around what the extension actually saves you, with a badge row, a full format list and no screenshot wall. Install instructions moved out to their own `INSTALL.md` — browsers supported, loading unpacked, what each permission is for, and how to uninstall — so the README stays an introduction. [2026-08-14]
- `.gitignore` for build artifacts, local editor settings and untracked assets. [2026-08-11]
- `.gitattributes` to normalize line endings for cross-platform contributors. [2026-08-11]
- "Developed with ♥ by mtvrkan" credit line in the landing page footer, right-aligned opposite the links and linking to mtvrkan.com. [2026-08-11]
- Ambient page backdrop on the landing page: aurora gradients, scattered cookie-crumb specks in the logo's chip tone, and a fine grain layer. [2026-08-11]
- Oversized ghosted cookie marks bleeding off the corners of the final call-to-action card. [2026-08-11]
- Scrolling marquee of all 13 export formats between the hero and the trust bar. [2026-08-11]
- Scroll-progress bar, sticky-nav elevation state and a cursor-follow spotlight on cards. [2026-08-11]
- Interactive screenshot viewer: the four extension screens are now tabs that open in one fixed-size stage, with the tall Options page scrollable in place. [2026-08-11]
- Working demo of the extension popup in the hero, running on sample data: switch site and output format, search, filter, select cookies, preview the generated code, and really copy or download it. Multi-domain, history and import tabs are interactive too. No cookie API is ever called. [2026-08-11]
- Per-section scroll animations — staggered card grids, a curtain wipe on section headings, side-fanning lists, scaling panels and a rising final call-to-action, all disabled under `prefers-reduced-motion`. [2026-08-11]
- Back-to-top button on the landing and privacy pages, appearing after 600px of scroll. [2026-08-11]
- Custom 404 page matching the site design, with centred buttons back to the homepage and to issue reporting. [2026-08-11]
- `favicon.ico` for browsers and search engines that ask for it by default, and a 180×180 apple-touch-icon on a solid background so iOS home-screen bookmarks no longer show a black square. [2026-08-11]
- Open Graph and Twitter card metadata on the 404 page, and image dimensions and alt text on the privacy page. [2026-08-11]
- Footer and an "Add to Chrome" nav button on the privacy page, which previously had neither. [2026-08-11]
- SEO metadata: robots directives, theme colour, author, Open Graph image dimensions and alt text, `og:locale`, and Twitter image alt. [2026-08-11]
- Richer structured data — SoftwareApplication with feature list, supported languages, author and install URL, plus Person and WebSite entities; WebPage schema on the privacy page. [2026-08-11]
- `lastmod` dates in `sitemap.xml`; `robots.txt` now excludes the 404 page. [2026-08-11]

### Removed
- "Add to Chrome" button from the site header on every page — the language switcher takes its place; the hero and final call-to-action still carry the install button. [2026-08-13]
- Icon generator moved out of the repository into local-only tooling, so it is no longer published to GitHub. [2026-08-13]
- "CookieXport — made for developers, by developers" tagline from the landing page footer. [2026-08-11]

### Changed
- The settings page "Privacy Policy" link now opens the published policy on the site instead of the copy bundled in the extension, and follows the selected language (Turkish UI gets the Turkish page). [2026-08-13]
- The credit line stays in English on the Turkish pages — it is a signature, not interface copy. [2026-08-13]
- New logo: a brand-gradient squircle holding a white ring that breaks open at the top right, with an arrow leaving through the gap — the cookie is the ring and the export is the break in it, so the idea survives down to 16px. Replaces the flat tan cookie. Applied everywhere — extension icons, popup, settings and bundled privacy page, site header, favicons, apple-touch icon, the call-to-action watermarks and both Open Graph cards. [2026-08-13]
- Extension name and description now come from the locale files instead of hardcoded English, so the Chrome Web Store listing follows the browser language. The right-click menu label is localised the same way. [2026-08-13]
- The settings page reads its version number from the manifest instead of a hardcoded string. [2026-08-13]
- "Reset all settings" no longer deletes the export history along with the preferences. [2026-08-13]
- Toolbar badge caps at "99+" instead of overflowing with large cookie counts. [2026-08-13]
- Landing page redesigned: Space Grotesk / Inter / JetBrains Mono type system, floating pill navigation, gradient headline, numbered format cards with a full-width custom-template row, and reworked buttons, code preview, feature icons and final CTA. [2026-08-11]
- Landing page small-print colour lightened so 14px text meets the WCAG 4.5:1 contrast minimum. [2026-08-11]
- Hero is now a two-column layout — copy on the left, the live demo on the right — stacking below 1000px. It replaces the static hero screenshot, which also removes an image from the critical render path. [2026-08-11]
- Mobile: permissions table tightened, the screenshot tab strip now fades at its edge to signal horizontal scrolling. [2026-08-11]
- Mobile navigation is a full-width solid bar instead of a floating pill, and the menu panel is opaque — the pill let page content show through the gaps around it. [2026-08-11]
- The mobile header is now fixed rather than sticky, so it holds its position through any scroll, with reserved page padding so nothing hides beneath it. It collapses to the menu button at 900px instead of 760px, since the inline links stopped fitting well before phone widths. [2026-08-11]
- The hero demo is hidden below 760px and no longer built there at all; phones get the copy-only hero and still see the full UI in the screenshots section. [2026-08-11]
- Repository restructured: extension source in `src/`, landing page moved from the repo root to `docs/`. GitHub Pages is now served from `main` → `/docs`. [2026-08-11]
- `LICENSE` now covers the extension source as well as the landing page. [2026-08-11]

### Fixed
- The "Subdomains" checkbox did nothing when unchecked — the Chrome cookies API always matches subdomains, so the extension now narrows the result itself. [2026-08-13]
- cURL export percent-encoded cookie values, which rewrote the `=` padding on every base64 and JWT cookie and broke the session on the receiving server. [2026-08-13]
- Cookie values containing quotes, backslashes or `$` broke the generated cURL, PHP, Node.js, Python, Go and Selenium snippets; each format now escapes for its own target language. [2026-08-13]
- Importing cookies did nothing: the confirmation dialog moved focus away from the popup, which closed the popup and cancelled the write. Confirmation is now a second click on the button itself. [2026-08-13]
- Expiry dates were read as milliseconds, so importing the extension's own JSON export landed every cookie in 1970. Unix seconds, milliseconds and ISO dates are all handled now. [2026-08-13]
- The Netscape importer dropped `#HttpOnly_` lines written by curl and yt-dlp as if they were comments, and truncated any cookie value containing a tab. [2026-08-13]
- HAR export was missing most of the fields HAR 1.2 requires, so stricter viewers rejected the file. [2026-08-13]
- Ctrl+A and Ctrl+D in the popup's search box triggered select-all and download instead of editing the text. [2026-08-13]
- The custom-domain field showed the search box's placeholder in every language but English. [2026-08-13]
- A failed clipboard copy reported "Select at least one cookie" instead of a copy error. [2026-08-13]
- The import counter counted cookies the browser had refused to write. [2026-08-13]
- Mobile: the screenshot tabs were a horizontal scroll row whose second tab was clipped mid-word at the screen edge, reading as a broken layout. They now lay out as a two-column grid — icon over title on phones — so every tab is fully visible without sideways scrolling. [2026-08-11]
- The page could be panned sideways on narrow screens. Three separate causes: the screenshot stage was parked 36px off-screen by its reveal animation, the inline nav links overflowed the bar between 760px and 900px, and the nav bar itself did not fit under 400px. Verified clean from 320px to 1440px. [2026-08-11]
- Mobile: the sticky nav, back-to-top button and toast left smeared, stale pixels behind them while scrolling — `backdrop-filter` on fixed and sticky elements is unreliable on mobile Chrome, so those now use solid backgrounds. [2026-08-11]
- Site canonical URLs, Open Graph tags, `sitemap.xml` and `robots.txt` pointed at the old `mtvrkan.github.io` host instead of the `cookiexport.mtvrkan.com` custom domain. [2026-08-11]

## [1.0.0]

### Added
- Initial CookieXport release — 13 export formats, multi-domain export, import, local history, 10 locales.
