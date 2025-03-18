// JavaScript code for the BJ's Wholesale Coupon Bot
(() => {
  console.log('Starting BJs Wholesale Coupon Bot...');

  // Modern sleep implementation using Promises
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Process one button at a time to prevent race conditions
  const processButton = async (button) => {
    try {
      console.log('Clipping coupon...');
      button.click();
      button.scrollIntoView({behavior: 'smooth', block: 'center'});
      await sleep(3000); // Keep the same delay timing
      return true;
    } catch (error) {
      console.error('Error processing button:', error);
      return false;
    }
  };

  // Main function to process all buttons
  const processAllButtons = async () => {
    const buttons = document.getElementsByName('clipToCard');
    console.log(`${buttons.length} coupons found.`);
    
    if (buttons.length === 0) {
      console.log('No coupons to clip. Done!');
      return true;
    }

    // Convert HTMLCollection to Array and process each button
    // We make a copy of the buttons to avoid issues with live collections
    const buttonsArray = Array.from(buttons);
    
    for (const button of buttonsArray) {
      await processButton(button);
      // We don't need to manually remove the button as the page will update
    }
    
    // Check if more buttons appeared
    const remainingButtons = document.getElementsByName('clipToCard');
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
    const maxAttempts = 5; // Prevent infinite loops
    
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