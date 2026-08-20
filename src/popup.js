/* ── State ──────────────────────────────────────────────────── */
const state = {
  domain: '', cookies: [], filtered: [], selected: new Set(),
  search: '', filter: 'all', format: 'curl',
  showValues: false, theme: 'dark', customTemplate: '',
  activeTab: 'export',
  importedCookies: null,
}

const $ = id => document.getElementById(id)

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  await initI18n()
  await loadSettings()
  applyTranslations()
  initToolScroll()
  initPresetScroll()
  bindEvents()
  await detectDomain()
  renderHistory()
})

async function loadSettings() {
  const s = await chrome.storage.local.get(['theme', 'format', 'showValues', 'customTemplate', 'subdomains'])
  state.theme          = s.theme          || 'dark'
  state.format         = s.format         || 'curl'
  state.showValues     = s.showValues     ?? false
  state.customTemplate = s.customTemplate || ''
  $('chk-subdomains').checked = s.subdomains !== false
  applyTheme()
  highlightTool(state.format)
  syncEyeIcon()
}

function syncEyeIcon() {
  $('ico-eye').classList.toggle('hidden', !state.showValues)
  $('ico-eye-off').classList.toggle('hidden', state.showValues)
}

/* ── Domain detection ───────────────────────────────────────── */
async function detectDomain() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
      showState('empty'); return
    }
    const url = new URL(tab.url)
    setDomain(url.hostname, tab.favIconUrl)
  } catch { showState('empty') }
}

function setDomain(domain, favIconUrl) {
  state.domain = domain
  $('domain-display').textContent = domain
  const fav = $('favicon')
  if (favIconUrl) { fav.src = favIconUrl; fav.style.display = 'block' }
  else              { fav.style.display = 'none' }
  $('presets-scroll').querySelectorAll('.preset').forEach(b => {
    const d = b.dataset.domain
    b.classList.toggle('active', domain === d || domain.endsWith('.' + d))
  })
  loadCookies()
}

/* ── Cookie loading ─────────────────────────────────────────── */
async function loadCookies() {
  showState('loading')
  state.selected.clear()
  try {
    const base = state.domain.replace(/^www\./, '')
    const withSubdomains = $('chk-subdomains').checked

    // chrome.cookies.getAll's `domain` filter always matches subdomains too —
    // there is no API-level way to ask for the host alone, so narrow it here.
    let cookies = await chrome.cookies.getAll({ domain: base })
    if (!withSubdomains) {
      cookies = cookies.filter(c => {
        const d = c.domain.replace(/^\./, '')
        return d === state.domain || d === base
      })
    }
    state.cookies = cookies
    applyFilters()
  } catch { showState('empty') }
}

function applyFilters() {
  const now = Date.now() / 1000
  let list  = [...state.cookies]

  if (state.search) {
    const q = state.search.toLowerCase()
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) || c.value.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q)
    )
  }

  switch (state.filter) {
    case 'session':  list = list.filter(c => !c.expirationDate); break
    case 'secure':   list = list.filter(c => c.secure); break
    case 'httponly': list = list.filter(c => c.httpOnly); break
    case 'expiring': list = list.filter(c => c.expirationDate && (c.expirationDate - now) < 7 * 86400); break
  }

  list.sort((a, b) => {
    const as = state.selected.has(key(a)) ? 0 : 1
    const bs = state.selected.has(key(b)) ? 0 : 1
    return as !== bs ? as - bs : a.name.localeCompare(b.name)
  })

  state.filtered = list
  renderCookies()
}

const key = c => c.name + '|' + c.domain

/* ── Cookie rendering ───────────────────────────────────────── */
function renderCookies() {
  const list = $('cookie-list')
  list.querySelectorAll('.cookie-item').forEach(n => n.remove())
  $('state-loading').classList.add('hidden')
  $('state-empty').classList.add('hidden')

  if (!state.filtered.length) {
    $('state-empty').classList.remove('hidden')
    updateFooter(); return
  }

  const frag = document.createDocumentFragment()
  state.filtered.forEach(c => frag.appendChild(makeCookieItem(c)))
  list.appendChild(frag)
  updateFooter()
}

