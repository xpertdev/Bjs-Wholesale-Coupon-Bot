// BJ's Wholesale Coupon Bot - iOS Safari Shortcuts Version
// This version is optimized for use with iOS Shortcuts "Run JavaScript on Webpage" action
// Copy this entire script and paste it into your iOS Shortcut

// IMPORTANT: iOS Shortcuts require the script to use completion() to signal done
// This script automatically detects if it's running in iOS Shortcuts context

(async () => {
  // Default configuration parameters
  const defaultConfig = {
    baseDelay: 1500, // Slightly higher delay for mobile (default: 1500ms)
    maxAttempts: 6 // More attempts for mobile
  };

  // Configurable parameters - can be customized before pasting
  const config = {
    baseDelay: typeof window.customConfig?.baseDelay === 'number' ? window.customConfig.baseDelay : defaultConfig.baseDelay,
    maxAttempts: typeof window.customConfig?.maxAttempts === 'number' ? window.customConfig.maxAttempts : defaultConfig.maxAttempts
  };

  console.log('Starting BJ\'s Wholesale Coupon Bot (iOS Version)');
  console.log('Configuration:', JSON.stringify(config, null, 2));

  // Detect if running in iOS Shortcuts context
  const isIOSShortcuts = typeof completion !== 'undefined';

  // Modern sleep implementation using Promises
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Mobile-safe click function
  const safeClick = (element) => {
    try {
      // Try standard click first
      element.click();
    } catch (error) {
      // Fallback: create and dispatch click event
      try {
        const evt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        element.dispatchEvent(evt);
      } catch (fallbackError) {
        // Ultimate fallback
        const evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        element.dispatchEvent(evt);
      }
    }
  };

  // Process one button at a time to prevent race conditions
  const processButton = async (button) => {
    try {
      console.log('Clipping coupon...');
      
      // Use mobile-safe click method
      safeClick(button);
      
      // Mobile-safe scrolling (use 'auto' behavior for better mobile compatibility)
      try {
        button.scrollIntoView({behavior: 'auto', block: 'center'});
      } catch (scrollError) {
        // Fallback scrolling
        button.scrollIntoView(true);
      }
      
      // Wait for the action to complete
      await sleep(config.baseDelay);
      
      return true;
    } catch (error) {
      console.error('Error processing button:', error);
      return false;
    }
  };

  // Find all eligible coupon buttons
  const findCouponButtons = () => {
    // Try getElementsByName first (more reliable)
    let buttons = document.getElementsByName('clipToCard');
    
    // If no buttons found, try alternative selectors
    if (!buttons || buttons.length === 0) {
      buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
        const text = btn.textContent.trim().toLowerCase();
        return text === 'clip' || text.includes('clip coupon');
      });
      
      // If still no results, try other common attributes
      if (!buttons || buttons.length === 0) {
        buttons = document.querySelectorAll('[data-automation-id="clipCoupon"], .clip-coupon-btn, .coupon-clip-btn');
      }
    }
    
    return buttons;
  };

  // Main function to process all buttons
  const processAllButtons = async () => {
    const buttons = findCouponButtons();
    console.log(`${buttons.length} coupons found.`);
    
    if (buttons.length === 0) {
      console.log('No coupons to clip. Done!');
      return true;
    }

    // Convert collection to Array and process each button
    const buttonsArray = Array.from(buttons);
    
    for (const button of buttonsArray) {
      await processButton(button);
    }
    
    // Check if more buttons appeared
    const remainingButtons = findCouponButtons();
    if (remainingButtons.length > 0) {
      console.log(`${remainingButtons.length} coupons still remaining. Running again...`);
      return false;
    }
    
    console.log('All coupons successfully clipped!');
    return true;
  };

  // Run the process
  const run = async () => {
    let complete = false;
    let attempts = 0;
    
    while (!complete && attempts < config.maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts}/${config.maxAttempts}...`);
      complete = await processAllButtons();
      await sleep(config.baseDelay);
    }
    
    const message = 'Bot execution completed. Check the page for clipped coupons.';
    console.log(message);
    
    // If running in iOS Shortcuts, call completion() to signal done
    if (isIOSShortcuts) {
      completion(message);
    }
    
    return message;
  };

  // Start the process and return result
  return await run();
})();
