// Cross-browser compatible JavaScript for the BJ's Wholesale Coupon Bot
// This script supports desktop browsers as well as iOS Shortcuts.
// When used in Shortcuts ("Run JavaScript on Webpage"), it will signal
// completion and show a message so the user knows it ran.
// make sure there is always a completion() function available;
// Shortcuts will insert one when running, but if we launch the shortcut
// without a webpage it may not exist at all and cause the "must call"
// error.  Our stub is safe and will be replaced if the real one arrives.
if (typeof completion !== 'function') {
  window.completion = function() {};
}
// immediately signal completion so the action won't throw an error later
try { completion('done'); } catch {}

// run the bot logic on the next tick to allow the shortcut to terminate
setTimeout(async () => {
  // helper for invoking any real completion callback (might be replaced
  // by the system later); we capture the current one in case it's changed.
  const callCompletion = (msg) => {
    if (typeof completion === 'function') {
      try { completion(msg); } catch (e) { console.error('completion error', e); }
      return true;
    }
    return false;
  };

  // ----- environment helpers -----
  // detect if we're running in iOS Shortcuts context (completion callback)
  const isIOSShortcuts = typeof completion === 'function';

  // logging helper - currently only writes to console.  UI log box was
  // removed to keep the screen clean; the page already shows buttons
  // disappearing as they are clipped.
  const log = (...args) => {
    console.log(...args);
  };

  // final message reporting; if completion() exists we call it directly
  // each time instead of relying on the cached isIOSShortcuts flag, because
  // Shortcuts may inject it late.  The fallback is an alert for browsers.
  const reportDone = (message) => {
    log(message);
    if (!callCompletion(message)) {
      // fall back to alert if completion still unavailable
      try { alert(message); } catch {}
    }
  };

  // simple global error catcher
  window.addEventListener('error', e => {
    log('Unhandled error:', e.message);
    reportDone('Error occurred - check console');
  });
  // also catch unhandled promise rejections which may not trigger window.onerror
  window.addEventListener('unhandledrejection', e => {
    log('Unhandled rejection:', e.reason);
    reportDone('Error occurred - check console');
  });

  // Default configuration parameters.  We pick slightly different
  // defaults depending on environment; iOS Shortcut runs tend to be
  // slower and require more attempts, so we bump the numbers when
  // `isIOSShortcuts` is true.
  const defaultConfig = {
    baseDelay: 1500, // uniform default delay in milliseconds for all environments
    firefoxDelay: 1500, // Delay for Firefox (ignores isIOS because iOS uses Safari APIs)
    safariDelay: 1500,
    maxAttempts: isIOSShortcuts ? 6 : 5, // allow extra rounds on mobile
    safariMaxAttempts: 6
  };

  // Configurable parameters - merge provided settings with defaults.  We
  // support all of the options previously exposed in both desktop and iOS
  // versions; mobile (iOS Shortcut) will ignore the browser-specific fields
  // but it's harmless to include them.
  const config = {
    baseDelay: typeof window.customConfig?.baseDelay === 'number' ? window.customConfig.baseDelay : defaultConfig.baseDelay,
    firefoxDelay: typeof window.customConfig?.firefoxDelay === 'number' ? window.customConfig.firefoxDelay : defaultConfig.firefoxDelay,
    safariDelay: typeof window.customConfig?.safariDelay === 'number' ? window.customConfig.safariDelay : defaultConfig.safariDelay,
    maxAttempts: typeof window.customConfig?.maxAttempts === 'number' ? window.customConfig.maxAttempts : defaultConfig.maxAttempts,
    safariMaxAttempts: typeof window.customConfig?.safariMaxAttempts === 'number' ? window.customConfig.safariMaxAttempts : defaultConfig.safariMaxAttempts
  };

  console.log('Starting BJs Wholesale Coupon Bot with the following configuration:');
  console.log(JSON.stringify(config, null, 2));

  // Browser detection for compatibility
  const getBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('firefox') > -1) return 'firefox';
    if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) return 'safari';
    // modern Edge uses "Edg" in the UA (lowercased to "edg/") so include that
    if (userAgent.indexOf('edge') > -1 || userAgent.indexOf('edg/') > -1) return 'edge';
    return 'chrome'; // Default or Chrome
  };
  
  const browser = getBrowser();
  console.log(`Detected browser: ${browser}`);

  // Modern sleep implementation using Promises
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Cross-browser/mobile safe click function.  On iOS Safari a simple
  // programmatic click on an off-screen element often does nothing, plus
  // some coupon buttons are implemented using touch events or pointer events.
  // We build up a set of fallbacks to maximise reliability.
  const safeClick = (element) => {
    const dispatch = (evt) => {
      try { element.dispatchEvent(evt); } catch {};
    };

    // 1. try the convenient DOM API
    try {
      element.click();
      return;
    } catch (_e) {}

    // 2. try a MouseEvent
    try {
      const evt = new MouseEvent('click', {view: window, bubbles: true, cancelable: true});
      dispatch(evt);
      return;
    } catch (_e) {}

    // 3. try pointer events (some newer mobile frameworks use them)
    try {
      const pEvt = new PointerEvent('pointerdown', {bubbles: true, cancelable: true});
      dispatch(pEvt);
      const pUp = new PointerEvent('pointerup', {bubbles: true, cancelable: true});
      dispatch(pUp);
      return;
    } catch (_e) {}

    // 4. try touch events
    try {
      const t0 = new TouchEvent('touchstart', {bubbles: true, cancelable: true});
      dispatch(t0);
      const t1 = new TouchEvent('touchend', {bubbles: true, cancelable: true});
      dispatch(t1);
      return;
    } catch (_e) {}

    // 5. ultimate fallback for very old browsers
    try {
      const evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      dispatch(evt);
    } catch (_e) {}
  };

  // Process one button at a time to prevent race conditions
  // Scroll the element into view *before* clicking; mobile browsers often
  // ignore programmatic clicks on off‑screen elements.
  const processButton = async (button) => {
    try {
      // console feedback only; not shown on screen
      log('Clipping coupon...');

      // button visibility and clicking only; no per-button logging since the
      // UI already shows items disappearing when they are clipped
      try {
        button.scrollIntoView({behavior: browser === 'safari' ? 'auto' : 'smooth', block: 'center'});
      } catch (scrollError) {
        try { button.scrollIntoView(true); } catch {};
      }

      safeClick(button);

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

  // Find all eligible coupon buttons.  We try a sequence of selectors
  // rather than relying on a single strategy so that changes on the site
  // are less likely to break the bot.
  const findCouponButtons = () => {
    const found = new Set();

    const addElements = (els) => {
      if (!els) return;
      Array.from(els).forEach(el => found.add(el));
    };

    // 1. name attribute (the most reliable historically)
    addElements(document.getElementsByName('clipToCard'));

    // 2. look for buttons/links with obvious text
    const textElems = Array.from(document.querySelectorAll('button, a')).filter(el => {
      const text = el.textContent.trim().toLowerCase();
      return text === 'clip' || text.includes('clip coupon');
    });
    addElements(textElems);

    // 3. some variations of class or data attributes
    addElements(document.querySelectorAll(
      '[data-automation-id="clipCoupon"], .clip-coupon-btn, .coupon-clip-btn, [data-clip], [aria-label*="clip coupon"]'
    ));

    // return as an array for ease of use
    return Array.from(found);
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
    // Use the appropriate maxAttempts value from config based on browser
    const maxAttempts = browser === 'safari' ? config.safariMaxAttempts : config.maxAttempts;
    
    while (!complete && attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts}...`);
      complete = await processAllButtons();
      await sleep(config.baseDelay); // Use config for between-attempts delay
    }
    
    console.log('Bot execution completed.');
    // Provide consistent user feedback across environments
    reportDone('Bot execution completed.');
    return true;
  };

  // Start the process asynchronously; the initial completion() call above
  // has already satisfied Shortcuts. Errors during execution are reported.
  try {
    await run();
  } catch (e) {
    console.error('Fatal error during run:', e);
    reportDone('Error occurred - see console');
  }
}, 0);