function makeCookieItem(cookie) {
  const k = key(cookie)
  const selected = state.selected.has(k)
  const now = Date.now() / 1000
  let badgeClass = 'badge-gray', badgeText = 'session'
  if (cookie.expirationDate) {
    const d = (cookie.expirationDate - now) / 86400
    if (d < 0)  { badgeClass = 'badge-red';    badgeText = 'expired' }
    else if (d < 7)  { badgeClass = 'badge-red';    badgeText = `${Math.ceil(d)}d` }
    else if (d < 30) { badgeClass = 'badge-yellow'; badgeText = `${Math.ceil(d)}d` }
    else             { badgeClass = 'badge-green';  badgeText = `${Math.ceil(d)}d` }
  }
  const valDisplay = state.showValues
    ? esc(cookie.value)
    : cookie.value.length ? '●'.repeat(Math.min(cookie.value.length, 22)) : '(empty)'

  const item = document.createElement('div')
  item.className = 'cookie-item' + (selected ? ' selected' : '')
  item.dataset.key = k
  item.innerHTML = `
    <input type="checkbox" ${selected ? 'checked' : ''}>
    <div class="cookie-main">
      <div class="cookie-name" title="${esc(cookie.name)}">${esc(cookie.name)}</div>
      <div class="cookie-value">${valDisplay}</div>
    </div>
    <div class="cookie-meta">
      ${cookie.secure   ? `<span class="tag tag-icon" title="${t('f_secure')}"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>` : ''}
      ${cookie.httpOnly ? `<span class="tag tag-icon" title="${t('f_httponly')}"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></span>` : ''}
      <span class="badge ${badgeClass}">${badgeText}</span>
    </div>`
  item.addEventListener('click', e => { if (e.target.tagName !== 'INPUT') toggleCookie(k, item) })
  item.querySelector('input').addEventListener('change', () => toggleCookie(k, item))
  return item
}

function toggleCookie(k, item) {
  const checked = state.selected.has(k)
  if (checked) { state.selected.delete(k); item.classList.remove('selected') }
  else         { state.selected.add(k);    item.classList.add('selected') }
  item.querySelector('input').checked = !checked
  updateFooter()
}

function updateFooter() {
  const total = state.filtered.length
  const sel   = [...state.selected].filter(k => state.filtered.some(c => key(c) === k)).length
  $('lbl-selected').innerHTML = `${sel} <span data-i18n="n_selected">${t('n_selected')}</span>`
  $('lbl-total').textContent  = `${t('of')} ${total} ${t('n_cookies')}`
  $('chk-select-all').indeterminate = sel > 0 && sel < total
  $('chk-select-all').checked       = total > 0 && sel === total
  $('btn-download').disabled = sel === 0
  $('btn-copy').disabled     = sel === 0
}

function showState(s) {
  $('cookie-list').querySelectorAll('.cookie-item').forEach(n => n.remove())
  $('state-loading').classList.toggle('hidden', s !== 'loading')
  $('state-empty').classList.toggle('hidden', s !== 'empty')
  updateFooter()
}

/* ── Export ─────────────────────────────────────────────────── */
function getSelected() {
  return state.filtered.filter(c => state.selected.has(key(c)))
}

function doExport(action) {
  const cookies = getSelected()
  if (!cookies.length) { toast(t('select_first'), 'error'); return }
  const { content, ext } = Formatter.format(cookies, state.format, state.customTemplate)

  if (action === 'copy') {
    navigator.clipboard.writeText(content)
      .then(() => { toast(t('copied'), 'success'); saveHistory(state.domain, cookies.length, ext, content) })
      .catch(() => toast(t('copy_failed'), 'error'))
    return
  }

  const clean    = state.domain.replace(/[^a-z0-9.-]/gi, '_')
  const filename = `cookies_${clean}.${ext}`
  const blob     = new Blob([content], { type: 'text/plain' })
  const url      = URL.createObjectURL(blob)
  chrome.downloads.download({ url, filename, saveAs: false }, () => {
    URL.revokeObjectURL(url)
    toast(t('downloaded'), 'success')
    saveHistory(state.domain, cookies.length, ext, content)
  })
}

/* ── Multi-domain tab ───────────────────────────────────────── */
let allDomains   = []   // { domain, count }
let selDomains   = new Set()

async function loadMultiDomains() {
  const all = await chrome.cookies.getAll({})
  const map = {}
  all.forEach(c => {
    const d = c.domain.replace(/^\./, '')
    map[d] = (map[d] || 0) + 1
  })
  allDomains = Object.entries(map).map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
  renderDomainList(allDomains)
}

