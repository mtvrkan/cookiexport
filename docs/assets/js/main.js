/* Copy that only exists in JS. Keyed off <html lang> so the Turkish build
   under /tr/ speaks Turkish without a second copy of these scripts.
   demo.js reads the same table through window.CX_T. */
const CX_STRINGS = {
  en: {
    copied: 'Copied to clipboard',
    copyFail: 'Copy failed — select the text manually',

    filters: { all: 'All', session: 'Session', secure: 'Secure', httponly: 'HttpOnly', expiring: 'Expiring' },
    badgeSession: 'session',
    tagSecure: 'Secure',
    tagHttpOnly: 'HttpOnly',

    nSelected: (n) => `${n} selected`,
    ofNCookies: (n) => `of ${n} cookies`,
    nCookies: (n) => `${n} cookies`,
    emptyTitle: 'No cookies match',
    emptyHint: 'Try a different search or filter.',
    historyEmptyTitle: 'No exports yet',
    historyEmptyHint: 'Export something from the Export tab.',
    removeEntry: 'Remove entry',
    maskShow: 'Reveal cookie values',
    maskHide: 'Hide cookie values',
    justNow: 'just now',
    seedAgo: ['3m ago', '45m ago', '2h ago', 'Yesterday'],

    themeDemoOnly: 'Theme switching lives in the extension',
    settingsDemoOnly: 'Full settings live in the extension',
    flashCopied: 'Copied',
    flashSaved: 'Saved',
    flashExported: 'Exported',
    flashApplied: 'Applied',
    nothingToCopy: 'Nothing to copy — adjust the filter',
    nothingToExport: 'Nothing to export — adjust the filter',
    copyFailDemo: 'Copy failed — open the preview and select the text',
    copiedAs: (n, fmt) => `${n} cookies copied as ${fmt}`,
    downloadedAs: (n, fmt) => `Downloaded ${n} cookies as ${fmt}`,
    selectDomain: 'Select at least one domain',
    exportedFrom: (n, d) => `Exported ${n} cookies from ${d} domains`,
    historyCleared: 'History cleared',

    importWaiting: 'Waiting for input…',
    importInvalidJson: 'Invalid JSON',
    importNoLines: 'No tab-separated cookie lines found',
    importReady: (kind, n) => `${kind} detected — ${n} cookie${n === 1 ? '' : 's'} ready to apply`,
    importPasteFirst: 'Paste a valid cookie file first',
    importParsed: (n) => `${n} cookies parsed — the real extension would write them now`,

    // Screenshot section — rendered replicas, see shots.js. Labels mirror the
    // extension's own UI copy (src/i18n.js) so the two never drift apart.
    shots: {
      tabs: ['Export', 'Multi-Domain', 'History', 'Import'],
      subdomains: 'Subdomains',
      quick: 'Quick:',
      tool: 'Tool:',
      searchCookies: 'Search by name or value…',
      filterDomains: 'Filter domains…',
      copy: 'Copy',
      download: 'Download',
      multiExport: 'Export Selected Domains',
      historyTitle: 'History',
      clearAll: 'Clear all',
      settings: 'Settings',
      optTheme: 'Theme',
      optThemeValue: 'Dark',
      optLang: 'Language',
      optLangValue: 'English',
      optFormat: 'Default format',
      optFormatValue: 'cURL (.sh)',
      optSubdomains: 'Include subdomains by default',
      optValues: 'Show cookie values',
      optTemplate: 'Custom export template',
      optTemplateValue: '{{name}}={{value}}; domain={{domain}}',
      optTemplateHint: 'Variables: {{name}} {{value}} {{domain}} {{path}} {{expires}} {{expiresISO}} {{secure}} {{httpOnly}}',
      optPrivacy: 'Privacy',
      optPrivacyNote: 'CookieXport works 100% locally. No data is ever sent to a server.',
      optReset: 'Reset all settings',
      optResetBtn: 'Reset',
      optPrivacyLink: 'Privacy Policy ↗',
      version: 'CookieXport v1.1.1', // bump alongside softwareVersion in the JSON-LD block
    },
  },
  tr: {
    copied: 'Panoya kopyalandı',
    copyFail: 'Kopyalanamadı — metni elle seçin',

    filters: { all: 'Tümü', session: 'Oturum', secure: 'Güvenli', httponly: 'HttpOnly', expiring: 'Süresi dolan' },
    badgeSession: 'oturum',
    tagSecure: 'Güvenli',
    tagHttpOnly: 'HttpOnly',

    nSelected: (n) => `${n} seçili`,
    ofNCookies: (n) => `/ ${n} çerez`,
    nCookies: (n) => `${n} çerez`,
    emptyTitle: 'Eşleşen çerez yok',
    emptyHint: 'Farklı bir arama veya filtre deneyin.',
    historyEmptyTitle: 'Henüz dışa aktarma yok',
    historyEmptyHint: 'Dışa Aktar sekmesinden bir aktarım yapın.',
    removeEntry: 'Kaydı sil',
    maskShow: 'Çerez değerlerini göster',
    maskHide: 'Çerez değerlerini gizle',
    justNow: 'az önce',
    seedAgo: ['3 dk önce', '45 dk önce', '2 sa önce', 'Dün'],

    themeDemoOnly: 'Tema değiştirme eklentinin içinde',
    settingsDemoOnly: 'Ayarların tamamı eklentinin içinde',
    flashCopied: 'Kopyalandı',
    flashSaved: 'Kaydedildi',
    flashExported: 'Aktarıldı',
    flashApplied: 'Uygulandı',
    nothingToCopy: 'Kopyalanacak bir şey yok — filtreyi değiştirin',
    nothingToExport: 'Aktarılacak bir şey yok — filtreyi değiştirin',
    copyFailDemo: 'Kopyalanamadı — önizlemeyi açıp metni seçin',
    copiedAs: (n, fmt) => `${n} çerez ${fmt} olarak kopyalandı`,
    downloadedAs: (n, fmt) => `${n} çerez ${fmt} olarak indirildi`,
    selectDomain: 'En az bir domain seçin',
    exportedFrom: (n, d) => `${d} domainden ${n} çerez aktarıldı`,
    historyCleared: 'Geçmiş temizlendi',

    importWaiting: 'Girdi bekleniyor…',
    importInvalidJson: 'Geçersiz JSON',
    importNoLines: 'Sekmeyle ayrılmış çerez satırı bulunamadı',
    importReady: (kind, n) => `${kind} algılandı — ${n} çerez uygulanmaya hazır`,
    importPasteFirst: 'Önce geçerli bir çerez dosyası yapıştırın',
    importParsed: (n) => `${n} çerez ayrıştırıldı — gerçek eklenti şimdi bunları yazardı`,

    shots: {
      tabs: ['Dışa Aktar', 'Çoklu Domain', 'Geçmiş', 'İçe Aktar'],
      subdomains: 'Alt domainler',
      quick: 'Hızlı:',
      tool: 'Araç:',
      searchCookies: 'Ad veya değere göre ara…',
      filterDomains: 'Domainleri filtrele…',
      copy: 'Kopyala',
      download: 'İndir',
      multiExport: 'Seçili domainleri dışa aktar',
      historyTitle: 'Geçmiş',
      clearAll: 'Tümünü temizle',
      settings: 'Ayarlar',
      optTheme: 'Tema',
      optThemeValue: 'Koyu',
      optLang: 'Dil',
      optLangValue: 'Türkçe',
      optFormat: 'Varsayılan format',
      optFormatValue: 'cURL (.sh)',
      optSubdomains: 'Varsayılan olarak alt domainleri dahil et',
      optValues: 'Cookie değerlerini göster',
      optTemplate: 'Özel dışa aktarma şablonu',
      optTemplateValue: '{{name}}={{value}}; domain={{domain}}',
      optTemplateHint: 'Değişkenler: {{name}} {{value}} {{domain}} {{path}} {{expires}} {{expiresISO}} {{secure}} {{httpOnly}}',
      optPrivacy: 'Gizlilik',
      optPrivacyNote: 'CookieXport %100 yerel olarak çalışır. Hiçbir veri sunucuya gönderilmez.',
      optReset: 'Tüm ayarları sıfırla',
      optResetBtn: 'Sıfırla',
      optPrivacyLink: 'Gizlilik Politikası ↗',
      version: 'CookieXport v1.1.1',
    },
  },
}

