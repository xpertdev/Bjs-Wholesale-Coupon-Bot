// Cross-browser compatible JavaScript for the BJ's Wholesale Coupon Bot
(() => {
  // Default configuration parameters
  const defaultConfig = {
    baseDelay: 1500, // Base delay in milliseconds for Chrome/Edge
    firefoxDelay: 1500, // Delay for Firefox
    safariDelay: 1500, // Delay for Safari
    maxAttempts: 5, // Default max attempts
    safariMaxAttempts: 6 // Max attempts for Safari
  };

  // Configurable parameters - merged with defaults to handle undefined/null values
  // This allows partial configuration through customConfig in the console
  const config = {
    baseDelay: typeof window.customConfig?.baseDelay === 'number' ? window.customConfig.baseDelay : defaultConfig.baseDelay,
    firefoxDelay: typeof window.customConfig?.firefoxDelay === 'number' ? window.customConfig.firefoxDelay : defaultConfig.firefoxDelay,
    safariDelay: typeof window.customConfig?.safariDelay === 'number' ? window.customConfig.safariDelay : defaultConfig.safariDelay,
    maxAttempts: typeof window.customConfig?.maxAttempts === 'number' ? window.customConfig.maxAttempts : defaultConfig.maxAttempts,
    safariMaxAttempts: typeof window.customConfig?.safariMaxAttempts === 'number' ? window.customConfig.safariMaxAttempts : defaultConfig.safariMaxAttempts
  };

  console.log('Starting BJs Wholesale Coupon Bot with the following configuration:');
  console.log(JSON.stringify(config, null, 2));

  // Browser detection for compatibility (desktop & mobile)
  const getBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('firefox') > -1) return 'firefox';
    if (ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1) return 'safari';
    if (ua.indexOf('edge') > -1) return 'edge';
    return 'chrome';
  };
  const browser = getBrowser();
  console.log(`Detected browser: ${browser}`);
  console.log(`Mobile device: ${/iphone|ipad|ipod|android/.test(navigator.userAgent.toLowerCase())}`);

  // Modern sleep implementation using Promises
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Cross-browser safe click function (includes mobile/touch fallbacks)
  const safeClick = (element) => {
    try {
      // Try standard click first
      element.click();
      return;
    } catch (error) {
      // ignore and try other methods
    }

    // Dispatch synthetic click event
    try {
      const evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      element.dispatchEvent(evt);
      return;
    } catch (_err) {
      // fallback below
    }

    // On touch devices we can try dispatching a touchend event
    try {
      const touchObj = new Touch({
        identifier: Date.now(),
        target: element,
        clientX: 0,
        clientY: 0,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5
      });
      const touchEvent = new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj]
      });
      element.dispatchEvent(touchEvent);
    } catch (_err) {
      // ultimate no-op if even this fails
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
      
      // Use browser-specific delay from config
      let delayTime;
      if (browser === 'firefox') {
        delayTime = config.firefoxDelay;
      } else if (browser === 'safari') {
        delayTime = config.safariDelay;
      } else {
        delayTime = config.baseDelay;
      }
      
      await sleep(delayTime);
      
      return true;
    } catch (error) {
      console.error('Error processing button:', error);
      return false;
    }
  };

  // Find all eligible coupon buttons/links (works on desktop & mobile layouts)
  const findCouponButtons = () => {
    let buttons = Array.from(document.querySelectorAll(
      'button[name="clipToCard"], button[data-automation-id="clipCoupon"], button.clip-coupon-btn, button.coupon-clip-btn, a.clip-coupon, a[data-automation-id="clipCoupon"]'
    ));

    if (buttons.length === 0) {
      // fallback scan all buttons and links by visible text
      buttons = Array.from(document.querySelectorAll('button, a')).filter(el => {
        const txt = (el.textContent || '').trim().toLowerCase();
        return txt === 'clip' || txt.includes('clip coupon') || txt.includes('clip to card');
      });
    }
    return buttons;
  };

  // Helper: scroll through page/container to load lazy coupons
  const autoScroll = async () => {
    const container = document.scrollingElement || document.documentElement;
    let lastHeight = -1;
    // scroll until height stops increasing
    while (container.scrollHeight !== lastHeight) {
      lastHeight = container.scrollHeight;
      container.scrollBy(0, window.innerHeight || 1000);
      await sleep(500);
    }
  };

  // Main function to process all buttons
  const processAllButtons = async () => {
    // first try to load everything (important on mobile/infinite scroll)
    await autoScroll();

    const buttons = findCouponButtons();
    console.log(`${buttons.length} coupons found.`);
    
    if (buttons.length === 0) {
      console.log('No coupons to clip. Done!');
      return true;
    }

    for (const button of buttons) {
      await processButton(button);
    }
    
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
    // Use the appropriate maxAttempts value from config based on browser
    const maxAttempts = browser === 'safari' ? config.safariMaxAttempts : config.maxAttempts;
    
    while (!complete && attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts}...`);
      complete = await processAllButtons();
      await sleep(config.baseDelay); // Use config for between-attempts delay
    }
    
    console.log('Bot execution completed.');
  };

  // OPTIONAL: create a small floating button users can tap/click to start the bot
  const createLauncher = () => {
    if (document.getElementById('coupon-bot-launcher')) return;
    const btn = document.createElement('button');
    btn.id = 'coupon-bot-launcher';
    btn.textContent = 'Clip All Coupons';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '12px',
      right: '12px',
      zIndex: 2147483647,
      padding: '8px 14px',
      backgroundColor: '#0074cc',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: 'pointer',
      opacity: '0.8'
    });
    btn.addEventListener('click', run);
    // remove after click to avoid duplicates
    btn.addEventListener('click', () => btn.remove());
    document.body.appendChild(btn);
  };

  // create launcher for user convenience, works on desktop & mobile
  createLauncher();

  // Start the process immediately by default
  run();
})();