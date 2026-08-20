# Installing CookieXport

## From the Chrome Web Store

[**Add to Chrome — it's free**](https://chromewebstore.google.com/detail/cookiexport/elehbdibaiglkdbcaolaehdpobghehbm)

That is the whole process. There is nothing to configure and no account to create; the popup works the moment it finishes installing.

### Other browsers

The same listing installs on any Chromium-based browser — **Brave**, **Edge**, **Opera** and **Vivaldi** included. Edge users may need to allow extensions from other stores once, via the banner Edge shows on the Chrome Web Store page.

Firefox and Safari are not supported. The extension relies on the Chrome `cookies` API and a Manifest V3 service worker, neither of which ports over unchanged.

## From source

Useful if you want to read the code before trusting it with your session cookies, or if you are changing something.

```
git clone https://github.com/mtvrkan/cookiexport.git
```

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the `src/` folder — not the repository root.

There is no build step and no dependency to install first: `src/` is plain JavaScript that Chrome loads directly. After editing a file, press the reload button on the extension card in `chrome://extensions`; the popup picks the change up on its next open.

An unpacked extension gets a different ID than the store build, so its settings and export history are separate from the installed copy. Both can run side by side.

## Permissions it will ask for

Chrome shows the full list at install time. In short:

| Permission | Why |
|---|---|
| `cookies` | Read the cookies you export, and write them back when you import a file |
| `tabs` | Detect the active tab's domain so the popup opens already scoped to it |
| `downloads` | Save exported files to your Downloads folder |
| `storage` | Remember theme, language, format and export history — locally only |
| `clipboardWrite` | Put the generated snippet on your clipboard when you press Copy |
| `contextMenus` | Add the right-click "Export cookies for this site" shortcut |
| `<all_urls>` | Required by the Chrome cookies API to read cookies for whatever site you are on |

`<all_urls>` looks broad because the cookies API has no narrower form. It does not let the extension read page content, and nothing is read until you press Export, Copy, or use the right-click menu. The [privacy policy](https://cookiexport.mtvrkan.com/privacy.html) covers each one in full.

## Uninstalling

Right-click the toolbar icon → **Remove from Chrome**. Everything the extension stored — preferences and export history — is removed with it. Files you already downloaded stay where they are.

---

Something not working? [Open an issue](https://github.com/mtvrkan/cookiexport/issues).
