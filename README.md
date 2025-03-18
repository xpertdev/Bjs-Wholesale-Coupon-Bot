# BJs Wholesale Coupon Bot

An automated tool to clip all available coupons on your BJ's Wholesale account with a single click.

## Instructions

1. Open https://www.bjs.com/myCoupons in Google Chrome or Microsoft Edge
2. Sign in to your BJ's Wholesale account
3. Open the browser console:
   - Windows: Press F12 or right-click and select "Inspect", then click on "Console" tab
   - Mac: Press Option+⌘+J (Chrome) or Option+⌘+I (Safari), then click on "Console" tab
   - Guide: https://developers.google.com/web/tools/chrome-devtools/console/javascript
4. Copy and paste one of the following options:

### Option 1: Direct GitHub Link
Copy and paste this single line into your console:
```javascript
fetch('https://raw.githubusercontent.com/xpertdev/Bjs-Wholesale-Coupon-Bot/main/coupon-bot.js').then(r => r.text()).then(code => eval(code));
```

### Option 2: Copy Full Code
Copy the contents from the [coupon-bot.js](./coupon-bot.js) file and paste it into the console.

The bot will automatically:
- Find all available coupons on the page
- Click each "Clip" button one by one 
- Scroll each coupon into view as it's clipped
- Continue until all coupons are clipped or maximum attempts are reached

> **Note:** If some coupons remain unclipped after the script finishes, you may need to run it again. Simply press the up arrow in the console to recall the previous command and press Enter to execute it again.

## How It Works

The script uses JavaScript to interact with the BJ's website, locating and clicking all coupon buttons. It includes error handling and will automatically retry if needed.

No additional setup or installation is required - just copy, paste and run in the browser console!
