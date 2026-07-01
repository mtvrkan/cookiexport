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
      showToast('Copied to clipboard')
      setTimeout(() => copyBtn.classList.remove('copied'), 1200)
    } catch {
      showToast('Copy failed — select the text manually')
    }
  })
}

// Scroll-reveal
const revealEls = document.querySelectorAll('.reveal')

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  revealEls.forEach(el => observer.observe(el))
} else {
  revealEls.forEach(el => el.classList.add('in-view'))
}
