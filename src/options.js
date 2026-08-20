const $ = id => document.getElementById(id)

async function init() {
  await initI18n()

  // Populate language select
  const langSel = $('sel-lang')
  langSel.innerHTML = ''
  LANGS.forEach(l => {
    const opt = document.createElement('option')
    opt.value = l.code
    opt.textContent = l.label
    langSel.appendChild(opt)
  })

  // Load saved settings
  const s = await chrome.storage.local.get(['theme', 'format', 'lang', 'subdomains', 'showValues', 'customTemplate'])
  $('sel-theme').value         = s.theme          || 'dark'
  $('sel-format').value        = s.format         || 'curl'
  langSel.value                = s.lang           || getLang()
  $('chk-subdomains').checked  = s.subdomains     !== false
  $('chk-show-values').checked = s.showValues     ?? false
  $('tpl-input').value         = s.customTemplate || ''

  // Read the version off the manifest — a hardcoded string here drifts silently
  // every time manifest.json is bumped.
  $('version-line').textContent = `CookieXport v${chrome.runtime.getManifest().version}`
  syncPrivacyLink()

  applyTheme($('sel-theme').value)
  applyTranslations()
  localizeOptions()
  initCustomSelects()
}

/* Point at the published policy rather than the copy bundled in the package, so
   the text people read is always the current one. The site only has an English
   and a Turkish version — every other locale gets English. */
const PRIVACY_URL = 'https://cookiexport.mtvrkan.com/privacy'
const PRIVACY_URL_TR = 'https://cookiexport.mtvrkan.com/tr/privacy'

function syncPrivacyLink() {
  $('link-privacy').href = getLang() === 'tr' ? PRIVACY_URL_TR : PRIVACY_URL
}

function localizeOptions() {
  $('sel-theme').querySelectorAll('option[data-i18n]').forEach(o => {
    o.textContent = t(o.dataset.i18n)
  })
  // Refresh custom select displays after translation
  document.querySelectorAll('.csel-val').forEach(v => {
    const sel = v.closest('.csel')?.querySelector('select')
    if (sel) v.textContent = sel.options[sel.selectedIndex]?.textContent || ''
  })
}

/* ── Custom selects ─────────────────────────────────────────── */
function initCustomSelects() {
  document.querySelectorAll('.select').forEach(makeCustomSelect)
}

function makeCustomSelect(sel) {
  if (sel.closest('.csel')) {
    const valEl = sel.parentNode.querySelector('.csel-val')
    if (valEl) valEl.textContent = sel.options[sel.selectedIndex]?.textContent || ''
    return
  }
  const wrap = document.createElement('div')
  wrap.className = 'csel'
  sel.parentNode.insertBefore(wrap, sel)
  wrap.appendChild(sel)

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'csel-btn'
  btn.innerHTML = `<span class="csel-val"></span>
    <span class="csel-arrow">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
    </span>`

  const panel = document.createElement('div')
  panel.className = 'csel-panel hidden'

  wrap.appendChild(btn)
  wrap.appendChild(panel)

  function buildPanel() {
    panel.innerHTML = ''
    Array.from(sel.options).forEach(opt => {
      const item = document.createElement('button')
      item.type = 'button'
      item.className = 'csel-opt' + (opt.value === sel.value ? ' selected' : '')
      item.textContent = opt.textContent
      item.dataset.value = opt.value
      item.addEventListener('click', e => {
        e.stopPropagation()
        sel.value = opt.value
        sel.dispatchEvent(new Event('change'))
        closePanel()
      })
      panel.appendChild(item)
    })
  }

  function syncDisplay() {
    btn.querySelector('.csel-val').textContent = sel.options[sel.selectedIndex]?.textContent || ''
  }

  function openPanel() {
    document.querySelectorAll('.csel-panel').forEach(p => { if (p !== panel) p.classList.add('hidden') })
    document.querySelectorAll('.csel-btn').forEach(b => { if (b !== btn) b.classList.remove('open') })
    buildPanel()
    // Position via fixed coords to escape overflow:hidden containers
    const r = btn.getBoundingClientRect()
    panel.style.top      = (r.bottom + 4) + 'px'
    panel.style.left     = r.left + 'px'
    panel.style.minWidth = r.width + 'px'
    panel.classList.remove('hidden')
    btn.classList.add('open')
  }

  function closePanel() {
    panel.classList.add('hidden')
    btn.classList.remove('open')
    syncDisplay()
  }

  btn.addEventListener('click', e => {
    e.stopPropagation()
    panel.classList.contains('hidden') ? openPanel() : closePanel()
  })

  document.addEventListener('click', closePanel)

  // Keep display in sync when changed externally (e.g. loadSettings sets .value)
  sel.addEventListener('change', syncDisplay)

  syncDisplay()
}

function applyTheme(val) {
  const resolved = val === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : val
  document.documentElement.dataset.theme = resolved
}

async function save(key, value) {
  await chrome.storage.local.set({ [key]: value })
  toast(t('save_ok'))
}

let _tt
function toast(msg, cls = 'success') {
  const el = $('toast')
  el.textContent = msg
  el.className   = `toast ${cls}`
  if (_tt) clearTimeout(_tt)
  _tt = setTimeout(() => el.classList.add('hidden'), 1800)
}

document.addEventListener('DOMContentLoaded', async () => {
  await init()

  $('sel-theme').addEventListener('change', e => {
    applyTheme(e.target.value)
    save('theme', e.target.value)
  })

  $('sel-lang').addEventListener('change', async e => {
    setLang(e.target.value)
    await save('lang', e.target.value)
    applyTranslations()
    localizeOptions()
    syncPrivacyLink()
  })

  $('sel-format').addEventListener('change', e => save('format', e.target.value))
  $('chk-subdomains').addEventListener('change', e => save('subdomains', e.target.checked))
  $('chk-show-values').addEventListener('change', e => save('showValues', e.target.checked))

  let tplTimer
  $('tpl-input').addEventListener('input', () => {
    clearTimeout(tplTimer)
    tplTimer = setTimeout(() => save('customTemplate', $('tpl-input').value), 600)
  })

  $('btn-reset').addEventListener('click', async () => {
    if (!confirm(t('reset_confirm'))) return
    // "Reset all settings" — the export history is user data, not a setting,
    // so carry it across the wipe instead of silently deleting it.
    const { exportHistory } = await chrome.storage.local.get('exportHistory')
    await chrome.storage.local.clear()
    if (exportHistory?.length) await chrome.storage.local.set({ exportHistory })
    await init()
    toast(t('reset_done'))
  })
})
