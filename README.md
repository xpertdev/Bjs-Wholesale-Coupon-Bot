# BJs Wholesale Coupon Bot

An automated tool to clip all available coupons on your BJ's Wholesale account with a single click. **Now works on iPhone Safari!**

![Clip Coupons](clip-coupons.gif)

## Instructions

### Option A: iPhone Safari (Using iOS Shortcuts)

**Perfect for clipping coupons on the go from your iPhone!**

1. **One-time setup**: Create a new iOS Shortcut
   - Open the **Shortcuts** app on your iPhone
   - Tap the **+** button to create a new shortcut
   - Search for and add the **"Run JavaScript on Webpage"** action
   - Copy the entire contents from [coupon-bot-ios.js](./coupon-bot-ios.js) and paste it into the script field
   - Give your shortcut a name like "Clip BJ's Coupons"
   - Tap **Done** to save
   
2. **Using the shortcut**:
   - Open Safari on your iPhone and go to https://www.bjs.com/myCoupons
   - Sign in to your BJ's Wholesale account
   - Tap the Share button (square with arrow pointing up)
   - Scroll down and select your "Clip BJ's Coupons" shortcut
   - Wait for the script to complete (you'll see coupons being clipped automatically)
   
**Tips for iOS**:
- Make sure you're signed into BJ's before running the shortcut
- The script may need to run multiple times if you have many coupons
- You can rerun the shortcut immediately if some coupons remain
- For more details on iOS Shortcuts, see: https://support.apple.com/guide/shortcuts/use-the-run-javascript-on-webpage-action-apdb71a01d93/ios

**Customizing iOS version** (optional):
If you need to adjust the speed, edit the script before pasting into Shortcuts:
- Find `baseDelay: 1500` and change to a higher value (e.g., `2500`) for slower/more reliable clipping
- Find `maxAttempts: 6` and change to a higher value if you have many coupons

### Option B: Desktop Browser (Console Method)

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

- **iPhone Safari (iOS Shortcuts)**: Fully supported! Use the iOS-specific version (coupon-bot-ios.js) with the Shortcuts app.
- **Chrome/Edge**: Fully supported with smooth scrolling.
- **Firefox**: Supported with adjusted timing for proper coupon clipping.
- **Safari (Desktop)**: Supported with alternative scrolling behavior and extended timing.

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