function renderDomainList(domains) {
  const list = $('multi-list')
  list.innerHTML = ''
  if (!domains.length) {
    list.innerHTML = `<div class="state-box"><p data-i18n="multi_empty">${t('multi_empty')}</p></div>`
    return
  }
  const frag = document.createDocumentFragment()
  domains.forEach(({ domain, count }) => {
    const item = document.createElement('div')
    item.className = 'domain-item' + (selDomains.has(domain) ? ' selected' : '')
    item.innerHTML = `
      <input type="checkbox" ${selDomains.has(domain) ? 'checked' : ''}>
      <span class="domain-item-name">${esc(domain)}</span>
      <span class="domain-item-count">${count} ${t('multi_cookie')}</span>`
    item.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') return
      toggleDomain(domain, item, item.querySelector('input'))
    })
    item.querySelector('input').addEventListener('change', () => {
      toggleDomain(domain, item, item.querySelector('input'))
    })
    frag.appendChild(item)
  })
  list.appendChild(frag)
}

function toggleDomain(domain, item, chk) {
  if (selDomains.has(domain)) { selDomains.delete(domain); item.classList.remove('selected'); chk.checked = false }
  else                        { selDomains.add(domain);    item.classList.add('selected');    chk.checked = true  }
}

async function doMultiExport() {
  if (!selDomains.size) { toast(t('no_sel_domain'), 'error'); return }
  const all = []
  for (const domain of selDomains) {
    const cookies = await chrome.cookies.getAll({ domain })
    all.push(...cookies)
  }
  const { content, ext } = Formatter.format(all, state.format, state.customTemplate)
  const filename = `cookies_multi_${[...selDomains].slice(0, 3).join('_')}.${ext}`.replace(/[^a-z0-9._-]/gi, '_')
  const blob     = new Blob([content], { type: 'text/plain' })
  const url      = URL.createObjectURL(blob)
  chrome.downloads.download({ url, filename, saveAs: false }, () => {
    URL.revokeObjectURL(url)
    toast(t('downloaded'), 'success')
    saveHistory([...selDomains].join(', '), all.length, ext, content)
  })
}

/* ── History ────────────────────────────────────────────────── */
const HIST_KEY = 'exportHistory'
const MAX_HIST = 25

async function saveHistory(domain, count, ext, content) {
  const { exportHistory = [] } = await chrome.storage.local.get(HIST_KEY)
  exportHistory.unshift({ domain, count, ext, content: content || '', ts: Date.now() })
  if (exportHistory.length > MAX_HIST) exportHistory.length = MAX_HIST
  await chrome.storage.local.set({ exportHistory })
  if (state.activeTab === 'history') renderHistory()
}

async function renderHistory() {
  const { exportHistory = [] } = await chrome.storage.local.get(HIST_KEY)
  const list = $('hist-list')
  list.querySelectorAll('.hist-item').forEach(n => n.remove())
  $('hist-empty').classList.toggle('hidden', exportHistory.length > 0)

  exportHistory.forEach((item, i) => {
    const row = document.createElement('div')
    row.className = 'hist-item'

    row.innerHTML = `
      <div class="hist-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <div class="hist-info">
        <div class="hist-domain">${esc(item.domain)}</div>
        <div class="hist-meta">
          <span class="hist-fmt">${item.ext.toUpperCase()}</span>
          ${item.count} ${t('hist_label')}
        </div>
      </div>
      <span class="hist-ago">${timeAgo(item.ts)}</span>
      <div class="hist-actions">
        ${item.content ? `
        <button class="btn-icon sm re-copy-btn" title="${t('btn_copy')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button class="btn-icon sm re-dl-btn" title="${t('re_dl')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>` : ''}
        <button class="hist-del" title="${t('delete')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>`

    // Copy to clipboard
    const copyBtn = row.querySelector('.re-copy-btn')
    if (copyBtn) {
      copyBtn.addEventListener('click', e => {
        e.stopPropagation()
        navigator.clipboard.writeText(item.content).then(() => toast(t('copied'), 'success'))
      })
    }

    // Re-download
    const dlBtn = row.querySelector('.re-dl-btn')
    if (dlBtn) {
      dlBtn.addEventListener('click', e => {
        e.stopPropagation()
        const blob  = new Blob([item.content], { type: 'text/plain' })
        const url   = URL.createObjectURL(blob)
        const fname = `cookies_${item.domain.replace(/[^a-z0-9.-]/gi, '_')}.${item.ext}`
        chrome.downloads.download({ url, filename: fname, saveAs: false }, () => {
          URL.revokeObjectURL(url)
          toast(t('downloaded'), 'success')
        })
      })
    }

    // Single delete with undo
    row.querySelector('.hist-del').addEventListener('click', async e => {
      e.stopPropagation()
      // Animate collapse
      const h = row.offsetHeight
      row.style.height   = h + 'px'
      row.style.overflow = 'hidden'
      row.offsetHeight
      row.classList.add('removing')
      await new Promise(r => setTimeout(r, 200))

      // Snapshot the item before removal
      const { exportHistory: hist = [] } = await chrome.storage.local.get(HIST_KEY)
      const removed = hist.splice(i, 1)[0]
      await chrome.storage.local.set({ [HIST_KEY]: hist })
      renderHistory()

      // Offer undo for 5 seconds
      toast(t('hist_deleted'), '', async () => {
        const { exportHistory: cur = [] } = await chrome.storage.local.get(HIST_KEY)
        cur.splice(i, 0, removed)
        await chrome.storage.local.set({ [HIST_KEY]: cur })
        renderHistory()
      })
    })

    list.appendChild(row)
  })
}

async function clearHistory() {
  const { exportHistory: backup = [] } = await chrome.storage.local.get(HIST_KEY)
  if (!backup.length) return
  await chrome.storage.local.remove(HIST_KEY)
  renderHistory()
  toast(t('hist_cleared'), '', async () => {
    await chrome.storage.local.set({ [HIST_KEY]: backup })
    renderHistory()
  })
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60)   return s + t('ago_s')
  if (s < 3600) return Math.floor(s / 60) + t('ago_m')
  if (s < 86400)return Math.floor(s / 3600) + t('ago_h')
  return Math.floor(s / 86400) + t('ago_d')
}

