# BJ's Wholesale Coupon Bot

This simple script saves you time by automatically clipping every coupon on BJ’s Wholesale Club. Instead of clicking one coupon after another, you just run the bot and it does the work for you.

The tool works in any modern browser on desktop or mobile – no download or installation required. Just open the coupons page and run a tiny bit of JavaScript; the bot will clip coupons in the background.

![Clip Coupons](clip-coupons.gif)

---

## Getting Started

1. Sign in to your BJ’s account at **https://www.bjs.com/myCoupons**.
2. Make sure you can see your list of available coupons.
3. Follow the instructions below for **[desktop](#for-desktop-users)** or **[mobile](#for-mobile-users)**.

---

<a name="for-desktop-users"></a>
## For Desktop Users

1. Open your browser (Chrome, Edge, Firefox, or Safari) and go to the coupons page above.
2. Open the **browser console**:
   - **Windows Chrome/Edge**: press `F12` or `Ctrl + Shift + I`, then click the **Console** tab.
   - **Mac Chrome/Edge**: press `Option + ⌘ + J`.
   - **Firefox**: press `F12` (Windows) or `Option + ⌘ + K` (Mac).
   - **Safari**: first enable the **Develop** menu in Preferences → Advanced, then press `Option + ⌘ + C`.
3. Copy one of the blocks below and paste it into the console, then hit **Enter**.

```javascript
// simple version: runs the bot right away
fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js')
  .then(response => response.text())
  .then(code => eval(code))
  .catch(error => console.error('Error loading coupon bot:', error));
```

```javascript
// same as above, but you can change how fast it runs or how many sweeps it makes
window.customConfig = { baseDelay: 1800, maxAttempts: 6 };
fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js')
  .then(r => r.text())
  .then(eval);
```

> If you prefer, you can copy the entire contents of [`coupon-bot.js`](./coupon-bot.js) (in this repo) and paste that instead. Both methods do the same thing.

4. The bot will show a small floating button and begin clipping coupons automatically. You can keep using the page while it runs.
5. When the bot finishes, you can close the console or run the same command again if any coupons were missed (just press the **up arrow** in the console to recall it).

---

<a name="for-mobile-users"></a>
## For Mobile Users

### Bookmarklet (works in Safari, Chrome, Android browsers)

1. Create a new bookmark in your mobile browser (any page will do).
2. Edit the bookmark and replace its URL with the following code:

```javascript
javascript:(function(){fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js').then(r=>r.text()).then(eval);})();
```

3. Go to **https://www.bjs.com/myCoupons** and tap the bookmark. The bot will load and clip coupons without opening any menus.

### iOS Shortcuts (optional)

If you use the iOS **Shortcuts** app, you can set up a shortcut to run the script automatically:

1. Open **Shortcuts** and make a new shortcut.
2. Add the **"Run JavaScript on Web Page"** action and paste one of the snippets below.
   (Shortcuts requires the code to produce a final value, so the examples wrap the fetch in an async function.)

   ```javascript
   (async function(){
     const src = await fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js')
       .then(r=>r.text());
     eval(src);
   })();
   ```

   Alternatively, if you prefer to embed everything, paste the **entire contents** of [`coupon-bot.js`](./coupon-bot.js) and it will work without the wrapper.
3. (Optional) Add an **"Open URLs"** action pointing to `https://www.bjs.com/myCoupons`.
4. Enable **Show in Share Sheet** for Safari and save.

Now you can tap the shortcut from Safari’s share menu while on the coupons page.

---

## How It Works

The script clicks every “clip” button it finds, scrolling if necessary so all coupons load. It adjusts itself for different browsers and will retry a few times if something fails. No server or extra software is involved – everything runs inside your browser.

---

## Why This Tool Exists

Many grocery and wholesale club websites offer digital coupons, but the process of clipping these coupons is often frustrating. Ideally, digital coupons should be automatically applied at checkout, similar to Costco Wholesale, eliminating the need for manual clipping. However, due to poor user experience, this tool was created to address the following issues:

- Manually clicking dozens (or even hundreds) of individual "clip" buttons is tedious and time-consuming.
- Websites often load slowly between clicks, further complicating the process.
- It's easy to overlook coupons that could save you money.

This bot automates the entire process, saving you time and ensuring you don't miss out on any potential savings.

---

## Troubleshooting & Tips

- If some coupons remain after the bot stops, just run the same command again. No harm in repeating.
- Make sure you are on the BJ’s coupons page and logged in before running the script.
- If the bot seems too fast or too slow you can adjust `baseDelay`; if coupons keep remaining after it finishes, increase `maxAttempts` and run again. (See the second desktop snippet above.)
- You can safely close the console or switch tabs while the bot works.

---

## Supported Sites

This tool is known to work on several sites including the following:

- **BJ's Wholesale Club**: https://www.bjs.com/myCoupons
- **Harris Teeter**: https://www.harristeeter.com/savings/cl/coupons/
