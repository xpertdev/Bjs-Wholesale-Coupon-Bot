// Cross-browser compatible JavaScript for the BJ's Wholesale Coupon Bot
(() => {
  console.log('Starting BJs Wholesale Coupon Bot...');

  // Browser detection for compatibility
  const getBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('firefox') > -1) return 'firefox';
    if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) return 'safari';
    if (userAgent.indexOf('edge') > -1) return 'edge';
    return 'chrome'; // Default or Chrome
  };
  
  const browser = getBrowser();
  console.log(`Detected browser: ${browser}`);

  // Modern sleep implementation using Promises
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Cross-browser safe click function
  const safeClick = (element) => {
    try {
      // Try standard click first
      element.click();
    } catch (error) {
      // Fallback for older browsers: create and dispatch click event
      try {
        const evt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        element.dispatchEvent(evt);
      } catch (fallbackError) {
        // Ultimate fallback for very old browsers
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
      
      // Use our cross-browser click method
      safeClick(button);
      
      // Cross-browser safe scrolling
      try {
        button.scrollIntoView({behavior: browser === 'safari' ? 'auto' : 'smooth', block: 'center'});
      } catch (scrollError) {
        // Fallback scrolling for older browsers
        button.scrollIntoView(true);
      }
      
      // Safari and Firefox might need additional time
      const delayTime = browser === 'safari' || browser === 'firefox' ? 4000 : 3000;
      await sleep(delayTime);
      
      return true;
    } catch (error) {
      console.error('Error processing button:', error);
      return false;
    }
  };

  // Find all eligible coupon buttons with cross-browser compatibility
  const findCouponButtons = () => {
    // Try getElementsByName first (more reliable in most browsers)
    let buttons = document.getElementsByName('clipToCard');
    
    // If no buttons found, try alternative selectors based on browser
    if (!buttons || buttons.length === 0) {
      // Try by class or text content - common fallback approaches
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

  // Run the process with proper cleanup
  const run = async () => {
    let complete = false;
    let attempts = 0;
    const maxAttempts = browser === 'safari' ? 6 : 5; // Safari might need more attempts
    
    while (!complete && attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts}...`);
      complete = await processAllButtons();
      await sleep(3000);
    }
    
    console.log('Bot execution completed.');
  };

  // Start the process
  run();
})();