/* ── Import ─────────────────────────────────────────────────── */
function handleImportFile(file) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    const text    = e.target.result
    const cookies = Formatter.parse(text)
    if (!cookies || !cookies.length) { toast(t('imp_error'), 'error'); return }
    state.importedCookies = cookies
    disarmImport()
    $('drop-zone').classList.add('hidden')
    $('import-preview').classList.remove('hidden')
    $('preview-text').textContent = `${cookies.length} ${t('imp_preview')}`
  }
  reader.onerror = () => toast(t('imp_error'), 'error')
  reader.readAsText(file)
}

/* Writing cookies deserves a confirmation, but window.confirm() cannot be used
   here: the dialog takes focus away from the browser-action popup, Chrome tears
   the popup down, and the pending write never runs. So the button arms itself
   instead and needs a second click. */
let _importArmed = false
let _importArmTimer = null

function disarmImport() {
  _importArmed = false
  clearTimeout(_importArmTimer)
  const btn = $('btn-import-apply')
  btn.textContent = t('imp_apply')
  btn.classList.remove('armed')
}

async function applyImport() {
  if (!state.importedCookies) return

  if (!_importArmed) {
    _importArmed = true
    const btn = $('btn-import-apply')
    btn.textContent = t('imp_confirm')
    btn.classList.add('armed')
    clearTimeout(_importArmTimer)
    _importArmTimer = setTimeout(disarmImport, 5000)
    return
  }
  disarmImport()

  const includeExpired = $('chk-import-expired').checked
  const now = Date.now() / 1000
  let count = 0
  for (const c of state.importedCookies) {
    if (!includeExpired && c.expirationDate && c.expirationDate < now) continue
    try {
      const domain = c.domain || ''
      const url    = `http${c.secure ? 's' : ''}://${domain.replace(/^\./, '')}`
      const written = await chrome.cookies.set({
        url, name: c.name, value: c.value,
        domain: c.domain || undefined, path: c.path || '/',
        secure: c.secure || false, httpOnly: c.httpOnly || false,
        ...(c.expirationDate ? { expirationDate: c.expirationDate } : {}),
      })
      // set() resolves to null when the write is rejected — only count real writes
      if (written) count++
    } catch { /* some cookies may fail if domain is restricted */ }
  }
  toast(`${count} ${t('imp_success')}`, 'success')
  state.importedCookies = null
  $('drop-zone').classList.remove('hidden')
  $('import-preview').classList.add('hidden')
  if (state.domain) loadCookies()
}

/* ── Theme ──────────────────────────────────────────────────── */
function applyTheme() {
  document.documentElement.dataset.theme = state.theme
  $('ico-moon').classList.toggle('hidden', state.theme === 'light')
  $('ico-sun').classList.toggle('hidden',  state.theme === 'dark')
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark'
  applyTheme()
  chrome.storage.local.set({ theme: state.theme })
}

