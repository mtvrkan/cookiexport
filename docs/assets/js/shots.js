/* CookieXport landing-page screenshots.
   The four "screens" under the hero are real DOM, built from the same sample
   data as the live demo (window.CX_SAMPLE) instead of PNG captures — so they
   speak the page's language, can't drift out of date against the popup, and
   cost no image bytes.

   Every render is inert and built from spans, not controls: this is a picture
   of the UI, not a second demo. The .sr-only line inside each .shot-panel is
   the text alternative the old <img alt> used to carry. */
;(() => {
  const stage = document.querySelector('.shots-stage')
  const sample = window.CX_SAMPLE
  if (!stage || !sample) return

  const L = window.CX_T
  const S = L.shots
  const { SITES, FORMATS, FILTERS, history } = sample

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const dots = (n) => '•'.repeat(Math.min(n, 26))

  const svg = (body, size = 16, weight = 1.8) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${weight}" stroke-linecap="round" aria-hidden="true">${body}</svg>`

  const ICON = {
    eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.6.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    caret: '<polyline points="18 15 12 9 6 15"/>',
    chevron: '<polyline points="6 9 12 15 18 9"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    secure: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  }

  // Reuses the #cx-tile gradient already defined once in the page's SVG sprite
  const logo = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <rect width="32" height="32" rx="7.52" fill="url(#cx-tile)"/>
    <g fill="none" stroke="#fff" stroke-width="2.88" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21.37 17.03A7.52 7.52 0 1 1 15.48 10.72"/>
      <path d="m20.93 11.07 5.32-5.32"/>
      <path d="M19.37 5.75h6.88v6.88"/>
    </g>
    <g fill="#fff">
      <circle cx="10.61" cy="16.13" r="1.5"/>
      <circle cx="13.47" cy="21.39" r="1.28"/>
      <circle cx="16.63" cy="20.34" r="1.02"/>
    </g>
  </svg>`

  // ── Popup pieces — same classes as the live demo, non-interactive elements ──
  const chip = (label, active, extra = '') =>
    `<span class="demo-chip${extra ? ' ' + extra : ''}${active ? ' active' : ''}">${esc(label)}</span>`

  const tick = (state, label) =>
    `<span class="demo-check"><input type="checkbox" tabindex="-1"${state === 'on' ? ' checked' : ''}${state === 'partial' ? ' data-partial' : ''}>` +
    (label ? `<span>${esc(label)}</span>` : '') + '</span>'

  const searchRow = (placeholder) =>
    `<div class="demo-search">${svg(ICON.search, 14, 2)}<span class="shot-input">${esc(placeholder)}</span></div>`

  function badges(c) {
    const bits = []
    if (c.secure) bits.push(`<span class="demo-badge demo-badge--icon" title="${esc(L.tagSecure)}">${svg(ICON.secure, 10, 2.4)}</span>`)
    if (c.httpOnly) bits.push(`<span class="demo-badge" title="${esc(L.tagHttpOnly)}">&lt;&gt;</span>`)
    bits.push(
      c.expires === null
        ? `<span class="demo-badge demo-badge--muted">${esc(L.badgeSession)}</span>`
        : `<span class="demo-badge demo-badge--${c.expires <= 30 ? 'warn' : 'ok'}">${c.expires}d</span>`
    )
    return bits.join('')
  }

  const shell = (active, body) => `
    <div class="demo shot-popup">
      <header class="demo-head">
        <span class="demo-brand">${logo(19)}CookieXport</span>
        <span class="demo-head-actions">
          <span class="demo-icon-btn">${svg(ICON.eyeOff)}</span>
          <span class="demo-icon-btn">${svg(ICON.moon)}</span>
          <span class="demo-icon-btn">${svg(ICON.gear)}</span>
        </span>
      </header>
      <nav class="demo-tabs">${S.tabs.map((t, i) => `<span class="demo-tab${i === active ? ' active' : ''}">${esc(t)}</span>`).join('')}</nav>
      <div class="demo-pane active shot-pane">${body}</div>
    </div>`

  // ── The four screens ───────────────────────────────────────────
  const SHOT_SITE = 'github.com'
  const SHOT_PICKED = ['_gh_sess', '_octo']
  const SHOT_DOMAINS = ['github.com', 'youtube.com']

  function exportScreen() {
    const cookies = SITES[SHOT_SITE]
    return shell(0, `
      <div class="demo-domain">
        <strong>${SHOT_SITE}</strong>
        ${tick('on', S.subdomains)}
      </div>
      <div class="demo-row">
        <span class="demo-row-label">${esc(S.quick)}</span>
        <div class="demo-chips demo-chips--scroll">${Object.keys(SITES)
          .map((s) => chip(s.replace(/\.(com|net|org)$/, ''), s === SHOT_SITE)).join('')}</div>
      </div>
      <div class="demo-row">
        <span class="demo-row-label">${esc(S.tool)}</span>
        <div class="demo-chips demo-chips--scroll">${FORMATS.map((f) => chip(f.label, f.id === 'curl')).join('')}</div>
      </div>
      ${searchRow(S.searchCookies)}
      <div class="demo-chips demo-chips--filters">${FILTERS.map((f, i) => chip(f.label, i === 0, 'demo-chip--sm')).join('')}</div>
      <ul class="demo-list">${cookies.map((c) => `
        <li class="demo-item">
          <span class="demo-check">
            <input type="checkbox" tabindex="-1"${SHOT_PICKED.includes(c.name) ? ' checked' : ''}>
            <span class="demo-item-text">
              <span class="demo-item-name">${esc(c.name)}</span>
              <span class="demo-item-value">${dots(c.value.length)}</span>
            </span>
          </span>
          <span class="demo-item-badges">${badges(c)}</span>
        </li>`).join('')}</ul>
      <div class="demo-bar">
        ${tick('partial', L.nSelected(SHOT_PICKED.length))}
        <span class="demo-count">${esc(L.ofNCookies(cookies.length))}</span>
      </div>
      <div class="demo-actions">
        <span class="demo-btn">${svg(ICON.copy, 13, 2)} ${esc(S.copy)}</span>
        <span class="demo-btn demo-btn--primary">${svg(ICON.download, 13, 2)} ${esc(S.download)}</span>
        <span class="demo-btn demo-btn--ghost">${svg(ICON.caret, 14, 2)}</span>
      </div>`)
  }

  function multiScreen() {
    return shell(1, `
      ${searchRow(S.filterDomains)}
      <ul class="demo-list demo-list--domains">${Object.keys(SITES).map((s) => `
        <li class="demo-item">
          <span class="demo-check">
            <input type="checkbox" tabindex="-1"${SHOT_DOMAINS.includes(s) ? ' checked' : ''}>
            <span class="demo-item-name">${s}</span>
          </span>
          <span class="demo-item-count">${esc(L.nCookies(SITES[s].length))}</span>
        </li>`).join('')}</ul>
      <div class="demo-actions">
        <span class="demo-btn demo-btn--primary demo-btn--wide">${esc(S.multiExport)}</span>
      </div>`)
  }

  function historyScreen() {
    return shell(2, `
      <div class="demo-bar demo-bar--head">
        <span>${esc(S.historyTitle)}</span>
        <span class="demo-link-btn">${esc(S.clearAll)}</span>
      </div>
      <ul class="demo-list demo-list--history">${history.map((h) => `
        <li class="demo-item">
          <span class="demo-item-text">
            <span class="demo-item-name">${esc(h.site)}</span>
            <span class="demo-item-value"><span class="demo-badge demo-badge--muted">${esc(h.format)}</span> ${esc(L.nCookies(h.count))}</span>
          </span>
          <span class="demo-item-badges">
            <span class="demo-item-count">${esc(h.ago)}</span>
            <span class="demo-icon-btn demo-icon-btn--sm">${svg(ICON.close, 13, 2)}</span>
          </span>
        </li>`).join('')}</ul>`)
  }

  // Settings is a full page rather than a popup — it scrolls inside the stage
  const optRow = (label, control, sub) => `
    <div class="opt-row">
      <span class="opt-row-info">
        <span class="opt-label">${esc(label)}</span>
        ${sub ? `<span class="opt-sub">${esc(sub)}</span>` : ''}
      </span>
      ${control}
    </div>`

  const optSelect = (value) => `<span class="opt-select">${esc(value)}${svg(ICON.chevron, 14, 2)}</span>`
  const optToggle = (on) => `<span class="opt-toggle${on ? ' is-on' : ''}"><span class="opt-knob"></span></span>`

  function optionsScreen() {
    return `
      <div class="shot-options">
        <header class="opt-head">
          ${logo(30)}
          <span class="opt-head-text"><strong>CookieXport</strong><span>${esc(S.settings)}</span></span>
        </header>

        <h3 class="opt-title">${esc(S.optTheme)}</h3>
        <div class="opt-card">${optRow(S.optTheme, optSelect(S.optThemeValue))}</div>

        <h3 class="opt-title">${esc(S.optLang)}</h3>
        <div class="opt-card">${optRow(S.optLang, optSelect(S.optLangValue))}</div>

        <h3 class="opt-title">${esc(S.optFormat)}</h3>
        <div class="opt-card">
          ${optRow(S.optFormat, optSelect(S.optFormatValue))}
          ${optRow(S.optSubdomains, optToggle(true))}
          ${optRow(S.optValues, optToggle(false))}
        </div>

        <h3 class="opt-title">${esc(S.optTemplate)}</h3>
        <div class="opt-card">
          <div class="opt-block">
            <span class="opt-textarea">${esc(S.optTemplateValue)}</span>
            <span class="opt-hint">${esc(S.optTemplateHint)}</span>
          </div>
        </div>

        <h3 class="opt-title">${esc(S.optPrivacy)}</h3>
        <div class="opt-card">
          <div class="opt-info">${svg(ICON.info, 14, 2)}<span>${esc(S.optPrivacyNote)}</span></div>
          ${optRow(S.optReset, `<span class="opt-danger">${esc(S.optResetBtn)}</span>`)}
          ${optRow(S.optPrivacy, `<span class="opt-link">${esc(S.optPrivacyLink)}</span>`, S.optPrivacyNote)}
        </div>

        <p class="opt-version">${esc(S.version)}</p>
      </div>`
  }

  // ── Mount ──────────────────────────────────────────────────────
  const SCREENS = {
    export: exportScreen,
    multi: multiScreen,
    history: historyScreen,
    options: optionsScreen,
  }

  Object.entries(SCREENS).forEach(([shot, build]) => {
    const host = stage.querySelector(`.shot-panel[data-shot="${shot}"] .shot-render`)
    if (host) host.innerHTML = build()
  })

  // "Some of these are ticked" has no HTML attribute — only a DOM property
  stage.querySelectorAll('input[data-partial]').forEach((box) => { box.indeterminate = true })
})()
