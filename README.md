<div align="center">

# 🍪 CookieXport

**Export browser cookies in 13 formats — 100% local, zero telemetry.**

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-4285F4?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/cookiexport/elehbdibaiglkdbcaolaehdpobghehbm)
[![Website](https://img.shields.io/badge/Website-cookiexport.mehmetturkan.com-1a1a1a)](https://cookiexport.mehmetturkan.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[**Add to Chrome — It's Free**](https://chromewebstore.google.com/detail/cookiexport/elehbdibaiglkdbcaolaehdpobghehbm) · [**Visit the site**](https://cookiexport.mehmetturkan.com/)

<img src="https://cookiexport.mehmetturkan.com/assets/img/screenshots/hero.png" alt="CookieXport popup showing the Export tab with cookies for github.com and a cURL preview ready to copy" width="480" />

---

## What is CookieXport?

CookieXport gives developers, automation engineers, and security researchers full control over browser cookies — export as Netscape, JSON, cURL, Python, Playwright, Puppeteer and more. No servers, no telemetry, no nonsense — every export is generated instantly, right in your browser.

**100% local · No account required · Works on any site**
Also installs on Brave, Edge, Opera, Vivaldi & other Chromium-based browsers.

## 🍪 13 ready-to-use export formats

Pick the format that fits your workflow — from a plain Netscape cookie jar to a fully-formed Playwright script.

| Format | Output |
|---|---|
| Netscape `.txt` | Compatible with `wget`, `curl` and most CLI download tools |
| JSON `.json` | Structured data with full cookie metadata |
| cURL | Ready-to-paste command with a `Cookie` header |
| Python `requests` `.py` | Complete script with session setup |
| Node.js `fetch` `.js` | Async-ready snippet for modern Node |
| Playwright `.js` | `addCookies()`-ready array |
| Puppeteer `.js` | `setCookie()`-ready array |
| Selenium `.py` | `add_cookie()` driver calls |
| PHP cURL `.php` | `curl_setopt` with a cookie string |
| Go `net/http` `.go` | `req.AddCookie()` calls |
| HAR `.har` | Standard HTTP Archive format |
| Base64 | Encoded for safe transport |
| Custom template | Your own format using `{{name}}`, `{{value}}` variables |

## ✨ Features

**Instant domain detection** — automatically reads the active tab's domain, no copy-pasting URLs
**Quick presets** — YouTube, Netflix, Twitter, GitHub, Discord & 17 more, one click away
**Smart filters** — filter by Secure, HttpOnly, Session, or cookies expiring soon
**Full-text search** — search across cookie names and values in real time
**Multi-domain export** — select and export cookies from multiple domains at once
**Export history** — every export is saved locally, re-download or copy it anytime
**Import cookies** — load cookies back in from a `.txt` or `.json` file
**Light & dark theme** — auto-detects your system theme, or switch manually
**10 languages** — full UI translations, including Turkish, German, French, Japanese & more

## 🔒 Privacy — everything stays on your device

No data is ever sent to an external server · No remote code — everything ships inside the extension package · No personally identifiable information is collected · No data is sold or shared with third parties · Cookies are only read/written at your explicit request

Read the full [Privacy Policy](https://cookiexport.mehmetturkan.com/privacy).

<details>
<summary>Why each permission is needed</summary>

| Permission | Why it's needed |
|---|---|
| `cookies` | Read cookies for the current domain to export them, and write cookies when you import a file |
| `tabs` | Detect the active tab's domain so the right cookies are shown automatically |
| `downloads` | Save exported cookie files directly to your Downloads folder |
| `storage` | Remember your theme, language, and export preferences locally |
| `clipboardWrite` | Copy formatted output (e.g. a cURL command) when you click "Copy" |
| `contextMenus` | Add a right-click shortcut to export cookies for the current site |
| `<all_urls>` | Required by the Chrome cookies API to read cookies for whatever site you're on |

</details>

## 🖼️ Screenshots

<table>
<tr>
<td align="center" width="50%">
<img src="https://cookiexport.mehmetturkan.com/assets/img/screenshots/popup-export.png" alt="Export tab showing cookies for github.com with cURL format selected" width="380" /><br/>
<sub>Export — pick a format, filter, and download</sub>
</td>
<td align="center" width="50%">
<img src="https://cookiexport.mehmetturkan.com/assets/img/screenshots/popup-multi.png" alt="Multi-Domain tab listing cookie counts across several sites" width="380" /><br/>
<sub>Multi-Domain — select and export several sites at once</sub>
</td>
</tr>
<tr>
<td align="center" width="50%">
<img src="https://cookiexport.mehmetturkan.com/assets/img/screenshots/popup-history.png" alt="History tab listing past exports with re-download and copy actions" width="380" /><br/>
<sub>History — revisit, re-download, or copy past exports</sub>
</td>
<td align="center" width="50%">
<img src="https://cookiexport.mehmetturkan.com/assets/img/screenshots/options.png" alt="Options page showing theme, language, default format and custom template settings" width="380" /><br/>
<sub>Options — theme, language, default format & templates</sub>
</td>
</tr>
</table>

## 📦 Installation

Install directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/cookiexport/elehbdibaiglkdbcaolaehdpobghehbm) — no manual setup required.

## 🔗 Links

🌐 [Live site](https://cookiexport.mehmetturkan.com/) · 🛒 [Chrome Web Store](https://chromewebstore.google.com/detail/cookiexport/elehbdibaiglkdbcaolaehdpobghehbm) · 💻 [Extension source](https://github.com/mtvrkan/cookiexport) · 📄 [Privacy Policy](https://cookiexport.mehmetturkan.com/privacy) · 🐛 [Report an issue](https://github.com/mtvrkan/cookiexport/issues)

## 📄 License

MIT — see [LICENSE](LICENSE). This license covers the **landing page code only**; the "CookieXport" name and logo stay tied to the official extension listing.

---

If CookieXport saves you time, consider ⭐ starring the repo!

</div>