/* ── Preset scroll ──────────────────────────────────────────── */
function initPresetScroll() {
  const scroll = $('presets-scroll')
  const prev   = $('preset-prev')
  const next   = $('preset-next')
  const STEP   = 140

  function updateArrows() {
    prev.disabled = scroll.scrollLeft <= 2
    next.disabled = scroll.scrollLeft >= scroll.scrollWidth - scroll.clientWidth - 2
  }

  prev.addEventListener('click', () => { scroll.scrollBy({ left: -STEP, behavior: 'smooth' }); setTimeout(updateArrows, 200) })
  next.addEventListener('click', () => { scroll.scrollBy({ left:  STEP, behavior: 'smooth' }); setTimeout(updateArrows, 200) })
  scroll.addEventListener('scroll', updateArrows, { passive: true })

  let isDragging = false, startX = 0, startScrollLeft = 0
  scroll.addEventListener('mousedown', e => {
    isDragging = true; startX = e.pageX - scroll.offsetLeft
    startScrollLeft = scroll.scrollLeft; scroll.classList.add('dragging')
  })
  document.addEventListener('mouseup', () => { isDragging = false; scroll.classList.remove('dragging') })
  scroll.addEventListener('mousemove', e => {
    if (!isDragging) return
    e.preventDefault()
    scroll.scrollLeft = startScrollLeft - (e.pageX - scroll.offsetLeft - startX)
    updateArrows()
  })

  requestAnimationFrame(updateArrows)
}

/* ── Tool scroll ────────────────────────────────────────────── */
function initToolScroll() {
  const scroll = $('tools-scroll')
  const prev   = $('tool-prev')
  const next   = $('tool-next')
  const STEP   = 130

  function updateArrows() {
    const atStart = scroll.scrollLeft <= 2
    const atEnd   = scroll.scrollLeft >= scroll.scrollWidth - scroll.clientWidth - 2
    prev.disabled = atStart
    next.disabled = atEnd
  }

  prev.addEventListener('click', () => { scroll.scrollBy({ left: -STEP, behavior: 'smooth' }); setTimeout(updateArrows, 200) })
  next.addEventListener('click', () => { scroll.scrollBy({ left:  STEP, behavior: 'smooth' }); setTimeout(updateArrows, 200) })
  scroll.addEventListener('scroll', updateArrows, { passive: true })

  // Drag to scroll (mouse)
  let isDragging = false, startX = 0, startScrollLeft = 0

  scroll.addEventListener('mousedown', e => {
    isDragging     = true
    startX         = e.pageX - scroll.offsetLeft
    startScrollLeft= scroll.scrollLeft
    scroll.classList.add('dragging')
  })
  document.addEventListener('mouseup', () => { isDragging = false; scroll.classList.remove('dragging') })
  scroll.addEventListener('mousemove', e => {
    if (!isDragging) return
    e.preventDefault()
    const x   = e.pageX - scroll.offsetLeft
    scroll.scrollLeft = startScrollLeft - (x - startX)
    updateArrows()
  })

  // Scroll active tool into view on load
  requestAnimationFrame(() => {
    const active = scroll.querySelector('.tool.active')
    if (active) active.scrollIntoView({ inline: 'nearest', block: 'nearest' })
    updateArrows()
  })
}

/* ── Tool highlight ─────────────────────────────────────────── */
function highlightTool(fmt) {
  document.querySelectorAll('.tool').forEach(b => {
    const isActive = b.dataset.format === fmt
    b.classList.toggle('active', isActive)
    if (isActive) b.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
  })
}

/* ── Toast ──────────────────────────────────────────────────── */
let _toastTimer
function toast(msg, type = '', undoFn = null) {
  const el = $('toast')
  el.innerHTML = ''
  const span = document.createElement('span')
  span.textContent = msg
  el.appendChild(span)
  if (undoFn) {
    const btn = document.createElement('button')
    btn.className   = 'toast-undo'
    btn.textContent = t('undo')
    btn.addEventListener('click', e => {
      e.stopPropagation()
      undoFn()
      clearTimeout(_toastTimer)
      el.classList.add('hidden')
    })
    el.appendChild(btn)
  }
  el.className = 'toast' + (type ? ` ${type}` : '')
  if (_toastTimer) clearTimeout(_toastTimer)
  _toastTimer = setTimeout(() => el.classList.add('hidden'), undoFn ? 5000 : 2400)
}

/* ── Helpers ────────────────────────────────────────────────── */
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

