# BJs Wholesale Coupon Bot

An automated tool to clip all available coupons on your BJ's Wholesale account with a single click.

![Clip Coupons](clip-coupons.gif)

## Instructions

1. Open https://www.bjs.com/myCoupons in your browser
2. Sign in to your BJ's Wholesale account
3. Open the browser console:
   - **Chrome/Edge (Windows)**: Press F12 or Ctrl+Shift+I or right-click and select "Inspect", then click on "Console" tab
   - **Chrome/Edge (Mac)**: Press Option+⌘+J, then click on "Console" tab
   - **Safari**: Press Option+⌘+C (first enable Developer menu in Safari > Preferences > Advanced)
   - **Firefox**: Press F12 (Windows) or Option+⌘+K (Mac), then click on "Console" tab
   - Guide: https://developers.google.com/web/tools/chrome-devtools/console/javascript
4. Copy and paste one of the following options:

### Option 1: Direct GitHub Link
Copy and paste this into your console to run with default settings:
```javascript
fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js')
  .then(response => response.text())
  .then(code => eval(code))
  .catch(error => console.error('Error loading coupon bot:', error));
```

If you want to customize settings (for example, to make the bot run faster or slower), use this version:
```javascript
// Change any values you want to customize
window.customConfig = {
  baseDelay: 1800  // Sleep timeout in ms. Try 5000 for slower connections or 1000 for faster clipping (default: 1000ms).
};

// Run the bot with your custom settings
fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js')
  .then(response => response.text())
  .then(code => eval(code))
  .catch(error => console.error('Error loading coupon bot:', error));
```

> **Tip for mobile users:** copy the link above and create a bookmark on your phone. Edit the bookmark and replace the URL with the following *bookmarklet* code. When you navigate to the coupons page, just tap the bookmark to run the bot without ever opening the console.
>
> ```javascript
> javascript:(function(){fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js').then(r=>r.text()).then(eval);})();
> ```
> (It’s plain vanilla JS – no server or Node dependencies – so it works in Safari iOS, Chrome Android, desktop browsers, etc.)

### Option 2: Copy Full Code
Copy the contents from the [coupon-bot.js](./coupon-bot.js) file and paste it into the console.

The bot will automatically:
- Detect your browser type (including mobile Safari/Chrome) and adjust functionality accordingly
- Inject a small floating "Clip All Coupons" button in the corner so you can start it with a tap on any device
- Find all available coupons on the page using multiple detection methods (buttons and links)
- Scroll through the page/container to load lazily‑loaded coupons
- Click each "Clip" control one by one with cross-browser compatible methods (including touch events)
- Continue until all coupons are clipped or maximum attempts are reached

> **Note:** If some coupons remain unclipped after the script finishes, you may need to run it again. Simply press the up arrow in the console to recall the previous command and press Enter to execute it again.

## Browser Compatibility Notes

- **Chrome/Edge**: Fully supported with smooth scrolling.
- **Firefox**: Supported with adjusted timing for proper coupon clipping.
- **Safari**: Supported with alternative scrolling behavior and extended timing.

### iOS Shortcuts App (Safari)

You can run the script from an iPhone or iPad using the built-in **Shortcuts** application without manually opening the console.

1. Open the **Shortcuts** app and create a new shortcut.
2. Add the action **"Run JavaScript on Web Page"** (under Safari actions).
3. In the text field paste one of the following (bookmarklet-style) snippets:

   ```javascript
   fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js')
     .then(r => r.text())
     .then(eval);
   ```

   or, if you prefer to embed the code directly, paste the entire contents of `coupon-bot.js`.

4. Add another action **"Open URLs"** if you want the shortcut to automatically navigate to
   `https://www.bjs.com/myCoupons` first.
5. Enable **Show in Share Sheet** (optional) and restrict to Safari if desired.
6. Save the shortcut with a descriptive name such as "BJ’s Clip Coupons".

Now, when you are on the coupons page in Safari, open the share sheet and tap your shortcut. The JavaScript will execute on the page and the floating "Clip All Coupons" button appears, or it will run immediately if you embedded the script.

> **Note:** No modifications to the core script are required for Shortcuts. It already
> runs in the Safari JavaScript context. The bookmarklet/thumbtack code above is all you need.

## How It Works

The script uses cross-browser compatible JavaScript to interact with coupon websites, locating and clicking all coupon buttons regardless of browser differences. It includes error handling, browser detection, and will automatically retry if needed.

No additional setup or installation is required - just copy, paste and run in the browser console!

## Configuration Options

The script includes several configurable parameters that can be adjusted to optimize performance:

```javascript
const config = {
  baseDelay: 2000,       // Base delay in milliseconds for Chrome/Edge (default: 1000ms)
  firefoxDelay: 4000,    // Delay for Firefox (default: 1500ms)
  safariDelay: 4000,     // Delay for Safari (default: 1500ms)
  maxAttempts: 5,        // Default max attempts for Chrome/Edge/Firefox (default: 5)
  safariMaxAttempts: 6   // Max attempts for Safari (default: 6)
};
```

You can modify these values in the console before running the script if you need to:
- Increase delays if the website is slow or coupons aren't clipping properly
- Decrease delays if the website is responsive and you want faster clipping
- Adjust max attempts based on how many coupons you typically need to process

## Why This Tool Exists

Many grocery and wholesale club websites offer digital coupons, but the process of clipping these coupons is often frustrating. Ideally, digital coupons should be automatically applied at checkout, similar to Costco Wholesale, eliminating the need for manual clipping. However, due to poor user experience, this tool was created to address the following issues:

- Manually clicking dozens (or even hundreds) of individual "clip" buttons is tedious and time-consuming.
- Websites often load slowly between clicks, further complicating the process.
- It's easy to overlook coupons that could save you money.

This bot automates the entire process, saving you time and ensuring you don't miss out on any potential savings.

## Supported Websites

This tool is known to work on several sites including the following:

- **BJ's Wholesale Club**: https://www.bjs.com/myCoupons
- **Harris Teeter**: https://www.harristeeter.com/savings/cl/coupons/
