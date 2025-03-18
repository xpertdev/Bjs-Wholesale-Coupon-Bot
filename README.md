# BJs Wholesale Coupon Bot

An automated tool to clip all available coupons on your BJ's Wholesale account with a single click. Now compatible with Chrome, Edge, Safari, and Firefox.

## Instructions

1. Open https://www.bjs.com/myCoupons in your browser
2. Sign in to your BJ's Wholesale account
3. Open the browser console:
   - **Chrome/Edge (Windows)**: Press F12 or right-click and select "Inspect", then click on "Console" tab
   - **Chrome/Edge (Mac)**: Press Option+⌘+J, then click on "Console" tab
   - **Safari**: Press Option+⌘+C (first enable Developer menu in Safari > Preferences > Advanced)
   - **Firefox**: Press F12 (Windows) or Option+⌘+K (Mac), then click on "Console" tab
   - Guide: https://developers.google.com/web/tools/chrome-devtools/console/javascript
4. Copy and paste one of the following options:

### Option 1: Direct GitHub Link
Copy and paste this into your console:
```javascript
fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js')
  .then(response => response.text())
  .then(code => eval(code))
  .catch(error => console.error('Error loading coupon bot:', error));
```

### Option 2: Copy Full Code
Copy the contents from the [coupon-bot.js](./coupon-bot.js) file and paste it into the console.

The bot will automatically:
- Detect your browser type and adjust functionality accordingly
- Find all available coupons on the page using multiple detection methods
- Click each "Clip" button one by one with cross-browser compatible methods
- Scroll each coupon into view as it's clipped
- Continue until all coupons are clipped or maximum attempts are reached

> **Note:** If some coupons remain unclipped after the script finishes, you may need to run it again. Simply press the up arrow in the console to recall the previous command and press Enter to execute it again.

## Browser Compatibility Notes

- **Chrome/Edge**: Fully supported with smooth scrolling.
- **Firefox**: Supported with adjusted timing for proper coupon clipping.
- **Safari**: Supported with alternative scrolling behavior and extended timing.

## How It Works

The script uses cross-browser compatible JavaScript to interact with the BJ's website, locating and clicking all coupon buttons regardless of browser differences. It includes error handling, browser detection, and will automatically retry if needed.

No additional setup or installation is required - just copy, paste and run in the browser console!
