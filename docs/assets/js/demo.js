/* CookieXport landing-page demo.
   A working replica of the extension popup running on sample data.
   Nothing here touches real cookies — the browser cookie API is never called. */

// Wrapped so its bindings never collide with main.js in the shared global scope.
;(() => {
  // Localised copy, shared with main.js (see CX_STRINGS there).
  const L = window.CX_T

  // ── Sample data ────────────────────────────────────────────────
  // expires: number of days, or null for a session cookie
  const SITES = {
    'github.com': [
      { name: '_gh_sess',     value: 'eyJzZXNzaW9uX2lkIjoiYTFiMmMzZDRlNWY2ZzdoOGk5In0', secure: true,  httpOnly: true,  expires: null },
      { name: '_octo',        value: 'GH1.1.482935712.1699123456',                      secure: true,  httpOnly: false, expires: 730 },
      { name: 'color_mode',   value: '{"color_mode":"dark","light_theme":"light"}',      secure: false, httpOnly: false, expires: 180 },
      { name: 'dotcom_user',  value: 'mtvrkan',                                          secure: true,  httpOnly: false, expires: 365 },
      { name: 'logged_in',    value: 'yes',                                              secure: true,  httpOnly: true,  expires: 365 },
      { name: 'preferred_tz', value: 'Europe/Istanbul',                                  secure: false, httpOnly: false, expires: 12 },
    ],
    'youtube.com': [
      { name: 'VISITOR_INFO1_LIVE', value: 'kQz7NfP2mAo',                    secure: true,  httpOnly: true,  expires: 180 },
      { name: 'PREF',               value: 'f6=40000000&tz=Europe.Istanbul', secure: true,  httpOnly: false, expires: 730 },
      { name: 'YSC',                value: 'r9Kd2LmXqQ4',                    secure: true,  httpOnly: true,  expires: null },
      { name: 'LOGIN_INFO',         value: 'AFmmF2swRQIhAO3q...truncated',   secure: true,  httpOnly: true,  expires: 400 },
      { name: 'CONSENT',            value: 'YES+cb.20250629-11-p0.en+FX',    secure: false, httpOnly: false, expires: 20 },
    ],
    'netflix.com': [
      { name: 'NetflixId',   value: 'v%3D3%26ct%3DBgjHt...truncated', secure: true,  httpOnly: true,  expires: 365 },
      { name: 'SecureNetflixId', value: 'v%3D2%26mac%3DAQEAEQ',       secure: true,  httpOnly: true,  expires: 365 },
      { name: 'nfvdid',      value: 'BQFmAAEBELdT9m2n',               secure: true,  httpOnly: false, expires: 90 },
      { name: 'profilesNewSession', value: '0',                       secure: false, httpOnly: false, expires: null },
    ],
    'twitter.com': [
      { name: 'auth_token', value: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', secure: true,  httpOnly: true,  expires: 365 },
      { name: 'ct0',        value: '9f8e7d6c5b4a39281706',             secure: true,  httpOnly: false, expires: 180 },
      { name: 'guest_id',   value: 'v1%3A169912345678901234',          secure: true,  httpOnly: false, expires: 730 },
      { name: 'night_mode', value: '2',                                secure: false, httpOnly: false, expires: 25 },
      { name: 'lang',       value: 'en',                               secure: false, httpOnly: false, expires: null },
    ],
    'reddit.com': [
      { name: 'reddit_session', value: 'MTY5OTEyMzQ1Ni41NzMwMjk',  secure: true,  httpOnly: true,  expires: 730 },
      { name: 'token_v2',       value: 'eyJhbGciOiJSUzI1NiIsImtpZCI', secure: true, httpOnly: true,  expires: null },
      { name: 'csv',            value: '2',                          secure: true,  httpOnly: false, expires: 400 },
      { name: 'edgebucket',     value: 'Kd7mQz2NfP',                 secure: false, httpOnly: false, expires: 8 },
    ],
    'discord.com': [
      { name: '__Secure-recent_mfa', value: 'WlhsS2FHSkhZMmxQYVVwQw', secure: true,  httpOnly: true,  expires: 30 },
      { name: 'locale',              value: 'en-US',                  secure: false, httpOnly: false, expires: 365 },
      { name: '__dcfduid',           value: 'b7e1a2c04f8d11ee',       secure: true,  httpOnly: true,  expires: 400 },
      { name: 'cf_clearance',        value: 'sQ8pLm2Nx.7Kd-1699123',  secure: true,  httpOnly: true,  expires: 4 },
    ],
  }

  const FORMATS = [
    { id: 'curl',       label: 'cURL',       ext: 'sh' },
    { id: 'python',     label: 'Python',     ext: 'py' },
    { id: 'node',       label: 'Node.js',    ext: 'js' },
    { id: 'playwright', label: 'Playwright', ext: 'js' },
    { id: 'json',       label: 'JSON',       ext: 'json' },
    { id: 'netscape',   label: 'Netscape',   ext: 'txt' },
  ]

  const FILTERS = [
    { id: 'all',      label: L.filters.all },
    { id: 'session',  label: L.filters.session },
    { id: 'secure',   label: L.filters.secure },
    { id: 'httponly', label: L.filters.httponly },
    { id: 'expiring', label: L.filters.expiring },
  ]

  const SEED_HISTORY = [
    { site: 'github.com',               format: 'sh',   count: 6, ago: L.seedAgo[0] },
    { site: 'youtube.com',              format: 'json', count: 5, ago: L.seedAgo[1] },
    { site: 'netflix.com, discord.com', format: 'py',   count: 8, ago: L.seedAgo[2] },
    { site: 'twitter.com',              format: 'txt',  count: 5, ago: L.seedAgo[3] },
  ]

  // shots.js renders the Screenshots section from this same data, so the two
  // never show different cookies for the same site.
  window.CX_SAMPLE = { SITES, FORMATS, FILTERS, history: SEED_HISTORY }

  const demoRoot = document.getElementById('demo')
  if (!demoRoot) return

  // CSS hides the demo on phones; don't build it there either. Re-checked on
  // resize so rotating a tablet into range still gets a working demo.
  const wideEnough = window.matchMedia('(min-width: 761px)')
  let booted = false

  const state = {
    site: 'github.com',
    format: 'curl',
    filter: 'all',
    query: '',
    masked: true,
    selected: new Set(),
    domains: new Set(['github.com', 'youtube.com']),
    history: SEED_HISTORY.map((h) => ({ ...h })),
  }

  const $ = (id) => document.getElementById(id)
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

  // ── Derived data ───────────────────────────────────────────────
  const cookiesFor = (site) => SITES[site] || []

  function visibleCookies() {
    const q = state.query.trim().toLowerCase()
    return cookiesFor(state.site).filter((c) => {
      if (q && !(c.name.toLowerCase().includes(q) || c.value.toLowerCase().includes(q))) return false
      if (state.filter === 'session') return c.expires === null
      if (state.filter === 'secure') return c.secure
      if (state.filter === 'httponly') return c.httpOnly
      if (state.filter === 'expiring') return c.expires !== null && c.expires <= 30
      return true
    })
  }

  // Selection drives the export; with nothing ticked, everything visible is exported
  function exportSet() {
    const visible = visibleCookies()
    const picked = visible.filter((c) => state.selected.has(c.name))
    return picked.length ? picked : visible
  }

  // ── Format generators ──────────────────────────────────────────
  function cookieDomain() {
    return ($('demo-subdomains')?.checked ? '.' : '') + state.site
  }

  function expiryStamp(days) {
    // Fixed base date keeps the demo output stable and diffable
    return days === null ? 0 : Math.floor(Date.UTC(2026, 7, 11) / 1000) + days * 86400
  }

  const generators = {
    curl: (cs) =>
      `curl 'https://${state.site}/' \\\n  -H 'Cookie: ${cs.map((c) => `${c.name}=${c.value}`).join('; ')}'`,

    python: (cs) =>
      `import requests\n\nsession = requests.Session()\nsession.cookies.update({\n` +
      cs.map((c) => `    "${c.name}": "${c.value}",`).join('\n') +
      `\n})\n\nresponse = session.get("https://${state.site}/")\nprint(response.status_code)`,

    node: (cs) =>
      `const cookies = "${cs.map((c) => `${c.name}=${c.value}`).join('; ')}"\n\n` +
      `const response = await fetch("https://${state.site}/", {\n  headers: { cookie: cookies },\n})`,

    playwright: (cs) =>
      `await context.addCookies([\n` +
      cs.map((c) =>
        `  { name: "${c.name}", value: "${c.value}", domain: "${cookieDomain()}", path: "/", secure: ${c.secure}, httpOnly: ${c.httpOnly} },`
      ).join('\n') +
      `\n])`,

    json: (cs) =>
      JSON.stringify(
        cs.map((c) => ({
          name: c.name,
          value: c.value,
          domain: cookieDomain(),
          path: '/',
          secure: c.secure,
          httpOnly: c.httpOnly,
          session: c.expires === null,
          expirationDate: expiryStamp(c.expires) || undefined,
        })),
        null,
        2
      ),

    netscape: (cs) =>
      `# Netscape HTTP Cookie File\n# Generated by CookieXport\n\n` +
      cs.map((c) =>
        [cookieDomain(), 'TRUE', '/', c.secure ? 'TRUE' : 'FALSE', expiryStamp(c.expires), c.name, c.value].join('\t')
      ).join('\n')
  }

  const buildOutput = () => generators[state.format](exportSet())

  // ── Rendering ──────────────────────────────────────────────────
  function renderChips() {
    $('demo-sites').innerHTML = Object.keys(SITES)
      .map((s) => `<button type="button" class="demo-chip${s === state.site ? ' active' : ''}" data-site="${s}">${s.replace(/\.(com|net|org)$/, '')}</button>`)
      .join('')

    $('demo-formats').innerHTML = FORMATS
      .map((f) => `<button type="button" class="demo-chip${f.id === state.format ? ' active' : ''}" data-format="${f.id}">${f.label}</button>`)
      .join('')

    $('demo-filters').innerHTML = FILTERS
      .map((f) => `<button type="button" class="demo-chip demo-chip--sm${f.id === state.filter ? ' active' : ''}" data-filter="${f.id}">${f.label}</button>`)
      .join('')
  }

  function badge(c) {
    const bits = []
    if (c.secure) bits.push(`<span class="demo-badge demo-badge--icon" title="${L.tagSecure}"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>`)
    if (c.httpOnly) bits.push(`<span class="demo-badge" title="${L.tagHttpOnly}">&lt;&gt;</span>`)
    bits.push(
      c.expires === null
        ? `<span class="demo-badge demo-badge--muted">${L.badgeSession}</span>`
        : `<span class="demo-badge demo-badge--${c.expires <= 30 ? 'warn' : 'ok'}">${c.expires}d</span>`
    )
    return bits.join('')
  }

  function renderList() {
    const visible = visibleCookies()
    const list = $('demo-list')

    if (!visible.length) {
      list.innerHTML = `<li class="demo-empty">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <strong>${L.emptyTitle}</strong>
        <span>${L.emptyHint}</span>
      </li>`
    } else {
      list.innerHTML = visible.map((c) => `
        <li class="demo-item">
          <label class="demo-check">
            <input type="checkbox" data-cookie="${esc(c.name)}"${state.selected.has(c.name) ? ' checked' : ''}>
            <span class="demo-item-text">
              <span class="demo-item-name">${esc(c.name)}</span>
              <span class="demo-item-value">${state.masked ? '•'.repeat(Math.min(c.value.length, 26)) : esc(c.value)}</span>
            </span>
          </label>
          <span class="demo-item-badges">${badge(c)}</span>
        </li>`).join('')
    }

    const picked = visible.filter((c) => state.selected.has(c.name)).length
    $('demo-selected').textContent = L.nSelected(picked)
    $('demo-count').textContent = L.ofNCookies(cookiesFor(state.site).length)
    $('demo-all').checked = visible.length > 0 && picked === visible.length
    $('demo-all').indeterminate = picked > 0 && picked < visible.length
    $('demo-domain').textContent = state.site

    if (!$('demo-output').hidden) $('demo-output-code').textContent = buildOutput()
  }

  function renderMulti() {
    const q = ($('demo-multi-search')?.value || '').trim().toLowerCase()
    $('demo-multi-list').innerHTML = Object.keys(SITES)
      .filter((s) => s.includes(q))
      .map((s) => `
        <li class="demo-item">
          <label class="demo-check">
            <input type="checkbox" data-domain="${s}"${state.domains.has(s) ? ' checked' : ''}>
            <span class="demo-item-name">${s}</span>
          </label>
          <span class="demo-item-count">${L.nCookies(SITES[s].length)}</span>
        </li>`).join('')
  }

  function renderHistory() {
    const list = $('demo-history')
    if (!state.history.length) {
      list.innerHTML = `<li class="demo-empty">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>
        <strong>${L.historyEmptyTitle}</strong>
        <span>${L.historyEmptyHint}</span>
      </li>`
      return
    }
    list.innerHTML = state.history.map((h, i) => `
      <li class="demo-item">
        <span class="demo-item-text">
          <span class="demo-item-name">${esc(h.site)}</span>
          <span class="demo-item-value"><span class="demo-badge demo-badge--muted">${h.format}</span> ${L.nCookies(h.count)}</span>
        </span>
        <span class="demo-item-badges">
          <span class="demo-item-count">${esc(h.ago)}</span>
          <button class="demo-icon-btn demo-icon-btn--sm" type="button" data-history-remove="${i}" aria-label="${L.removeEntry}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </span>
      </li>`).join('')
  }

  // ── Feedback helpers ───────────────────────────────────────────
  const toastEl = document.getElementById('toast')
  let toastTimer = null

  function toast(message) {
    if (!toastEl) return
    toastEl.textContent = message
    toastEl.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000)
  }

  function flash(btn, label) {
    const original = btn.innerHTML
    btn.classList.add('is-done')
    btn.innerHTML = label
    setTimeout(() => { btn.innerHTML = original; btn.classList.remove('is-done') }, 1300)
  }

  function pushHistory(site, count) {
    const ext = FORMATS.find((f) => f.id === state.format).ext
    state.history.unshift({ site, format: ext, count, ago: L.justNow })
    state.history = state.history.slice(0, 6)
    renderHistory()
  }

  function download(text, filename) {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // ── Events ─────────────────────────────────────────────────────
  demoRoot.addEventListener('click', (e) => {
    const t = e.target

    const tab = t.closest('.demo-tab')
    if (tab) {
      demoRoot.querySelectorAll('.demo-tab').forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false') })
      demoRoot.querySelectorAll('.demo-pane').forEach((p) => { p.classList.remove('active'); p.hidden = true })
      tab.classList.add('active')
      tab.setAttribute('aria-selected', 'true')
      const pane = demoRoot.querySelector(`.demo-pane[data-pane="${tab.dataset.pane}"]`)
      pane.hidden = false
      pane.classList.add('active')
      return
    }

    const chip = t.closest('.demo-chip')
    if (chip) {
      if (chip.dataset.site) { state.site = chip.dataset.site; state.selected.clear() }
      if (chip.dataset.format) state.format = chip.dataset.format
      if (chip.dataset.filter) state.filter = chip.dataset.filter
      renderChips()
      renderList()
      return
    }

    const remove = t.closest('[data-history-remove]')
    if (remove) {
      state.history.splice(Number(remove.dataset.historyRemove), 1)
      renderHistory()
      return
    }
  })

  demoRoot.addEventListener('change', (e) => {
    const t = e.target
    if (t.dataset.cookie) {
      t.checked ? state.selected.add(t.dataset.cookie) : state.selected.delete(t.dataset.cookie)
      renderList()
    }
    if (t.dataset.domain) {
      t.checked ? state.domains.add(t.dataset.domain) : state.domains.delete(t.dataset.domain)
    }
    if (t.id === 'demo-all') {
      const visible = visibleCookies()
      t.checked ? visible.forEach((c) => state.selected.add(c.name)) : visible.forEach((c) => state.selected.delete(c.name))
      renderList()
    }
    if (t.id === 'demo-subdomains') renderList()
  })

  $('demo-search').addEventListener('input', (e) => { state.query = e.target.value; renderList() })
  $('demo-multi-search').addEventListener('input', renderMulti)

  $('demo-mask').addEventListener('click', (e) => {
    state.masked = !state.masked
    e.currentTarget.setAttribute('aria-pressed', String(state.masked))
    e.currentTarget.setAttribute('aria-label', state.masked ? L.maskShow : L.maskHide)
    e.currentTarget.classList.toggle('is-on', !state.masked)
    renderList()
  })

  $('demo-theme').addEventListener('click', () => toast(L.themeDemoOnly))
  $('demo-settings').addEventListener('click', () => toast(L.settingsDemoOnly))

  $('demo-toggle-out').addEventListener('click', (e) => {
    const out = $('demo-output')
    const open = out.hidden
    out.hidden = !open
    e.currentTarget.setAttribute('aria-expanded', String(open))
    e.currentTarget.classList.toggle('is-open', open)
    if (open) $('demo-output-code').textContent = buildOutput()
  })

  $('demo-copy').addEventListener('click', async (e) => {
    const set = exportSet()
    if (!set.length) return toast(L.nothingToCopy)
    try {
      await navigator.clipboard.writeText(buildOutput())
      flash(e.currentTarget, L.flashCopied)
      toast(L.copiedAs(set.length, FORMATS.find((f) => f.id === state.format).label))
    } catch {
      toast(L.copyFailDemo)
    }
  })

  $('demo-download').addEventListener('click', (e) => {
    const set = exportSet()
    if (!set.length) return toast(L.nothingToExport)
    const fmt = FORMATS.find((f) => f.id === state.format)
    download(buildOutput(), `cookies_${state.site.replace(/\./g, '_')}.${fmt.ext}`)
    flash(e.currentTarget, L.flashSaved)
    pushHistory(state.site, set.length)
    toast(L.downloadedAs(set.length, fmt.label))
  })

  $('demo-multi-export').addEventListener('click', (e) => {
    if (!state.domains.size) return toast(L.selectDomain)
    const sites = [...state.domains]
    const all = sites.flatMap((s) => SITES[s])
    const original = state.site
    const text = sites.map((s) => { state.site = s; return generators[state.format](SITES[s]) }).join('\n\n')
    state.site = original
    download(text, `cookies_${sites.length}_domains.${FORMATS.find((f) => f.id === state.format).ext}`)
    flash(e.currentTarget, L.flashExported)
    pushHistory(sites.join(', '), all.length)
    toast(L.exportedFrom(all.length, sites.length))
  })

  $('demo-history-clear').addEventListener('click', () => { state.history = []; renderHistory(); toast(L.historyCleared) })

  // Import — parses locally, never writes anything
  const SAMPLE = `# Netscape HTTP Cookie File
.github.com\tTRUE\t/\tTRUE\t1799999999\t_octo\tGH1.1.482935712
.github.com\tTRUE\t/\tTRUE\t0\t_gh_sess\teyJzZXNzaW9uX2lkIjoiYTFiMmMz
.github.com\tTRUE\t/\tFALSE\t1799999999\tcolor_mode\tdark`

  function parseImport(text) {
    const raw = text.trim()
    if (!raw) return null
    if (raw.startsWith('[') || raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw)
        const arr = Array.isArray(parsed) ? parsed : [parsed]
        return { kind: 'JSON', count: arr.filter((c) => c && c.name).length }
      } catch {
        return { kind: 'JSON', count: 0, error: L.importInvalidJson }
      }
    }
    const lines = raw.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'))
    const valid = lines.filter((l) => l.split('\t').length >= 7)
    return { kind: 'Netscape', count: valid.length, error: valid.length ? null : L.importNoLines }
  }

  function showImport() {
    const el = $('demo-import-result')
    const result = parseImport($('demo-import').value)
    if (!result) { el.textContent = L.importWaiting; el.className = 'demo-import-result'; return }
    if (result.error) { el.textContent = `${result.kind}: ${result.error}`; el.className = 'demo-import-result is-error'; return }
    el.textContent = L.importReady(result.kind, result.count)
    el.className = 'demo-import-result is-ok'
  }

  $('demo-import').addEventListener('input', showImport)
  $('demo-import-sample').addEventListener('click', () => { $('demo-import').value = SAMPLE; showImport() })
  $('demo-import-apply').addEventListener('click', (e) => {
    const result = parseImport($('demo-import').value)
    if (!result || result.error || !result.count) return toast(L.importPasteFirst)
    flash(e.currentTarget, L.flashApplied)
    toast(L.importParsed(result.count))
  })

  // ── Boot ───────────────────────────────────────────────────────
  function boot() {
    if (booted || !wideEnough.matches) return
    booted = true
    renderChips()
    renderList()
    renderMulti()
    renderHistory()
  }

  boot()
  wideEnough.addEventListener('change', boot)
})()