/* ── Events ─────────────────────────────────────────────────── */
function bindEvents() {
  // Tabs
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'))
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'))
      btn.classList.add('active')
      const id = 'tab-' + btn.dataset.tab
      $(id)?.classList.remove('hidden')
      state.activeTab = btn.dataset.tab
      if (state.activeTab !== 'import')  disarmImport()
      if (state.activeTab === 'history') renderHistory()
      if (state.activeTab === 'multi')   loadMultiDomains()
    })
  })

  // Show values toggle (instant re-render)
  $('btn-show-values').addEventListener('click', () => {
    state.showValues = !state.showValues
    syncEyeIcon()
    chrome.storage.local.set({ showValues: state.showValues })
    renderCookies()
  })

  // Theme
  $('btn-theme').addEventListener('click', toggleTheme)

  // Domain
  $('chk-subdomains').addEventListener('change', loadCookies)
  $('btn-custom').addEventListener('click', () => {
    $('custom-panel').classList.toggle('hidden')
    if (!$('custom-panel').classList.contains('hidden')) $('custom-input').focus()
  })
  const applyCustom = () => {
    const v = $('custom-input').value.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!v) return
    $('custom-panel').classList.add('hidden')
    setDomain(v, null)
  }
  $('btn-apply-custom').addEventListener('click', applyCustom)
  $('custom-input').addEventListener('keydown', e => { if (e.key === 'Enter') applyCustom() })

  // Presets
  $('presets-scroll').querySelectorAll('.preset').forEach(b => {
    b.addEventListener('click', () => { $('custom-input').value = ''; setDomain(b.dataset.domain, null) })
  })

  // Tools
  document.querySelectorAll('.tool').forEach(b => {
    b.addEventListener('click', () => {
      state.format = b.dataset.format
      highlightTool(state.format)
      chrome.storage.local.set({ format: state.format })
    })
  })

  // Search
  $('search').addEventListener('input', () => {
    state.search = $('search').value
    $('btn-clear-search').classList.toggle('hidden', !state.search)
    applyFilters()
  })
  $('btn-clear-search').addEventListener('click', () => {
    $('search').value = ''; state.search = ''
    $('btn-clear-search').classList.add('hidden')
    applyFilters()
  })

  // Filter chips
  document.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'))
      c.classList.add('active')
      state.filter = c.dataset.filter
      applyFilters()
    })
  })

  // Select all
  $('chk-select-all').addEventListener('change', () => {
    if ($('chk-select-all').checked) state.filtered.forEach(c => state.selected.add(key(c)))
    else                             state.filtered.forEach(c => state.selected.delete(key(c)))
    renderCookies()
  })

  // Export
  $('btn-copy').addEventListener('click',     () => doExport('copy'))
  $('btn-download').addEventListener('click', () => doExport('download'))

  // Multi
  let _multiTimer
  $('multi-search').addEventListener('input', () => {
    clearTimeout(_multiTimer)
    _multiTimer = setTimeout(() => {
      const q = $('multi-search').value.toLowerCase()
      renderDomainList(q ? allDomains.filter(d => d.domain.includes(q)) : allDomains)
    }, 150)
  })
  $('btn-multi-export').addEventListener('click', doMultiExport)

  // History
  $('btn-clear-hist').addEventListener('click', clearHistory)

  // Import — drop zone
  const dz = $('drop-zone')
  dz.addEventListener('click', () => $('file-input').click())
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over') })
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'))
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('drag-over')
    handleImportFile(e.dataTransfer.files[0])
  })
  $('file-input').addEventListener('change', e => handleImportFile(e.target.files[0]))
  $('btn-import-apply').addEventListener('click', applyImport)

  // Keyboard shortcuts. Every one of them is skipped while a text field has
  // focus — otherwise Ctrl+A/Ctrl+C in the search box stop selecting text.
  document.addEventListener('keydown', e => {
    // Escape is safe while typing — clearing the search is what it means there.
    if (e.key === 'Escape' && state.search) $('btn-clear-search').click()
    const typing = e.target.matches('input:not([type=checkbox]), textarea')
    if (state.activeTab !== 'export' || typing) return
    if (e.ctrlKey && e.key === 'a') { e.preventDefault(); $('chk-select-all').click() }
    if (e.ctrlKey && e.key === 'c') { e.preventDefault(); doExport('copy') }
    if (e.ctrlKey && e.key === 'd') { e.preventDefault(); doExport('download') }
  })
}