const CX_T = CX_STRINGS[document.documentElement.lang] || CX_STRINGS.en
window.CX_T = CX_T

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle')
const navLinks = document.querySelector('.nav-links')

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-links-open')
    navToggle.setAttribute('aria-expanded', String(isOpen))
  })
}

// Code preview tabs
const codeTabs = document.querySelectorAll('.code-tab')
const codePanels = document.querySelectorAll('.code-panel')

codeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    codeTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false') })
    codePanels.forEach(p => p.classList.remove('active'))

    tab.classList.add('active')
    tab.setAttribute('aria-selected', 'true')
    document.querySelector(`.code-panel[data-panel="${tab.dataset.tab}"]`)?.classList.add('active')
  })
})

// Screenshot viewer tabs
const shotTabs = document.querySelectorAll('.shot-tab')
const shotPanels = document.querySelectorAll('.shot-panel')

shotTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    shotTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false') })
    shotPanels.forEach(p => { p.classList.remove('active'); p.hidden = true; p.scrollTop = 0 })

    tab.classList.add('active')
    tab.setAttribute('aria-selected', 'true')

    const panel = document.querySelector(`.shot-panel[data-shot="${tab.dataset.shot}"]`)
    if (panel) {
      panel.hidden = false
      panel.classList.add('active')
    }
  })
})

