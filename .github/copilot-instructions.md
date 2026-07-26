# Copilot Instructions for BJ's Wholesale Coupon Bot

## Project Overview

This is a single-file browser automation tool (a "coupon bot") written in vanilla JavaScript. It auto-clips every available digital coupon on BJ's Wholesale Club's website (`https://www.bjs.com/myCoupons`) — and reportedly works on Harris Teeter as well. No build step, no package manager, no server: it runs entirely in the browser console, as a bookmarklet, or via an iOS Shortcut.

## Repository Structure

```
/
├── coupon-bot.js          # The entire bot — the only source file
├── README.md              # User-facing documentation (desktop, mobile, iOS, troubleshooting)
├── clip-coupons.gif       # Demo GIF embedded in README
├── LICENSE.md             # License
└── .github/
    ├── copilot-instructions.md  # This file
    └── agents/            # Custom agent definitions (do not read or modify)
```

## The Only Source File: `coupon-bot.js`

Everything lives in this one IIFE (Immediately Invoked Function Expression). Key sections:

| Section | Purpose |
|---|---|
| `defaultConfig` / `config` | `baseDelay` (ms between clicks, default 1500) and `maxAttempts` (sweep retries, default 5). Users can override via `window.customConfig` before loading the script. |
| `getBrowser()` | Detects browser from `navigator.userAgent` (chrome/firefox/safari/edge). |
| `sleep(ms)` | Promise-based delay helper. |
| `safeClick(element)` | Tries `element.click()`, then a synthetic `MouseEvent`, then a `TouchEvent` for mobile. |
| `findCouponButtons()` | Queries for coupon clip buttons by CSS selectors first, then falls back to text content matching (`'clip'`, `'clip coupon'`, `'clip to card'`). |
| `autoScroll()` | Scrolls the page to the bottom in increments to trigger lazy-loaded coupons. |
| `processButton(button)` | Clicks + scrolls a single button, waits `baseDelay`. |
| `processAllButtons()` | Runs `autoScroll`, then iterates all found buttons, checks for remaining ones. |
| `run()` | Outer loop: calls `processAllButtons` up to `maxAttempts` times. |
| `createLauncher()` | Injects a floating "Clip All Coupons" button into the page for convenience. |

The script is loaded remotely via jsDelivr CDN (`https://cdn.jsdelivr.net/gh/xpertdev/Bjs-Wholesale-Coupon-Bot@main/coupon-bot.js`).

## How Users Run It

- **Desktop**: Paste a `fetch(...).then(eval)` snippet into the browser console.
- **Mobile**: As a bookmarklet (`javascript:(function(){...})();`).
- **iOS Shortcuts**: Via the "Run JavaScript on Web Page" action.
- Users can set `window.customConfig = { baseDelay: ..., maxAttempts: ... }` before loading to tune behavior.

## Development Guidelines

- **No build tools, no npm, no bundler.** Do not add any. The script must remain a self-contained `.js` file that can be copy-pasted or fetched directly.
- **No external dependencies.** Only the browser's built-in APIs (`fetch`, `Promise`, `setTimeout`, DOM APIs).
- **Cross-browser compatibility is paramount.** All code must run in Chrome, Edge, Firefox, Safari (desktop and mobile). Avoid APIs with poor browser support. When in doubt, include fallbacks (see `safeClick` and `autoScroll` for examples).
- **Preserve the IIFE wrapper.** The outer `(() => { ... })()` prevents global scope pollution. All new code belongs inside it.
- **Configuration is done via `window.customConfig`.** Do not add new configuration mechanisms.
- **Console logging is intentional.** `console.log` and `console.error` calls provide user feedback in the browser console. Keep them.
- The `createLauncher()` floating button is optional UX — it removes itself after one click.

## Editing the Script

When modifying `coupon-bot.js`:

1. Keep the IIFE structure intact.
2. Update `findCouponButtons()` selectors if BJ's or other sites change their DOM.
3. Test `safeClick` fallbacks if adding new interaction methods.
4. Keep `autoScroll` before button discovery so lazy-loaded coupons are found.
5. Make sure `config.baseDelay` is used as the single delay value throughout (not separate browser-specific delays).

## Updating README.md

- The CDN URL in README snippets points to `@main` — it will always serve the latest `coupon-bot.js` from the main branch. No version pinning needed.
- If new configuration options are added to `defaultConfig`, document them in the README's troubleshooting section.
- The `clip-coupons.gif` is a static demo asset; only replace it if the bot's UX changes significantly.

## Known Limitations / Errors Encountered

- **Touch API support varies by browser:** `new Touch(...)` is not supported in all browsers, so the `TouchEvent` path in `safeClick` is wrapped in its own try/catch and silently fails. This is intentional.
- **Safari scrollIntoView behavior:** `scrollIntoView({ behavior: 'smooth' })` is unreliable in Safari, so `processButton` uses `'auto'` for Safari and `'smooth'` for others.
- **Lazy-loaded coupons:** `autoScroll` may not load all coupons on very long pages on the first pass. Increasing `maxAttempts` and re-running is the documented workaround.
- **Site DOM changes:** If BJ's updates their HTML, `findCouponButtons()` selectors may need updating. The text-content fallback (`'clip'`, etc.) provides resilience.
- **CSP restrictions:** Some browser environments or extensions may block `eval`. Users should paste the script directly in those cases.

## Testing

There are no automated tests. Manual testing is done by:
1. Navigating to `https://www.bjs.com/myCoupons` in a real browser.
2. Running the script from the console or bookmarklet.
3. Verifying coupon buttons are clicked and the console logs expected progress messages.

When making changes, manually verify in at least Chrome and Firefox before merging.