// Copy button — copies the currently active code panel
const copyBtn = document.getElementById('copy-code')
const toast = document.getElementById('toast')
let toastTimer = null

function showToast(message) {
  if (!toast) return
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800)
}

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const active = document.querySelector('.code-panel.active pre')
    if (!active) return
    try {
      await navigator.clipboard.writeText(active.textContent.trim())
      copyBtn.classList.add('copied')
      showToast(CX_T.copied)
      setTimeout(() => copyBtn.classList.remove('copied'), 1200)
    } catch {
      showToast(CX_T.copyFail)
    }
  })
}

// Scroll progress bar + sticky-nav state + back-to-top — one rAF-throttled handler
const progressBar = document.getElementById('scroll-progress')
const nav = document.querySelector('.nav')
const toTop = document.getElementById('to-top')
let scrollTicking = false

function onScroll() {
  const doc = document.documentElement
  const max = doc.scrollHeight - doc.clientHeight

  if (progressBar) {
    progressBar.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`
  }
  nav?.classList.toggle('is-stuck', doc.scrollTop > 8)
  toTop?.classList.toggle('is-visible', doc.scrollTop > 600)

  scrollTicking = false
}

window.addEventListener('scroll', () => {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(onScroll)
}, { passive: true })

onScroll()

// Cursor spotlight on cards — delegated, feeds the --mx/--my custom props
const finePointer = window.matchMedia('(pointer: fine)').matches
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
})

if (finePointer && !reducedMotion) {
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest?.('.card-base')
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    card.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, { passive: true })
}

// Hero entrance — index the copy so each line lands after the one above it
const heroCopy = document.querySelector('.hero-copy')
if (heroCopy) {
  Array.from(heroCopy.children).forEach((el, i) => el.style.setProperty('--i', i))
}
requestAnimationFrame(() => document.body.classList.add('is-loaded'))

// Scroll-reveal — per-section variants via data-reveal / data-reveal-children
const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-children]')

// Stagger caps at 8 so long grids don't trail far behind the viewport
document.querySelectorAll('[data-reveal-children]').forEach(group => {
  Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', Math.min(i, 8)))
})

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

  revealEls.forEach(el => observer.observe(el))
} else {
  revealEls.forEach(el => el.classList.add('in-view'))
}
